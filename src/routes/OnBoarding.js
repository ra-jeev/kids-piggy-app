import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Heading,
  Collection,
  Button,
  Text,
  Icon,
  SelectField,
  Card,
} from '@aws-amplify/ui-react';
import { AddChild } from '../components/AddChild';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Child, User, Currency, Transaction } from '../models';
import { MdPersonAddAlt } from 'react-icons/md';
import { calculateNextPayout } from '../utils';

export function OnBoarding() {
  const defaultChildProps = {
    name: '',
    hasNameError: false,
    balance: '',
    pocketMoney: '',
    schedule: '',
    nextMoneyAt: '',
    hasScheduleError: false,
  };

  const [userData, setUserData] = useState(null);
  const userSubscription = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [children, setChildren] = useState([{ ...defaultChildProps }]);
  const [currency, setCurrency] = useState({ value: '', error: false });
  const navigate = useNavigate();

  useEffect(() => {
    const observeUser = () => {
      return DataStore.observeQuery(User, Predicates.ALL).subscribe(
        (snapshot) => {
          if (snapshot.items && snapshot.items.length) {
            if (snapshot.items[0].onBoarded) {
              navigate('/dashboard');
            } else {
              setUserData(snapshot.items[0]);
            }
          }
        }
      );
    };

    if (!userSubscription.current) {
      userSubscription.current = observeUser();
    }

    return () => {
      userSubscription.current.unsubscribe();
      userSubscription.current = null;
    };
  }, [navigate]);

  const finishOnBoarding = async () => {
    let hasError = false;
    for (const child of children) {
      if (!child.name) {
        child.hasNameError = true;
        hasError = true;
      }

      if (child.pocketMoney && child.pocketMoney !== '0' && !child.schedule) {
        child.hasScheduleError = true;
        hasError = true;
      }
    }

    if (hasError) {
      setChildren([...children]);
    }

    if (!currency.value) {
      setCurrency({ ...currency, error: true });
      hasError = true;
    }

    if (hasError || !children.length) {
      return;
    }

    await DataStore.save(
      User.copyOf(userData, (item) => {
        item.currency = currency.value;
        item.onBoarded = true;
      })
    );

    for (const child of children) {
      const childData = {
        name: child.name.trim(),
        balance: child.balance ? parseFloat(child.balance) : 0,
        pocketMoney: child.pocketMoney ? parseFloat(child.pocketMoney) : 0,
        schedule: child.schedule,
        userID: userData.id,
      };

      if (child.nextMoneyAt) {
        childData.nextMoneyAt = parseInt(child.nextMoneyAt.getTime() / 1000);
      }

      const res = await DataStore.save(new Child(childData));
      if (childData.balance) {
        await DataStore.save(
          new Transaction({
            amount: childData.balance,
            comment: '💰 Piggy bank created',
            userID: userData.id,
            childID: res.id,
          })
        );
      }
    }

    navigate('/dashboard', { replace: true });
  };

  const handleChange = (index, key, value) => {
    const child = children[index];
    if (key === 'name') {
      child.hasNameError = !value.trim();
    } else if (key === 'pocketMoney' && (!value || value === '0')) {
      child.hasScheduleError = false;
      child.nextMoneyAt = '';
    } else if (key === 'schedule') {
      child.hasScheduleError = !value;
      child.nextMoneyAt = calculateNextPayout(value);
    }

    child[key] = value;

    setChildren([...children]);
  };

  const handleChildDelete = (index) => {
    children.splice(index, 1);
    setChildren([...children]);
  };

  return (
    <Flex alignItems='center' justifyContent='center' padding='1rem' grow={1}>
      {currentStep === 1 && (
        <Card
          textAlign='center'
          padding={{ base: 'medium', large: 'xl' }}
          width='32rem'
          maxWidth='100%'
        >
          <Flex direction='column'>
            {userData ? (
              <Heading level={2} fontSize={{ base: 'xxl', large: 'xxxl' }}>
                Hi {userData.name} 👋,
              </Heading>
            ) : (
              ''
            )}

            <Heading
              level={4}
              marginBlock='0.5rem'
              fontSize={{ base: 'large', large: 'xl' }}
            >
              Welcome to Kids Piggy App.
            </Heading>

            <Text>
              This app is meant to keep track of your kids' piggy money. It also
              handles the auto credit of their pocket money (if any...) , as per
              the schedule set by you.
            </Text>

            <Text marginBlock='1rem'>
              As the next step we'll setup the app. We suggest that you{' '}
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                complete this process with your kid(s).
              </span>
            </Text>
            <Text>To get started please click on the 'Next' button</Text>
            <Button
              marginTop='0.5rem'
              variation='primary'
              onClick={() => setCurrentStep(2)}
            >
              Next
            </Button>
          </Flex>
        </Card>
      )}

      {currentStep === 2 && (
        <Flex direction='column' width='32rem' maxWidth='100%'>
          <Card padding={{ base: 'medium', large: 'xl' }}>
            <Heading level={4} fontSize={{ base: 'large', large: 'xl' }}>
              Set your currency
            </Heading>
            <SelectField
              placeholder='Please select your currency'
              label='What is your currency?'
              value={currency.value}
              hasError={currency.error}
              errorMessage='Currency is required'
              marginTop='1rem'
              onChange={(event) =>
                setCurrency({
                  value: event.target.value,
                  error: !event.target.value,
                })
              }
            >
              {Object.keys(Currency).map((key, index) => (
                <option
                  key={index}
                  value={Currency[key]}
                  label={Currency[key]}
                />
              ))}
            </SelectField>
          </Card>

          <Card padding={{ base: 'medium', large: 'xl' }}>
            <Flex direction='column' gap='1.5rem'>
              <Heading level={4} fontSize={{ base: 'large', large: 'xl' }}>
                Add your kids' details
              </Heading>
              <Collection
                items={children}
                searchNoResultsFound={
                  <Text variation='error'>Please add at least one kid</Text>
                }
              >
                {(item, index) => (
                  <AddChild
                    key={index}
                    index={index}
                    data={item}
                    onDataChange={handleChange}
                    onDelete={handleChildDelete}
                  />
                )}
              </Collection>

              <Button
                gap='0.5rem'
                onClick={() =>
                  setChildren([...children, { ...defaultChildProps }])
                }
              >
                <Icon
                  ariaLabel='Add kid'
                  as={MdPersonAddAlt}
                  fontSize='1.25rem'
                />
                {children.length ? 'Add another kid?' : 'Add kid'}
              </Button>
            </Flex>
          </Card>
          <Button variation='primary' onClick={finishOnBoarding}>
            Submit
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

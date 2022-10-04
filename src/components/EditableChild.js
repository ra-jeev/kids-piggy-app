import {
  Flex,
  Heading,
  Card,
  Alert,
  Icon,
  Button,
  TextField,
  SelectField,
} from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';
import { Child, Transaction, Frequency } from '../models';
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { calculateNextPayout } from '../utils';

export const EditableChild = ({
  child,
  currency,
  isNew,
  userId,
  cancelAdd,
}) => {
  const [childEditable, setChildEditable] = useState(false);
  const [result, setResult] = useState({ type: '', description: '' });
  const [childForm, setChildForm] = useState({
    name: child.name,
    hasNameError: false,
    balance: child.balance,
    pocketMoney: child.pocketMoney,
    schedule: child.schedule,
    nextMoneyAt: child.nextMoneyAt,
    hasScheduleError: false,
  });

  useEffect(() => {
    if (isNew) {
      setChildEditable(true);
    }
  }, [isNew]);

  useEffect(() => {
    if (result.type === 'success') {
      const timer = setTimeout(() => {
        setResult({ type: '', description: '' });
        if (isNew) {
          cancelAdd();
        }
      }, 2500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [result, isNew, cancelAdd]);

  const handleFormChange = (key, value) => {
    const data = {};

    if (key === 'name') {
      data.hasNameError = !value.trim();
    } else if (key === 'pocketMoney' && (!value || value === '0')) {
      data.hasScheduleError = false;
      data.nextMoneyAt = '';
    } else if (key === 'schedule') {
      data.hasScheduleError = !value;
      data.nextMoneyAt = calculateNextPayout(value);
    }

    data[key] = value;

    setChildForm({ ...childForm, ...data });
  };

  const saveChanges = async () => {
    if (!childForm.name || (childForm.pocketMoney && !childForm.schedule)) {
      const data = {};

      if (!childForm.name) {
        data.hasNameError = true;
      }

      if (childForm.pocketMoney && !childForm.schedule) {
        data.hasScheduleError = true;
      }

      setChildForm({ ...childForm, ...data });

      return;
    } else if (
      !isNew &&
      childForm.name === child.name &&
      childForm.pocketMoney === child.pocketMoney &&
      childForm.schedule === child.schedule
    ) {
      setResult({ type: 'info', description: 'No changes detected' });
      return;
    }

    if (!childForm.pocketMoney) {
      childForm.schedule = undefined;
      childForm.nextMoneyAt = undefined;
    } else if (isNew || childForm.schedule !== child.schedule) {
      childForm.nextMoneyAt = calculateNextPayout(childForm.schedule);
      if (childForm.nextMoneyAt) {
        childForm.nextMoneyAt = parseInt(
          childForm.nextMoneyAt.getTime() / 1000
        );
      }
    }

    try {
      if (isNew) {
        const data = {
          name: childForm.name.trim(),
          balance: childForm.balance ? parseFloat(childForm.balance) : 0,
          pocketMoney: childForm.pocketMoney
            ? parseFloat(childForm.pocketMoney)
            : 0,
          schedule: childForm.schedule,
          userID: userId,
          nextMoneyAt: childForm.nextMoneyAt,
        };

        const res = await DataStore.save(new Child(data));
        if (data.balance) {
          await DataStore.save(
            new Transaction({
              amount: data.balance,
              comment: '💰 Piggy bank created',
              userID: userId,
              childID: res.id,
            })
          );
        }

        setResult({
          type: 'success',
          description: 'Kid entry successfully added',
        });
      } else {
        await DataStore.save(
          Child.copyOf(child, (item) => {
            item.name = childForm.name.trim();
            item.pocketMoney = childForm.pocketMoney
              ? parseFloat(childForm.pocketMoney)
              : 0;
            item.schedule = childForm.schedule;
            item.nextMoneyAt = childForm.nextMoneyAt;
            item.balance = childForm.balance
              ? parseFloat(childForm.balance)
              : 0;
          })
        );

        setResult({
          type: 'success',
          description: 'Changes saved successfully',
        });

        setChildEditable(false);
      }
    } catch (error) {
      console.log('failed to save child changes: ', error);
      setResult({ type: 'error', description: 'Failed to save the changes' });
    }
  };

  const cancelChanges = () => {
    if (isNew) {
      cancelAdd();
    } else {
      setChildForm({ ...childForm, ...child });
      setChildEditable(false);
    }
  };

  return (
    <Card
      borderRadius='medium'
      variation='elevated'
      padding={{ base: 'medium', large: 'xl' }}
    >
      <Flex direction='column'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading level={5}>
            {isNew ? "Add kid's details" : child.name}
          </Heading>
          {!childEditable && (
            <Button padding='0.5rem' onClick={() => setChildEditable(true)}>
              <Icon fontSize='1.25rem' ariaLabel='Edit child' as={MdEdit} />
            </Button>
          )}
        </Flex>

        <TextField
          label='Name'
          placeholder="Kid's name"
          value={childForm.name}
          readOnly={!childEditable}
          hasError={childForm.hasNameError}
          errorMessage='Name is required'
          onChange={(event) => handleFormChange('name', event.target.value)}
        />

        {isNew && (
          <TextField
            label={`Starting balance (in ${currency})`}
            placeholder="Kid's current balance"
            value={childForm.balance}
            type='number'
            onChange={(event) =>
              handleFormChange('balance', event.target.value)
            }
          />
        )}

        <TextField
          label={`Pocket money (in ${currency})`}
          placeholder="Kid's pocket money amount"
          value={childForm.pocketMoney}
          readOnly={!childEditable}
          type='number'
          onChange={(event) =>
            handleFormChange('pocketMoney', event.target.value)
          }
        />

        {childEditable ? (
          <SelectField
            placeholder='Select the payout schedule'
            label='Payout schedule'
            value={childForm.schedule}
            hasError={childForm.hasScheduleError}
            errorMessage='Schedule is required'
            onChange={(event) =>
              handleFormChange('schedule', event.target.value)
            }
          >
            {Object.keys(Frequency).map((key, index) => (
              <option
                key={index}
                value={Frequency[key]}
                label={Frequency[key]}
              />
            ))}
          </SelectField>
        ) : (
          <TextField
            placeholder='Pocket money payout schedule'
            label='Payout schedule'
            value={childForm.schedule}
            readOnly
          />
        )}

        {result.type && (
          <Alert
            variation={result.type}
            isDismissible={true}
            hasIcon={true}
            marginTop='0.5rem'
          >
            {result.description}
          </Alert>
        )}

        {childEditable && (
          <Flex marginTop='1rem'>
            <Button
              variation='primary'
              isFullWidth={true}
              onClick={saveChanges}
            >
              Confirm
            </Button>
            <Button isFullWidth={true} onClick={cancelChanges}>
              Cancel
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};

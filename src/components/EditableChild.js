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
import { Child, Frequency } from '../models';
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { calculateNextPayout } from '../utils';

export const EditableChild = ({ child, currency }) => {
  const [childEditable, setChildEditable] = useState(false);
  const [result, setResult] = useState({ type: '', description: '' });
  const [childForm, setChildForm] = useState({
    name: child.name,
    pocketMoney: child.pocketMoney,
    schedule: child.schedule,
    nextMoneyAt: child.nextMoneyAt,
  });

  useEffect(() => {
    if (result.type === 'success') {
      const timer = setTimeout(() => {
        setResult({ type: '', description: '' });
      }, 2500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [result]);

  const saveChanges = async () => {
    if (!childForm.name || (childForm.pocketMoney && !childForm.schedule)) {
      return;
    } else if (
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
    } else if (childForm.schedule !== child.schedule) {
      childForm.nextMoneyAt = calculateNextPayout(childForm.schedule);
      if (childForm.nextMoneyAt) {
        childForm.nextMoneyAt = parseInt(
          childForm.nextMoneyAt.getTime() / 1000
        );
      }
    }

    try {
      await DataStore.save(
        Child.copyOf(child, (item) => {
          item.name = childForm.name.trim();
          item.pocketMoney = childForm.pocketMoney
            ? parseFloat(childForm.pocketMoney)
            : 0;
          item.schedule = childForm.schedule;
          item.nextMoneyAt = childForm.nextMoneyAt;
        })
      );

      setResult({ type: 'success', description: 'Changes saved successfully' });
      setChildEditable(false);
    } catch (error) {
      console.log('failed to save child changes: ', error);
      setResult({ type: 'error', description: 'Failed to save the changes' });
    }
  };

  const cancelChanges = () => {
    setChildForm({
      name: child.name,
      pocketMoney: child.pocketMoney,
      schedule: child.schedule,
    });
    setChildEditable(false);
  };

  return (
    <Card
      borderRadius='medium'
      variation='elevated'
      padding={{ base: 'medium', large: 'xl' }}
    >
      <Flex direction='column'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading level={5}>{child.name}</Heading>
          <Button padding='0.5rem' onClick={() => setChildEditable(true)}>
            <Icon fontSize='1.25rem' ariaLabel='Edit child' as={MdEdit} />
          </Button>
        </Flex>

        <TextField
          label='Name'
          placeholder="Child's name"
          value={childForm.name}
          readOnly={!childEditable}
          hasError={!childForm.name.trim()}
          errorMessage='Name is required'
          onChange={(event) =>
            setChildForm({ ...childForm, name: event.target.value })
          }
        />

        <TextField
          label={`Pocket money (in ${currency})`}
          placeholder="Child's pocket money amount"
          value={childForm.pocketMoney}
          readOnly={!childEditable}
          type='number'
          onChange={(event) =>
            setChildForm({ ...childForm, pocketMoney: event.target.value })
          }
        />

        {childEditable ? (
          <SelectField
            placeholder='Select the payout schedule'
            label='Payout schedule'
            value={childForm.schedule}
            hasError={childForm.pocketMoney && !childForm.schedule}
            errorMessage='Schedule is required'
            onChange={(event) =>
              setChildForm({ ...childForm, schedule: event.target.value })
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

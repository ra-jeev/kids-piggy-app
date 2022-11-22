import { useEffect, useState } from 'react';

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
import { MdEdit } from 'react-icons/md';

import { User, Currency } from '../models';
import { ColorModeSelector } from './ColorModeSelector';

export const EditableUser = ({ user, mode, onModeChange }) => {
  const [userEditable, setUserEditable] = useState(false);
  const [result, setResult] = useState({ type: '', description: '' });
  const [userForm, setUserForm] = useState({
    name: user.name,
    currency: user.currency,
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
    if (!userForm.name || !userForm.currency) {
      return;
    } else if (
      userForm.name === user.name &&
      userForm.currency === user.currency
    ) {
      setResult({ type: 'info', description: 'No changes detected' });
      return;
    }

    try {
      await DataStore.save(
        User.copyOf(user, (item) => {
          item.name = userForm.name.trim();
          item.currency = userForm.currency;
        })
      );

      setResult({ type: 'success', description: 'Changes saved successfully' });
      setUserEditable(false);
    } catch (error) {
      console.log('failed to save user changes: ', error);
      setResult({ type: 'error', description: 'Failed to save your changes' });
    }
  };

  const cancelChanges = () => {
    setUserForm({ name: user.name, currency: user.currency });
    setUserEditable(false);
  };

  return (
    <Card
      borderRadius='medium'
      variation='elevated'
      padding={{ base: 'medium', large: 'xl' }}
    >
      <Flex direction='column'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading level={5}>You</Heading>
          <Flex>
            <ColorModeSelector mode={mode} onModeChange={onModeChange} />

            <Button padding='0.5rem' onClick={() => setUserEditable(true)}>
              <Icon fontSize='1.25rem' ariaLabel='Edit user' as={MdEdit} />
            </Button>
          </Flex>
        </Flex>
        <TextField
          label='Name'
          placeholder='Your name'
          value={userForm.name}
          readOnly={!userEditable}
          hasError={!userForm.name.trim()}
          errorMessage='Name is required'
          onChange={(event) =>
            setUserForm({ ...userForm, name: event.target.value })
          }
        />
        {userEditable ? (
          <SelectField
            placeholder='Your currency'
            label='Currency'
            value={userForm.currency}
            hasError={!userForm.currency}
            errorMessage='Currency is required'
            onChange={(event) =>
              setUserForm({ ...userForm, currency: event.target.value })
            }
          >
            {Object.keys(Currency).map((key, index) => (
              <option key={index} value={Currency[key]} label={Currency[key]} />
            ))}
          </SelectField>
        ) : (
          <TextField
            label='Currency'
            placeholder='Your currency'
            value={userForm.currency}
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

        {userEditable && (
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

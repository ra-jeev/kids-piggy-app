import {
  Flex,
  Heading,
  Card,
  Alert,
  Text,
  Button,
  TextField,
} from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Child, Transaction } from '../models';

export const TransactionForm = ({ value, onDismiss }) => {
  const { child, isAdd } = value;
  const initialState = { amount: '', comment: '' };
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState({ amount: false, comment: false });
  const [result, setResult] = useState('');

  const setInput = (key, value) => {
    setErrors({ ...errors, [key]: !value });
    setFormState({ ...formState, [key]: value });
  };

  useEffect(() => {
    if (result === 'success') {
      const timer = setTimeout(() => {
        onDismiss();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [result, onDismiss]);

  const saveTransaction = async () => {
    const comment = formState.comment.trim();
    const amount = parseFloat(formState.amount);
    if (!formState.amount || !comment) {
      setErrors({ amount: !formState.amount, comment: !comment });
      return;
    }

    try {
      let res = await DataStore.save(
        new Transaction({
          amount: isAdd ? amount : -amount,
          comment: `${isAdd ? '🤑' : '😥'} ${comment}`,
          userID: child.userID,
          childID: child.id,
        })
      );

      const latestChildData = await DataStore.query(Child, child.id);
      res = await DataStore.save(
        Child.copyOf(latestChildData, (item) => {
          item.balance = item.balance + res.amount;
        })
      );

      setResult('success');
      setFormState(initialState);
    } catch (error) {
      console.log('failed to fetch children: ', error);
      setResult('error');
    }
  };

  return (
    <Card
      width='32rem'
      maxWidth='100%'
      borderRadius='medium'
      padding={{ base: 'medium', large: 'xl' }}
    >
      <Flex direction='column'>
        <Heading level={3} fontSize={{ base: '1.5rem', large: '2rem' }}>
          Transaction details
        </Heading>
        <Text fontSize={{ base: 'medium', large: 'large' }}>
          You're {isAdd ? 'adding money to' : 'deducting money from'}{' '}
          {child.name}'s balance.
        </Text>
        <TextField
          label={`Amount to ${isAdd ? 'add' : 'deduct'}`}
          placeholder='Enter the amount'
          hasError={errors.amount}
          errorMessage='Amount is required'
          type='number'
          value={formState.amount}
          onChange={(event) => setInput('amount', event.target.value)}
        />
        <TextField
          label='Comment for this transaction'
          placeholder='Transaction comment'
          hasError={errors.comment}
          errorMessage='Comment is required'
          value={formState.comment}
          onChange={(event) => setInput('comment', event.target.value)}
        />
        {result && (
          <Alert
            variation={result}
            isDismissible={true}
            hasIcon={true}
            marginTop='1rem'
          >
            {result === 'success'
              ? 'Transaction successful'
              : 'Transaction failed'}
          </Alert>
        )}
        <Flex marginTop='1rem'>
          <Button
            variation='primary'
            isFullWidth={true}
            onClick={saveTransaction}
          >
            Confirm
          </Button>
          <Button isFullWidth={true} onClick={onDismiss}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Card>
    // </Flex >
  );
};

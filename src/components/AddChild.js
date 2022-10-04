// import { useState } from 'react';
import {
  Flex,
  TextField,
  Card,
  Alert,
  Button,
  Icon,
  Heading,
  SelectField,
  Text,
} from '@aws-amplify/ui-react';
import { MdDeleteOutline } from 'react-icons/md';
import { Frequency } from '../models';
import { formatDate } from '../utils';

export function AddChild({ data, index, onDataChange, onDelete }) {
  const {
    name,
    balance,
    hasNameError,
    pocketMoney,
    schedule,
    hasScheduleError,
    nextMoneyAt,
  } = data;

  return (
    <Card variation='outlined'>
      <Flex direction='column'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading level={5}>{`Kid ${index + 1} details`}</Heading>
          <Button
            variation='link'
            padding='0.25rem'
            onClick={() => onDelete(index)}
          >
            <Icon
              color='red.60'
              fontSize='1.75rem'
              ariaLabel='Delete entry'
              as={MdDeleteOutline}
            />
          </Button>
        </Flex>
        <TextField
          label='Name'
          placeholder='Enter kids name'
          hasError={hasNameError}
          errorMessage='Kids name is required'
          value={name}
          onChange={(event) => {
            onDataChange(index, 'name', event.target.value);
          }}
        />
        <TextField
          label='Any starting balance?'
          placeholder='Piggy bank balance'
          type='number'
          value={balance}
          onChange={(event) =>
            onDataChange(index, 'balance', event.target.value)
          }
        />
        <TextField
          label='Any regular pocket money?'
          placeholder='Pocket money amount'
          type='number'
          value={pocketMoney}
          onChange={(event) =>
            onDataChange(index, 'pocketMoney', event.target.value)
          }
        />

        {pocketMoney && pocketMoney !== '0' && (
          <SelectField
            label='What is the payout schedule?'
            placeholder='Please select the schedule'
            value={schedule}
            hasError={hasScheduleError}
            errorMessage='Schedule is required'
            onChange={(event) =>
              onDataChange(index, 'schedule', event.target.value)
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
        )}

        {nextMoneyAt && (
          <Alert variation='info' hasIcon={true}>
            Next payout will be on{' '}
            <span style={{ fontWeight: 'bold' }}>
              {formatDate(nextMoneyAt)}
            </span>
            {'. '}
            <Text fontSize='xs' color='font.info'>
              *Payouts are processed @ GMT 12:00 AM
            </Text>
          </Alert>
        )}
      </Flex>
    </Card>
  );
}

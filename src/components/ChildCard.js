import {
  Flex,
  Heading,
  Card,
  View,
  Text,
  Icon,
  Button,
} from '@aws-amplify/ui-react';
import { MdAccountCircle, MdAddCircle, MdRemoveCircle } from 'react-icons/md';

import { formatCurrency, formatDate } from '../utils';

export const ChildCard = ({ child, currency, onTransact }) => {
  return (
    <Card borderRadius='medium' variation='elevated'>
      <Flex direction='column'>
        <Flex alignItems='center'>
          <Icon
            ariaLabel='person icon'
            as={MdAccountCircle}
            fontSize={{ base: '4rem', large: '5rem' }}
          />
          <Flex direction='column' gap='0.25rem'>
            <Heading level={4} fontSize={{ base: 'large', large: 'xl' }}>
              {child.name}
            </Heading>
            <Text variation='info' fontSize='small'>
              Pocket money: {formatCurrency(child.pocketMoney || 0, currency)}
              {child.schedule
                ? `, ${
                    child.schedule[0] + child.schedule.slice(1).toLowerCase()
                  }`
                : ''}
            </Text>
          </Flex>
        </Flex>
        <View marginBlock='1rem'>
          <Flex alignItems='center'>
            <Heading fontSize={{ base: '3rem', large: '4rem' }} lineHeight='1'>
              💰
            </Heading>
            <View>
              <Text variation='info' fontSize='small'>
                Current balance
              </Text>
              <Heading
                level={2}
                color='brand.primary.80'
                fontSize={{ base: 'xxl', large: 'xxxl' }}
              >
                {formatCurrency(child.balance, currency)}
              </Heading>
            </View>
          </Flex>
          {child.nextMoneyAt && (
            <Text variation='info' fontSize='small'>
              Next credit:{' '}
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {formatCurrency(child.pocketMoney, currency)}{' '}
              </span>{' '}
              on {formatDate(child.nextMoneyAt * 1000)}
            </Text>
          )}
        </View>

        <Flex>
          <Button
            gap={{ base: '0.25rem', medium: '0.5rem' }}
            variation='primary'
            size='small'
            isFullWidth={true}
            onClick={() => onTransact(child)}
          >
            <Icon ariaLabel='add icon' as={MdAddCircle} />
            Add money
          </Button>
          <Button
            gap={{ base: '0.25rem', medium: '0.5rem' }}
            size='small'
            isFullWidth={true}
            onClick={() => onTransact(child, false)}
          >
            <Icon
              ariaLabel='remove icon'
              as={MdRemoveCircle}
              fontWeight='black'
            />
            Deduct money
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

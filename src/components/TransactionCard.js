import { Flex, Heading, Card, Text } from '@aws-amplify/ui-react';
import { formatDate, formatCurrency } from '../utils';

export const TransactionCard = ({ transaction, childName, currency }) => {
  return (
    <Card borderRadius='medium' variation='elevated'>
      <Flex justifyContent='space-between'>
        <Flex direction='column' grow={1} gap='0.5rem'>
          <Heading level={6} color='font.tertiary'>
            {transaction.comment}
          </Heading>
          <Text color='neutral.80' fontSize='small'>
            For {childName} &bull; {formatDate(transaction.createdAt)}
          </Text>
        </Flex>
        <Heading
          level={4}
          fontSize={{ base: 'large', large: 'xl' }}
          color={transaction.amount > 0 ? 'green.80' : 'red.80'}
          style={{ whiteSpace: 'nowrap' }}
        >
          {formatCurrency(transaction.amount, currency)}
        </Heading>
      </Flex>
    </Card>
  );
};

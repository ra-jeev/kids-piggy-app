import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Heading, Collection } from '@aws-amplify/ui-react';
import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore';

import { Transaction } from '../models';
import { TransactionForm } from '../components/TransactionForm';
import { ChildCard } from '../components/ChildCard';
import { TransactionCard } from '../components/TransactionCard';
import { useUserObserver } from '../hooks/useUserObserver';
import { useChildrenObserver } from '../hooks/useChildrenObserver';

export function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const transactionsSubscription = useRef(null);

  const navigate = useNavigate();

  const { user } = useUserObserver();
  const { children } = useChildrenObserver();

  useEffect(() => {
    if (user && !user.onBoarded) {
      navigate('/onboarding');
    }
  }, [navigate, user]);

  useEffect(() => {
    const observeTransactions = () => {
      return DataStore.observeQuery(Transaction, Predicates.ALL, {
        sort: (s) => s.createdAt(SortDirection.DESCENDING),
      }).subscribe((snapshot) => {
        setTransactions([...snapshot.items]);
      });
    };

    if (!transactionsSubscription.current) {
      transactionsSubscription.current = observeTransactions();
    }

    return () => {
      transactionsSubscription.current.unsubscribe();
      transactionsSubscription.current = null;
    };
  }, []);

  const transact = (child, isAdd = true) => {
    setCurrentTransaction({
      child: { ...child },
      isAdd,
    });
  };

  return (
    <Flex justifyContent='center' alignItems='center' padding='1rem'>
      {currentTransaction ? (
        <TransactionForm
          value={currentTransaction}
          onDismiss={() => setCurrentTransaction(null)}
        />
      ) : (
        user && (
          <Flex direction='column' width='32rem' maxWidth='100%'>
            <Heading level={3} textAlign='start'>
              Piggy bank accounts
            </Heading>
            <Collection items={children}>
              {(item, index) => (
                <ChildCard
                  key={index}
                  child={item}
                  currency={user.currency}
                  onTransact={transact}
                />
              )}
            </Collection>
            <Heading level={4} marginTop='2rem'>
              Recent Transactions
            </Heading>
            <Collection items={transactions} width='32rem' maxWidth='100%'>
              {(item, index) => (
                <TransactionCard
                  key={index}
                  transaction={item}
                  childName={
                    children.find((child) => child.id === item.childID)?.name
                  }
                  currency={user.currency}
                />
              )}
            </Collection>
          </Flex>
        )
      )}
    </Flex>
  );
}

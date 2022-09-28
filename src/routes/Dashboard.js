import { Flex, Heading, Collection } from '@aws-amplify/ui-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore';
import { Child, Transaction, User } from '../models';
import { TransactionForm } from '../components/TransactionForm';
import { ChildCard } from '../components/ChildCard';
import { TransactionCard } from '../components/TransactionCard';

export function Dashboard() {
  const [children, setChildren] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(null);

  const [currentTransaction, setCurrentTransaction] = useState(null);
  const userSubscription = useRef(null);
  const childrenSubscription = useRef(null);
  const transactionsSubscription = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const observeUser = () => {
      return DataStore.observeQuery(User, Predicates.ALL).subscribe(
        (snapshot) => {
          if (snapshot.items && snapshot.items.length) {
            if (!snapshot.items[0].onBoarded) {
              navigate('/onboarding');
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

  useEffect(() => {
    const observeChildren = () => {
      return DataStore.observeQuery(Child, Predicates.ALL).subscribe(
        (snapshot) => {
          setChildren([...snapshot.items]);
        }
      );
    };

    if (!childrenSubscription.current) {
      childrenSubscription.current = observeChildren();
    }

    return () => {
      childrenSubscription.current.unsubscribe();
      childrenSubscription.current = null;
    };
  }, []);

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
        userData && (
          <Flex direction='column' width='32rem' maxWidth='100%'>
            <Heading level={3} textAlign='start'>
              Piggy bank accounts
            </Heading>
            <Collection items={children}>
              {(item, index) => (
                <ChildCard
                  key={index}
                  child={item}
                  currency={userData.currency}
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
                  currency={userData.currency}
                />
              )}
            </Collection>
          </Flex>
        )
      )}
    </Flex>
  );
}

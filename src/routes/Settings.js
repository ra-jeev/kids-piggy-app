import { Heading, Flex, Collection } from '@aws-amplify/ui-react';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Child, User } from '../models';
import { useEffect, useState, useRef } from 'react';

import { EditableUser } from '../components/EditableUser';
import { EditableChild } from '../components/EditableChild';

export const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [children, setChildren] = useState([]);
  const childrenSubscription = useRef(null);
  const userSubscription = useRef(null);

  useEffect(() => {
    const observeUser = () => {
      return DataStore.observeQuery(User, Predicates.ALL).subscribe(
        (snapshot) => {
          setUserData(snapshot.items[0]);
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
  }, []);

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

  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      padding='1rem'
    >
      {userData && (
        <Flex direction='column' width='32rem' maxWidth='100%'>
          <Heading level={4}>Your Settings</Heading>
          <EditableUser user={userData} />
        </Flex>
      )}

      {userData && children.length && (
        <Flex direction='column' width='32rem' maxWidth='100%' marginTop='2rem'>
          <Heading level={4}>Kids' Settings</Heading>
          <Collection items={children}>
            {(item, index) => (
              <EditableChild
                key={index}
                child={item}
                currency={userData.currency}
              />
            )}
          </Collection>
        </Flex>
      )}
    </Flex>
  );
};

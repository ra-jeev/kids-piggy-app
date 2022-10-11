import { useEffect, useState } from 'react';

import { DataStore, Predicates } from '@aws-amplify/datastore';

import { User } from '../models';

export const useUserObserver = () => {
  const [user, setUser] = useState(null);

  const observeUser = () => {
    return DataStore.observeQuery(User, Predicates.ALL).subscribe(
      (snapshot) => {
        if (snapshot.items && snapshot.items.length) {
          setUser(snapshot.items[0]);
        }
      }
    );
  };

  useEffect(() => {
    const userSubscription = observeUser();

    return () => {
      userSubscription.unsubscribe();
    };
  }, []);

  return { user };
};

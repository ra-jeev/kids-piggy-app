import { useEffect, useState } from 'react';

import { DataStore, Predicates } from '@aws-amplify/datastore';

import { Child } from '../models';

export const useChildrenObserver = () => {
  const [children, setChildren] = useState([]);

  const observeChildren = () => {
    return DataStore.observeQuery(Child, Predicates.ALL).subscribe(
      (snapshot) => {
        setChildren([...snapshot.items]);
      }
    );
  };

  useEffect(() => {
    const childrenSubscription = observeChildren();

    return () => {
      childrenSubscription.unsubscribe();
    };
  }, []);

  return { children };
};

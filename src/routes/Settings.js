import { useState } from 'react';

import { Heading, Flex, Collection, Button, Icon } from '@aws-amplify/ui-react';
import { MdPersonAddAlt } from 'react-icons/md';

import { EditableUser } from '../components/EditableUser';
import { EditableChild } from '../components/EditableChild';
import { useUserObserver } from '../hooks/useUserObserver';
import { useChildrenObserver } from '../hooks/useChildrenObserver';

export const Settings = () => {
  const { user } = useUserObserver();
  const { children } = useChildrenObserver();

  const [addNew, setAddNew] = useState(false);
  const defaultChildProps = {
    name: '',
    balance: '',
    pocketMoney: '',
    schedule: '',
    nextMoneyAt: '',
  };

  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      padding='1rem'
    >
      {user && (
        <Flex direction='column' width='32rem' maxWidth='100%'>
          <Heading level={4}>Your Settings</Heading>
          <EditableUser user={user} />
        </Flex>
      )}

      {user && children.length && (
        <Flex direction='column' width='32rem' maxWidth='100%' marginTop='2rem'>
          <Flex justifyContent='space-between'>
            <Heading level={4}>Kids' Settings</Heading>
            <Button gap='0.5rem' size='small' onClick={() => setAddNew(true)}>
              <Icon
                ariaLabel='Add kid'
                as={MdPersonAddAlt}
                fontSize='1.25rem'
              />
              Add Kid
            </Button>
          </Flex>
          {addNew && (
            <EditableChild
              isNew
              child={defaultChildProps}
              currency={user.currency}
              userId={user.id}
              cancelAdd={() => setAddNew(false)}
            />
          )}
          <Collection items={children}>
            {(item, index) => (
              <EditableChild
                key={index}
                child={item}
                currency={user.currency}
              />
            )}
          </Collection>
        </Flex>
      )}
    </Flex>
  );
};

import { Flex, Card } from '@aws-amplify/ui-react';

const containerStyles = {
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.48)',
  position: 'fixed',
  zIndex: '999',
  left: 0,
  top: 0,
};

export const Dialog = ({ isOpen, children }) => {
  return (
    <>
      {isOpen ? (
        <Flex
          style={containerStyles}
          justifyContent='center'
          alignItems='center'
        >
          <Card
            backgroundColor='background.secondary'
            width='32rem'
            maxWidth='100%'
            borderRadius='medium'
          >
            {children}
          </Card>
        </Flex>
      ) : null}
    </>
  );
};

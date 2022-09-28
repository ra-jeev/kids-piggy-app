import { Flex, Heading, Text } from '@aws-amplify/ui-react';
export function Home() {
  return (
    <Flex direction='column' padding='1rem' textAlign='center'>
      <Heading level={3}>Welcome to Kids Piggy App.</Heading>

      <Text>
        This app is meant to keep track of your kids' piggy money. It also
        handles the auto credit of their pocket money (if any...) , as per the
        schedule set by you.
      </Text>
    </Flex>
  );
}

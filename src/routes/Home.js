import {
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Card,
  Icon,
} from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/images/hero-image.png';
import {
  MdSupervisorAccount,
  MdSettingsInputAntenna,
  MdMoney,
} from 'react-icons/md';
import { FaPercent, FaTasks } from 'react-icons/fa';

export function Home() {
  const navigate = useNavigate();

  return (
    <Flex direction='column'>
      <Flex
        backgroundImage='linear-gradient(to right, hsl(243, 100%, 69%), hsl(244, 51%, 37%))'
        padding='5rem 3rem'
        direction={{ base: 'column', medium: 'row' }}
        alignItems='center'
        justifyContent='center'
      >
        <Flex
          direction='column'
          alignItems='center'
          maxWidth={{ base: '100%', medium: '45%' }}
        >
          <Heading
            level={1}
            fontWeight='extrabold'
            fontSize={{ base: '2.5rem', large: '3.5rem' }}
          >
            Manage your kids{' '}
            <span style={{ color: 'orange' }}>"Piggy Bank"</span>{' '}
            <span style={{ fontStyle: 'italic' }}>digitally</span>
          </Heading>
          <Heading
            level={3}
            marginTop='1rem'
            fontSize={{ base: '1.25rem', large: '1.75rem' }}
          >
            Track their spends. Configure their pocket money auto credit. Make
            them financially aware.
          </Heading>
          <Button
            marginTop='2rem'
            minWidth='20rem'
            size='large'
            variation='primary'
            onClick={() => navigate('/login')}
            alignSelf='start'
          >
            Get started now
          </Button>
        </Flex>
        <Flex maxWidth={{ base: '100%', medium: '50%' }}>
          <Image
            alt='piggy bank image'
            src={heroImage}
            maxHeight='25rem'
            maxWidth='100%'
          />
        </Flex>
      </Flex>
      <Flex
        direction='column'
        alignItems='center'
        padding='3rem 1rem'
        justifyContent='center'
      >
        <Heading
          level={2}
          fontSize={{ base: 'xxl', large: 'xxxl' }}
          fontWeight='bold'
        >
          App Features
        </Heading>
        <Flex
          width={{ base: '100%', large: '80%' }}
          marginTop='2rem'
          justifyContent='center'
        >
          <Card padding='1.5rem' width={{ base: '100%', medium: '40%' }}>
            <Icon
              as={MdSupervisorAccount}
              color='brand.primary.80'
              fontSize='3rem'
            />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Multiple kids accounts</Heading>
              <Text>
                You can configure and track multiple piggy bank accounts through
                the app
              </Text>
            </Flex>
          </Card>
          <Card padding='1.5rem' width={{ base: '100%', medium: '40%' }}>
            <Icon
              as={MdSettingsInputAntenna}
              color='brand.primary.80'
              fontSize='3rem'
            />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Set pocket money schedule</Heading>
              <Text>
                Set your kids pocket money and its schedule for auto credit to
                the account
              </Text>
            </Flex>
          </Card>

          <Card padding='1.5rem' width={{ base: '100%', medium: '40%' }}>
            <Icon as={MdMoney} color='brand.primary.80' fontSize='3rem' />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Ad-hoc add / deduct money</Heading>
              <Text>
                Award them on ad-hoc basis. Track their expenses with comments
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
      <Flex
        direction='column'
        alignItems='center'
        padding='3rem 1rem'
        justifyContent='center'
      >
        <Heading
          level={2}
          fontSize={{ base: 'xxl', large: 'xxxl' }}
          fontWeight='bold'
        >
          Coming Soon
        </Heading>
        <Flex
          width={{ base: '100%', large: '80%' }}
          marginTop='2rem'
          justifyContent='center'
        >
          <Card padding='1.5rem' width={{ base: '100%', medium: '40%' }}>
            <FaPercent color='brand.primary.80' fontSize='3rem' />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Give interest on savings</Heading>
              <Text>
                Become a banker to your kid, and encourage them to save by
                giving interest on their savings
              </Text>
            </Flex>
          </Card>
          <Card padding='1.5rem' width={{ base: '100%', medium: '40%' }}>
            <FaTasks color='brand.primary.80' fontSize='3rem' />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Link payout to tasks</Heading>
              <Text>
                Set up tasks for your kids and link their earnings to completion
                of these tasks
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
}

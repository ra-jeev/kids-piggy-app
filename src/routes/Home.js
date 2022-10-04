import {
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Card,
  Icon,
  Link,
} from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/images/hero-image.png';
import {
  MdSupervisorAccount,
  MdSettingsInputAntenna,
  MdMoney,
} from 'react-icons/md';
import { FaPercent, FaTasks, FaHeart } from 'react-icons/fa';

export function Home() {
  const navigate = useNavigate();

  return (
    <Flex direction='column'>
      <Flex
        backgroundImage='linear-gradient(to right, hsl(243, 100%, 69%), hsl(244, 51%, 37%))'
        padding={{ base: '3.5rem 1.5rem', large: '5rem 3rem' }}
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
            color='white'
          >
            Manage your kids{' '}
            <span style={{ color: 'orange' }}>"Piggy Bank"</span>{' '}
            <span style={{ fontStyle: 'italic' }}>digitally</span>
          </Heading>
          <Heading
            level={3}
            marginTop='1rem'
            fontSize={{ base: '1.25rem', large: '1.75rem' }}
            color='white'
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
        padding='1rem'
        justifyContent='center'
      >
        <Heading
          level={2}
          fontSize={{ base: 'xxl', large: 'xxxl' }}
          fontWeight='bold'
          marginTop='2rem'
        >
          Key Features
        </Heading>
        <Flex
          width={{ base: '100%', large: '80%' }}
          marginTop='2rem'
          justifyContent='center'
          wrap={{ base: 'wrap', medium: 'nowrap' }}
        >
          <Card
            variation='elevated'
            borderRadius='medium'
            padding='1.5rem'
            width={{ base: '100%', medium: '33%' }}
          >
            <Icon
              as={MdSupervisorAccount}
              color='brand.primary.80'
              fontSize='3rem'
            />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Multiple kids accounts</Heading>
              <Text>
                Configure and track multiple piggy bank accounts for your kids
                through the app
              </Text>
            </Flex>
          </Card>
          <Card
            variation='elevated'
            borderRadius='medium'
            padding='1.5rem'
            width={{ base: '100%', medium: '33%' }}
          >
            <Icon
              as={MdSettingsInputAntenna}
              color='brand.primary.80'
              fontSize='3rem'
            />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Set pocket money schedule</Heading>
              <Text>
                Set your kids pocket money schedule for auto credit to their
                piggy bank account
              </Text>
            </Flex>
          </Card>

          <Card
            variation='elevated'
            borderRadius='medium'
            padding='1.5rem'
            width={{ base: '100%', medium: '33%' }}
          >
            <Icon as={MdMoney} color='brand.primary.80' fontSize='3rem' />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Ad-hoc add / deduct money</Heading>
              <Text>
                You can award money on ad-hoc basis, and also track their
                expenses with comments
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
      <Flex
        direction='column'
        alignItems='center'
        padding='1rem'
        justifyContent='center'
      >
        <Heading
          level={2}
          fontSize={{ base: 'xxl', large: 'xxxl' }}
          fontWeight='bold'
          marginTop='2rem'
        >
          Coming Soon
        </Heading>
        <Flex
          width={{ base: '100%', large: '80%' }}
          marginTop='2rem'
          justifyContent='center'
          wrap='wrap'
        >
          <Card
            variation='elevated'
            borderRadius='medium'
            padding='1.5rem'
            width={{ base: '100%', medium: '40%' }}
          >
            <FaPercent color='#ffc600' fontSize='3rem' />

            <Flex direction='column' marginTop='2rem'>
              <Heading level={4}>Give interest on savings</Heading>
              <Text>
                Become a banker to your kid. Give interest on their deposit
                &amp; incentivize them to save
              </Text>
            </Flex>
          </Card>
          <Card
            variation='elevated'
            borderRadius='medium'
            padding='1.5rem'
            width={{ base: '100%', medium: '40%' }}
          >
            <FaTasks color='#ffc600' fontSize='3rem' />

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
      <Flex justifyContent='center' padding='1rem'>
        <Text fontSize='1.125rem' alignItems='center' lineHeight='1.125rem'>
          Made with <FaHeart color='red' /> &bull; by{' '}
          <Link href='https://twitter.com/ra_jeeves' target='_blank'>
            @ra_jeeves
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}

import {
  Flex,
  Icon,
  Text,
  Button,
  Card,
  Menu,
  MenuItem,
} from '@aws-amplify/ui-react';
import { MdAccountCircle } from 'react-icons/md';
import { FaPiggyBank } from 'react-icons/fa';

export function Toolbar({ loggedIn, onClick }) {
  return (
    <Flex height='4rem' alignItems='center'>
      <Card width='100%'>
        <Flex
          alignItems='center'
          position='relative'
          justifyContent='space-between'
          height='2.5rem'
        >
          <Flex
            gap='0.5rem'
            width='fit-content'
            justifyContent='center'
            alignItems='center'
            style={{ cursor: 'pointer' }}
            onClick={() => onClick('logo')}
          >
            <FaPiggyBank fontSize='1.75rem' />
            <Text fontWeight='extrabold' fontSize='large'>
              KidsPiggy
            </Text>
          </Flex>

          <Flex>
            {!loggedIn ? (
              <Button
                variation='primary'
                onClick={() => onClick('login')}
                size='small'
              >
                Login
              </Button>
            ) : (
              <Flex gap={0}>
                <Menu
                  menuAlign='end'
                  trigger={
                    <Button
                      variation='menu'
                      size='small'
                      padding='0'
                      borderRadius='xl'
                    >
                      <Icon
                        fontSize='2.5rem'
                        ariaLabel='Account menu'
                        as={MdAccountCircle}
                      />
                    </Button>
                  }
                >
                  <MenuItem onClick={() => onClick('dashboard')}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => onClick('settings')}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={() => onClick('logout')}>Logout</MenuItem>
                </Menu>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}

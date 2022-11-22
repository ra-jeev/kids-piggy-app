import {
  Flex,
  Image,
  Button,
  Card,
  Menu,
  MenuItem,
} from '@aws-amplify/ui-react';

import { FaUserCircle } from 'react-icons/fa';

import { ColorModeSelector } from './ColorModeSelector';
import logo from '../assets/images/logo.png';

export function Toolbar({ loggedIn, mode, onClick }) {
  return (
    <Card variation='elevated' width='100%' padding='0.75rem 1rem'>
      <Flex
        alignItems='center'
        position='relative'
        justifyContent='space-between'
      >
        <Flex
          gap='0.5rem'
          width='fit-content'
          justifyContent='center'
          alignItems='center'
          style={{ cursor: 'pointer' }}
          onClick={() => onClick('logo')}
        >
          <Image alt='piggy bank logo' src={logo} maxHeight='40px' />
        </Flex>

        <Flex alignItems='center'>
          {!loggedIn ? (
            <>
              <ColorModeSelector
                mode={mode}
                onModeChange={(value) => onClick('mode', value)}
              />
              <Button
                variation='primary'
                onClick={() => onClick('login')}
                size='small'
              >
                Login
              </Button>
            </>
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
                    <FaUserCircle fontSize='2.5rem' />
                  </Button>
                }
              >
                <MenuItem onClick={() => onClick('dashboard')}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => onClick('settings')}>
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    window.open(
                      'mailto:hello@mypiggyjar.com?subject=[MyPiggyJar]'
                    )
                  }
                >
                  Contact
                </MenuItem>
                <MenuItem onClick={() => onClick('logout')}>Logout</MenuItem>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

import {
  Flex,
  Icon,
  Text,
  Image,
  Button,
  Card,
  Menu,
  MenuItem,
} from '@aws-amplify/ui-react';
import {
  MdDarkMode,
  MdLightMode,
  MdBrightnessAuto,
  MdColorLens,
} from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

import logo from '../assets/images/logo.png';

export function Toolbar({ loggedIn, mode, onClick }) {
  return (
    <Flex height='4rem' alignItems='center'>
      <Card variation='elevated' width='100%'>
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
            <Image alt='piggy bank logo' src={logo} maxHeight='40px' />
          </Flex>

          <Flex alignItems='center'>
            <Flex gap={0}>
              <Menu
                menuAlign='end'
                trigger={
                  <Button size='small'>
                    <Icon
                      fontSize='1.25rem'
                      ariaLabel='Color mode selection'
                      as={MdColorLens}
                    />
                  </Button>
                }
              >
                <MenuItem onClick={() => onClick('mode', 'light')}>
                  <MdLightMode style={{ marginRight: '0.5rem' }} /> Light
                </MenuItem>
                <MenuItem onClick={() => onClick('mode', 'dark')}>
                  <MdDarkMode style={{ marginRight: '0.5rem' }} /> Dark
                </MenuItem>
                <MenuItem onClick={() => onClick('mode', 'system')}>
                  <MdBrightnessAuto style={{ marginRight: '0.5rem' }} /> System
                </MenuItem>
              </Menu>
            </Flex>

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

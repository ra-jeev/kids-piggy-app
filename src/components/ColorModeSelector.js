import { Flex, Icon, Button, Menu, MenuItem } from '@aws-amplify/ui-react';
import {
  MdDarkMode,
  MdLightMode,
  MdHdrAuto,
  MdColorLens,
} from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';

export const ColorModeSelector = ({ mode, onModeChange }) => {
  return (
    <Flex gap={0}>
      <Menu
        menuAlign='end'
        trigger={
          <Button size='small' padding='0.5rem'>
            <Icon
              fontSize='1.25rem'
              ariaLabel='Color mode selection'
              as={MdColorLens}
            />
          </Button>
        }
      >
        <MenuItem
          justifyContent='space-between'
          onClick={() => onModeChange('light')}
        >
          <Flex alignItems='center' gap='0.5rem'>
            <MdLightMode /> Light
          </Flex>
          {mode === 'light' && <FaCheck color='green' />}
        </MenuItem>
        <MenuItem
          justifyContent='space-between'
          onClick={() => onModeChange('dark')}
        >
          <Flex alignItems='center' gap='0.5rem'>
            <MdDarkMode /> Dark
          </Flex>
          {mode === 'dark' && <FaCheck color='green' />}
        </MenuItem>
        <MenuItem
          justifyContent='space-between'
          onClick={() => onModeChange('system')}
        >
          <Flex alignItems='center' gap='0.5rem'>
            <MdHdrAuto /> System
          </Flex>
          {mode === 'system' && <FaCheck color='green' />}
        </MenuItem>
      </Menu>
    </Flex>
  );
};

import { useNavigate, Outlet } from 'react-router-dom';

import { useAuthenticator, Flex, Alert, Link } from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';

import { Toolbar } from './Toolbar';

export function Layout({ mode, onModeChange }) {
  const { route, signOut } = useAuthenticator((context) => [
    context.route,
    context.signOut,
  ]);

  const navigate = useNavigate();

  function logOut() {
    signOut();
    DataStore.clear();
    navigate('/');
  }

  function handleClick(action, value) {
    switch (action) {
      case 'logo':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'login':
        if (route !== 'authenticated') {
          navigate('/login');
        }
        break;
      case 'mode':
        onModeChange(value);
        break;
      case 'logout':
        logOut();
      default: //Inetentional fallthrough on logout
        navigate('/');
    }
  }

  return (
    <Flex direction='column' minHeight='100vh' gap='0'>
      <Toolbar
        mode={mode}
        loggedIn={route === 'authenticated'}
        onClick={handleClick}
      />
      {window && !window.location.hostname.includes('mypiggyjar.com') && (
        <Alert isDismissible={true} variation='info'>
          <span style={{ fontSize: '1.25rem' }}>Hi 👋,</span> KidsPiggy has a
          proper home now. Please use{' '}
          <Link href='https://www.mypiggyjar.com'>MyPiggyJar.com</Link> from now
          on.
        </Alert>
      )}
      <Outlet />
    </Flex>
  );
}

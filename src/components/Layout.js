import { useAuthenticator, Flex } from '@aws-amplify/ui-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Toolbar } from './Toolbar';
import { DataStore } from '@aws-amplify/datastore';

export function Layout() {
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

  function handleClick(action) {
    switch (action) {
      case 'logo':
        navigate(route !== 'authenticated' ? '/' : '/dashboard');
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
      case 'logout':
        logOut();
      default: //Inetentional fallthrough on logout
        navigate('/');
    }
  }

  return (
    <Flex direction='column' minHeight='100vh'>
      <Toolbar loggedIn={route === 'authenticated'} onClick={handleClick} />
      <Outlet />
    </Flex>
  );
}

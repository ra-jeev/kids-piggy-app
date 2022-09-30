import { useAuthenticator, Flex, Text, Link } from '@aws-amplify/ui-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Toolbar } from './Toolbar';
import { DataStore } from '@aws-amplify/datastore';
import { FaHeart } from 'react-icons/fa';

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
      case 'logout':
        logOut();
      default: //Inetentional fallthrough on logout
        navigate('/');
    }
  }

  return (
    <Flex direction='column' minHeight='100vh' gap='0'>
      <Toolbar loggedIn={route === 'authenticated'} onClick={handleClick} />
      <Outlet />
      <Flex justifyContent='center' padding='1rem'>
        <Text fontSize='1.125rem'>
          Made with <FaHeart color='red' />, by{' '}
          <Link href='https://twitter.com/ra_jeeves' target='_blank'>
            @ra_jeeves
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}

import { useEffect, useRef } from 'react';
import { Auth } from 'aws-amplify';
import { Authenticator, useAuthenticator, Flex } from '@aws-amplify/ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

export function Login() {
  const { route } = useAuthenticator((context) => [context.route]);

  const location = useLocation();
  const navigate = useNavigate();

  const initialFrom = location.state?.from?.pathname || '/dashboard';
  const from = useRef(initialFrom);

  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from.current, { replace: true });
    }
  }, [route, navigate, from]);

  const services = {
    async handleConfirmSignUp({ username, code }) {
      await Auth.confirmSignUp(username, code);
      from.current = '/onboarding';
    },
  };

  return (
    <Flex justifyContent='center' grow={1}>
      <Authenticator services={services} />
    </Flex>
  );
}

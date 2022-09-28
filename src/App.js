import { useState } from 'react';
import { AuthGuard } from './AuthGuard';
import { Login } from './routes/Login';
import { Home } from './routes/Home';
import { Layout } from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Authenticator,
  defaultDarkModeOverride,
  ThemeProvider,
} from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { OnBoarding } from './routes/OnBoarding';
import { Dashboard } from './routes/Dashboard';
import { Settings } from './routes/Settings';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path='/onboarding'
            element={
              <AuthGuard>
                <OnBoarding />
              </AuthGuard>
            }
          />
          <Route
            path='/dashboard'
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path='/settings'
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const [colorMode, setColorMode] = useState('system');
  const theme = {
    name: 'app-theme',
    overrides: [defaultDarkModeOverride],
  };

  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <Authenticator.Provider>
        <MyRoutes />
      </Authenticator.Provider>
    </ThemeProvider>
  );
}

export default App;

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

function MyRoutes({ mode, onModeChange }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Layout mode={mode} onModeChange={onModeChange} />}
        >
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
                <Settings mode={mode} onModeChange={onModeChange} />
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
  const getSavedColorMode = () => {
    return localStorage.getItem('color-mode') || 'system';
  };

  const saveColorMode = (value) => {
    localStorage.setItem('color-mode', value);
  };

  const [colorMode, setColorMode] = useState(getSavedColorMode());
  const theme = {
    name: 'app-theme',
    overrides: [defaultDarkModeOverride],
  };

  const onColorModeChange = (value) => {
    saveColorMode(value);
    setColorMode(value);
  };

  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <Authenticator.Provider>
        <MyRoutes mode={colorMode} onModeChange={onColorModeChange} />
      </Authenticator.Provider>
    </ThemeProvider>
  );
}

export default App;

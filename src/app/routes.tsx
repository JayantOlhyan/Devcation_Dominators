import { createBrowserRouter } from 'react-router';
import Landing from './pages/Landing';
import CitizenPortal from './pages/CitizenPortal';
import AuthorityPortal from './pages/AuthorityPortal';
import ContractorPortal from './pages/ContractorPortal';
import NGOPortal from './pages/NGOPortal';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Outlet } from 'react-router';

// Root layout component that provides context to all routes
function RootLayout() {
  return (
    <LanguageProvider>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </LanguageProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', Component: Landing },
      { path: '/citizen', Component: CitizenPortal },
      { path: '/authority', Component: AuthorityPortal },
      { path: '/contractor', Component: ContractorPortal },
      { path: '/ngo', Component: NGOPortal },
    ],
  },
]);

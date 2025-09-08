// src/App.tsx
import Auth from '@/components/auth/Auth';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Home from '@/pages/home/Home';
import Profile from '@/pages/profile/Profile';
import UIRoutes from '@/routes/uiRoutes';
import AuthRoute from '@/utils/AuthRoutes';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppContent() {
  const { theme } = useTheme();

  const routes = [
    {
      path: UIRoutes.HOME,
      element: <Auth />,
    },
    {
      path: UIRoutes.PORFILE,
      element: (
        <AuthRoute>
          <Profile />
        </AuthRoute>
      ),
    },
    {
      path: UIRoutes.deafultHomeBase,
      element: <Home />,
    },
  ];
  return (
    <div className="min-h-screen transition-colors" data-theme={theme}>
      <Router>
        <Routes>
          {routes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

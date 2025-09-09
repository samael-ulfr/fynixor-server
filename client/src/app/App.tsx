// src/App.tsx
import Auth from '@/components/auth/Auth';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Home from '@/pages/home/Home';
import Profile from '@/pages/profile/Profile';
import Workouts from '@/pages/workouts/Workouts';
import UIRoutes from '@/routes/uiRoutes';
import AuthRoute from '@/utils/AuthRoutes';
import { JSX } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppContent() {
  const { theme } = useTheme();

  type RouteItem = {
    path: string;
    element: JSX.Element;
    protected?: boolean;
  };
  const appRoutes: RouteItem[] = [
    { path: UIRoutes.HOME, element: <Auth /> },
    { path: UIRoutes.deafultHomeBase, element: <Home /> },
    { path: UIRoutes.PORFILE, element: <Profile />, protected: true },
    { path: UIRoutes.workouts, element: <Workouts />, protected: true },
  ];
  return (
    <div className="min-h-screen transition-colors" data-theme={theme}>
      <Router>
        <Routes>
          {appRoutes.map(({ path, element, protected: isProtected }, idx) => {
            const wrappedElement = isProtected ? (
              <AuthRoute>{element}</AuthRoute>
            ) : (
              element
            );

            return <Route key={idx} path={path} element={wrappedElement} />;
          })}
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

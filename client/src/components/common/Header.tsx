import { NavLink, useNavigate } from 'react-router-dom';
import PrimaryBtn from '@/shared/PrimaryBtn';
import { handleSignOutApi } from '@/services/authService';
import toast from 'react-hot-toast';
import { useState } from 'react';
import UIRoutes from '@/routes/uiRoutes';
import Loader from './Loader';

export default function Header() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Call your logout API
      await handleSignOutApi();
      // Clear storages
      localStorage.clear();
      sessionStorage.clear();
      // Clear frontend cookies (non-HttpOnly)
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      toast.success('Logged out successfully');
      // Redirect
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optional: show a toast notification
      // toast.error("Something went wrong during logout");
    } finally {
      setLoading(false);
    }
  };

  const navigationArray = [
    { name: 'Home', href: UIRoutes.HOME },
    { name: 'Profile', href: UIRoutes.PORFILE },
    { name: 'Workouts', href: UIRoutes.workouts },
  ];
  return (
    <header className="mb-2 flex w-full items-center justify-between border-b bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Logo or App Name */}
      {loading && <Loader />}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vidar</h1>
      <div className="hidden space-x-6 md:flex">
        {navigationArray.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <nav className="flex items-center gap-4">
        <PrimaryBtn
          label="Logout"
          onClick={handleLogout}
          className={`w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90`}
        />
      </nav>
    </header>
  );
}

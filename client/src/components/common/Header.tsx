import { useNavigate } from 'react-router-dom';
import PrimaryBtn from '@/shared/PrimaryBtn';
import { handleSignOutApi } from '@/services/authService';
import toast from 'react-hot-toast';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
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
    }
  };

  return (
    <header className="mb-2 flex w-full items-center justify-between border-b bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Logo or App Name */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Fynixor
      </h1>

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

import Loader from '@/components/common/Loader';
import { ThemeSwitcher } from '@/context/ThemeSwitcher';
import useAuth from '@/hooks/useAuth';
import { handleResetPasswordApi } from '@/services/authService';
import PrimaryBtn from '@/shared/PrimaryBtn';
import { SignInErrorsTypes } from '@/types/AuthTypes';
import { EyeOff, Eye } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
interface SignInCardProps {
  handleToggleAuthForm: (state: string) => void;
}
export default function ForgotPassword({
  handleToggleAuthForm,
}: SignInCardProps) {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState<SignInErrorsTypes>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // ✅ new state
  const { handleForgotPassword, handleResetPassword } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (token && newPassword) {
    
      await handleResetPassword({
        password: newPassword,
        token,
        setErrors,
        handleToggleAuthForm,
      });
    } else {
      await handleForgotPassword(username, setErrors, setToken);
    }
    setLoading(false);
  };

  const location = useLocation();
  const { isUserAuthenticated } = useAuth();

  // 👇 Replace with your real auth check (cookie, context, etc.)
  const isAuthenticated = isUserAuthenticated();
  if (isAuthenticated) {
    const redirectPath =
      (location.state as { from?: Location })?.from?.pathname || '/profile';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background transition-colors">
      <ThemeSwitcher />
      {loading && <Loader />}
      <div className="w-full max-w-md rounded-xl bg-card/80 p-6 shadow-soft ring-1 ring-border backdrop-blur transition-colors sm:p-8">
        <h2 className="mb-6 text-center text-xl font-semibold text-foreground sm:text-2xl">
          Forgot Password
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {token ? (
            <div className="relative flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm text-muted-foreground"
              >
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.password ? 'border-red-500' : 'border-border'
                } transition-colors`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <PrimaryBtn
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                label={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              ></PrimaryBtn>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="mb-1 text-sm text-muted-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="username"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.username ? 'border-red-500' : 'border-border'
                } transition-colors`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {token ? 'Reset' : 'Submit'}
          </button>
        </form>{' '}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => handleToggleAuthForm('signup')}
            >
              Sign Up
            </button>
          </p>
        </div>{' '}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => handleToggleAuthForm('login')}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import Joi from 'joi';
import { Eye, EyeOff } from 'lucide-react';
import { ThemeSwitcher } from '@/context/ThemeSwitcher';
import useAuth from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';
import PrimaryBtn from '@/shared/PrimaryBtn';
import { Navigate, useLocation } from 'react-router-dom';

// Define error types for signup
interface SignUpErrorsTypes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Joi schema for signup validation
// Joi schema
// Joi schema
const signupSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'First Name is required.',
    })
    .label('First Name'),
  lastName: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Last Name is required.',
    })
    .label('Last Name'),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required.',
      'string.email': 'Please enter a valid email address.',
    })
    .label('Email'),
  password: Joi.string()
    .min(6)
    .pattern(/(?=.*[a-z])/)
    .message('Password must have at least one lowercase letter')
    .pattern(/(?=.*[A-Z])/)
    .message('Password must have at least one uppercase letter')
    .pattern(/(?=.*\d)/)
    .message('Password must have at least one number')
    .pattern(/(?=.*[@$!%*?&])/)
    .message('Password must have at least one special character')
    .required()
    .messages({
      'string.empty': 'Password is required.',
    })
    .label('Password'),
});
interface SignUpCardProps {
  handleToggleAuthForm: (state: string) => void;
}
export default function SignUpCard({ handleToggleAuthForm }: SignUpCardProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignUpErrorsTypes>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { handleSignUp, isUserAuthenticated } = useAuth();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs with Joi
    const { error } = signupSchema.validate(
      { firstName, lastName, email, password },
      { abortEarly: false },
    );
    if (error) {
      const validationErrors: SignUpErrorsTypes = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      };
      error.details.forEach((err) => {
        const key = err.context?.key as keyof SignUpErrorsTypes;
        validationErrors[key] = err.message;
      });
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // Call your auth hook
    await handleSignUp(
      { firstName, lastName, email, password },
      setErrors,
      handleToggleAuthForm,
    );
    setLoading(false);
  };

  // Redirect if already logged in
  if (isUserAuthenticated()) {
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
          Sign Up
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* First Name */}
          <div className="flex flex-col">
            <label
              htmlFor="firstName"
              className="mb-1 text-sm text-muted-foreground"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.firstName ? 'border-red-500' : 'border-border'
              } transition-colors`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label
              htmlFor="lastName"
              className="mb-1 text-sm text-muted-foreground"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.lastName ? 'border-red-500' : 'border-border'
              } transition-colors`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm text-muted-foreground"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.email ? 'border-red-500' : 'border-border'
              } transition-colors`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Sign Up
          </button>
        </form>
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

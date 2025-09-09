// AuthRoute.tsx
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '@/components/common/Loader';
import Header from '@/components/common/Header';
import useAuth from '@/hooks/useAuth';

interface AuthRouteProps {
  children?: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();

  useEffect(() => {
    const isUserLoggedIn = isUserAuthenticated();
    if (!isUserLoggedIn) {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AuthRoute;

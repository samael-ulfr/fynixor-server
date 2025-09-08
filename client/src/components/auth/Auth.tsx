import React, { useState } from 'react';
import SignInCard from './signIn/SignIn';
import SignUpCard from './signUp/SignUp';

function Auth() {
  const [isSignUp, setIsSignUp] = useState('login');
  const handleToggleAuthForm = (state: string) => {
    setIsSignUp(state);
  };

  return (
    <div>
      {(() => {
        switch (isSignUp) {
          case 'login':
            return <SignInCard handleToggleAuthForm={handleToggleAuthForm} />;
          case 'signup':
            return <SignUpCard handleToggleAuthForm={handleToggleAuthForm} />;
          default:
            return <SignInCard handleToggleAuthForm={handleToggleAuthForm} />;
        }
      })()}
    </div>
  );
}

export default Auth;

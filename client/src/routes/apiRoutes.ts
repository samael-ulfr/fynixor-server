const baseUrl = 'api/v1/';

const APIRoutes = {
  userRoutes: {
    signInRoute: `${baseUrl}users/signin`,
    signUpRoute: `${baseUrl}users/signup`,
    signOutRoute: `${baseUrl}users/logout`,
    getProfileRoute: `${baseUrl}users/profile`,
  },
};

export default APIRoutes;

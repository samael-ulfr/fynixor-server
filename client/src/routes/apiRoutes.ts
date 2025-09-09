const baseUrl = 'api/v1/';

const APIRoutes = {
  userRoutes: {
    signInRoute: `${baseUrl}users/signin`,
    signUpRoute: `${baseUrl}users/signup`,
    signOutRoute: `${baseUrl}users/logout`,
    getProfileRoute: `${baseUrl}users/profile`,
    forgotPasswordRoute: `${baseUrl}users/forgot-password`,
    resetPasswordRoute: `${baseUrl}users/reset-password`,
  },
  workoutRoutes: {
    createWorkoutRoute: `${baseUrl}workouts`,
    getAllWorkoutsRoute: `${baseUrl}workouts`,
    updateWorkoutRoute: `${baseUrl}workouts`,
    deleteWorkoutRoute: `${baseUrl}workouts`,
  },
};

export default APIRoutes;

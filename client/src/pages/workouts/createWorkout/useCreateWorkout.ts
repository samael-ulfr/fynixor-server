import {
  handleCreateWorkoutApi,
  handleGetAllWorkoutsApi,
} from '@/services/workoutServices';
import toast from 'react-hot-toast';

function useCreateWorkout() {
  async function handleCreateWorkout(createWorkoutPayload: any) {
    toast.loading('Creating workout...', { id: 'createWorkout' });
    try {
      await handleCreateWorkoutApi(createWorkoutPayload);
      toast.success('Workout created successfully!', { id: 'createWorkout' });
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'error' in err.response.data
      ) {
        toast.error(
          (err as { response: { data: { error: string } } }).response.data
            .error,
          { id: 'createWorkout' },
        );
      } else {
        toast.error('An unexpected error occurred.', { id: 'createWorkout' });
      }
    }
  }

  async function handleGetAllWorkouts() {
    toast.loading('Fetching workouts...', { id: 'getAllWorkouts' });
    try {
      // You need to implement handleGetAllWorkoutsApi in your workoutServices
      const workouts = await handleGetAllWorkoutsApi();
      toast.success('Workouts fetched successfully!', { id: 'getAllWorkouts' });
      return workouts;
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'error' in err.response.data
      ) {
        toast.error(
          (err as { response: { data: { error: string } } }).response.data
            .error,
          { id: 'getAllWorkouts' },
        );
      } else {
        toast.error('An unexpected error occurred.', { id: 'getAllWorkouts' });
      }
    }
  }
  return { handleCreateWorkout, handleGetAllWorkouts };
}

export default useCreateWorkout;

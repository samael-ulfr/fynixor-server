import { baseAPI } from '@/config/axiosConfig';
import APIRoutes from '@/routes/apiRoutes';

type ExerciseType = { name: string; type: string; sets: SetType[] };
type SetType = {
  setNumber: number;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
  note: string;
};
export async function handleCreateWorkoutApi(createWorkoutPayload: {
  dateKey: string;
  notes: string;
  exercises: ExerciseType[];
  dateUTC: string;
}) {
  try {
    const response = await baseAPI.post(
      APIRoutes.workoutRoutes.createWorkoutRoute,
      createWorkoutPayload,
    );
    return response.data;
  } catch (error) {
    console.error('Error during creating workout API call:', error);
    throw error;
  }
}
export async function handleGetAllWorkoutsApi() {
  try {
    const response = await baseAPI.get(
      APIRoutes.workoutRoutes.getAllWorkoutsRoute,
    );
    return response.data;
  } catch (error) {
    console.error('Error during fetching all workouts API call:', error);
    throw error;
  }
}

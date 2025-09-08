import { baseAPI } from '@/config/axiosConfig';
import APIRoutes from '@/routes/apiRoutes';

export async function getProfileDetailsApi() {
  try {
    const response = await baseAPI.get(APIRoutes.userRoutes.getProfileRoute);
    return response.data;
  } catch (error) {
    console.error('Error during sign-out API call:', error);
    throw error;
  }
}

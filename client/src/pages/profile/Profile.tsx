import Loader from '@/components/common/Loader';
import { getProfileDetailsApi } from '@/services/profileServices';
import React, { useEffect, useState } from 'react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  role: string;
};
function Profile() {
  const [userProfile, setUserProfile] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    createdAt: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const fetchProfileDetails = async () => {
    setLoading(true);
    try {
      const profileDetails = await getProfileDetailsApi();
      setUserProfile(profileDetails.user);
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const { firstName, lastName, email, role, createdAt } = userProfile;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {loading && <Loader />}
      <div className="flex flex-col items-center p-6">
        {/* Avatar */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {firstName[0]}
          {lastName[0]}
        </div>

        {/* Name */}
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {firstName} {lastName}
        </h2>

        {/* Email */}
        <p className="mt-1 text-gray-500 dark:text-gray-400">{email}</p>

        {/* Role */}
        <span className="mt-2 inline-block rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground dark:bg-blue-800 dark:text-blue-100">
          {role.toUpperCase()}
        </span>

        {/* Account created date */}
        <p className="mt-3 text-sm text-primary">Joined on {formattedDate}</p>
      </div>
    </div>
  );
}

export default Profile;

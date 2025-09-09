import React, { useEffect, useState } from 'react';
import useCreateWorkout from '../createWorkout/useCreateWorkout';
import Loader from '@/components/common/Loader';
import { Dumbbell, Activity, Notebook } from 'lucide-react';
type SetType = {
  setNumber: number;
  reps: number;
  weight: number;
  unit: string;
  note?: string;
};

type ExerciseType = {
  name: string;
  type: string;
  sets: SetType[];
};

type WorkoutType = {
  _id: string;
  dateKey: string;
  notes: string;
  exercises: ExerciseType[];
};

const AllWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleGetAllWorkouts } = useCreateWorkout();
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await handleGetAllWorkouts();
        setWorkouts(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6 p-4">
      {loading && <Loader />}

      {workouts.map((workout) => (
        <div
          key={workout._id}
          className="bg-white mb-4 rounded-xl border p-4 shadow-sm"
        >
          {/* Workout header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h2 className="text-md font-bold text-primary">
                Workout – {workout.dateKey}
              </h2>
            </div>
            {workout.notes && (
              <span className="text-sm italic text-gray-400">
                {workout.notes}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {workout.exercises.map((exercise, idx) => (
              <div key={idx} className="bg-base-200 rounded-lg border p-3">
                {/* Exercise header */}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-primary">
                    <Activity className="h-4 w-4 text-primary" />
                    {exercise.name}
                  </h3>
                  <span className="flex items-center text-xs capitalize text-primary">
                    {' '}
                    <Notebook className="h-4 w-4 text-primary" />
                    {exercise.type}
                  </span>
                </div>

                {/* Sets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-secondary">
                        {['Set', 'Reps', 'Weight', 'Unit', 'Note'].map(
                          (header) => (
                            <th
                              key={header}
                              className="border p-1 text-center font-medium text-gray-700"
                            >
                              {header}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, sIdx) => (
                        <tr key={sIdx} className="odd:bg-white even:bg-gray-50">
                          <td className="border p-1 text-center">
                            {set.setNumber}
                          </td>
                          <td className="border p-1 text-center">{set.reps}</td>
                          <td className="border p-1 text-center">
                            {set.weight}
                          </td>
                          <td className="border p-1 text-center">{set.unit}</td>
                          <td className="border p-1">{set.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllWorkouts;

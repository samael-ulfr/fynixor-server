import React, { useState } from 'react';
import CreateWorkoutForm from './createWorkout/CreateWorkoutForm';
import WorkoutViewer from './workoutViewer/WorkoutViewer';

function Workouts() {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');

  return (
    <div>
      <div className="mx-auto max-w-3xl p-4">
        {/* Tabs */}
        <div className="mb-4 flex justify-center border-b border-gray-300">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'list'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            All Workouts
          </button>{' '}
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'add'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Add Workout
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'add' && <CreateWorkoutForm />}
          {activeTab === 'list' && <WorkoutViewer />}
        </div>
      </div>

      {/* <h2 className="text-center text-lg font-bold sm:text-left">Workouts</h2>
      <CreateWorkoutForm />
      <WorkoutViewer /> */}
    </div>
  );
}

export default Workouts;

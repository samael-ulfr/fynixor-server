import React, { useState } from 'react';
import Joi from 'joi';
import { Trash2 } from 'lucide-react';

type SetType = {
  setNumber: number;
  reps: number;
  weight: number;

  restSec: number;
};
type ExerciseType = { name: string; type: string; sets: SetType[] };
type WorkoutType = {
  dateKey: string;
  notes: string;
  exercises: ExerciseType[];
};

const cleanString = (str: string) =>
  str.trim().toLowerCase().replace(/\s+/g, ' ');

const setSchema = Joi.object({
  setNumber: Joi.number().required(),
  reps: Joi.number()
    .min(1)
    .required()
    .messages({ 'number.min': 'Reps must be > 0' }),
  weight: Joi.number()
    .min(0)
    .required()
    .messages({ 'number.min': 'Weight must be > 0' }),

  restSec: Joi.number()
    .min(1)
    .required()
    .messages({ 'number.min': 'Rest must be > 0' }),
});

const exerciseSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .required()
    .messages({ 'string.empty': 'Exercise name is required' }),
  type: Joi.string().valid('strength', 'cardio').required(),
  sets: Joi.array()
    .items(setSchema)
    .min(1)
    .messages({ 'array.min': 'At least one set is required' }),
});

const workoutSchema = Joi.object({
  dateKey: Joi.string()
    .required()
    .messages({ 'string.empty': 'Date is required' }),
  notes: Joi.string()
    .min(5)
    .required()
    .messages({ 'string.min': 'Notes must be at least 5 characters' }),
  exercises: Joi.array()
    .items(exerciseSchema)
    .min(1)
    .messages({ 'array.min': 'At least one exercise is required' }),
});

export default function WorkoutForm() {
  const today = new Date().toISOString().split('T')[0];
  const [dateKey, setDateKey] = useState(today);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseType[]>([
    {
      name: '',
      type: 'strength',
      sets: [{ setNumber: 1, reps: 1, weight: 2.5, restSec: 30 }],
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addExercise = () =>
    setExercises((prev) => [
      ...prev,
      {
        name: '',
        type: 'strength',
        sets: [{ setNumber: 1, reps: 1, weight: 2.5, restSec: 30 }],
      },
    ]);
  const deleteExercise = (i: number) =>
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  const updateExercise = (i: number, field: keyof ExerciseType, val: string) =>
    setExercises((prev) =>
      prev.map((ex, idx) => (idx === i ? { ...ex, [field]: val } : ex)),
    );
  const addSet = (i: number) =>
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === i
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  setNumber: ex.sets.length + 1,
                  reps: 1,
                  weight: 2.5,

                  restSec: 30,
                },
              ],
            }
          : ex,
      ),
    );
  const deleteSet = (i: number, s: number) =>
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === i
          ? {
              ...ex,
              sets:
                ex.sets.length > 1
                  ? ex.sets
                      .filter((_, si) => si !== s)
                      .map((set, j) => ({ ...set, setNumber: j + 1 }))
                  : ex.sets,
            }
          : ex,
      ),
    );
  const updateSet = (
    i: number,
    s: number,
    field: keyof SetType,
    val: string | number,
  ) =>
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === i
          ? {
              ...ex,
              sets: ex.sets.map((set, si) =>
                si === s ? { ...set, [field]: val } : set,
              ),
            }
          : ex,
      ),
    );
  const getUTCISOString = (d: string) => new Date(d).toISOString();

  const validateWorkout = () => {
    const workout: WorkoutType = {
      dateKey,

      notes,
      exercises,
    };

    const { error } = workoutSchema.validate(workout, { abortEarly: false });
    const newErrors: Record<string, string> = {};
    if (error)
      error.details.forEach((e) => (newErrors[e.path.join('.')] = e.message));
    exercises.forEach((ex, eIdx) =>
      ex.sets.forEach((set, sIdx) => {
        const minW = 2.5;
        if (set.weight < minW)
          newErrors[`exercises.${eIdx}.sets.${sIdx}.weight`] =
            `Weight must be at least ${minW}}`;
      }),
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateWorkout()) return;
    console.log('Workout Data:', {
      dateKey,
      notes,
      exercises,
    });
    alert('Workout saved! Check console.');
  };
  const getError = (path: string) => errors[path];

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl space-y-4 rounded-xl bg-white p-4 text-sm shadow-md"
    >
      <h2 className="text-center text-lg font-bold sm:text-left">
        Add Workout
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="mb-1 block">Date</label>
          <input
            type="date"
            value={dateKey}
            onChange={(e) => setDateKey(e.target.value)}
            className={`w-full rounded border p-2 ${getError('dateKey') ? 'border-red-500' : ''}`}
          />
          {getError('dateKey') && (
            <p className="text-xs text-red-500">{getError('dateKey')}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full resize-none rounded border p-2"
            rows={1}
            placeholder="Leg day was solid!"
          />
          {getError('notes') && (
            <p className="text-xs text-red-500">{getError('notes')}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Exercises</h3>
        {getError('exercises') && (
          <p className="text-xs text-red-500">{getError('exercises')}</p>
        )}
        {exercises.map((ex, idx) => (
          <div
            key={idx}
            className="group relative space-y-2 rounded border bg-gray-50 p-2"
          >
            <button
              type="button"
              onClick={() => deleteExercise(idx)}
              disabled={exercises.length === 1}
              className={`absolute right-2 top-0 text-xs transition-opacity duration-200 ${exercises.length === 1 ? 'cursor-not-allowed text-gray-400 opacity-0' : 'text-primary opacity-0 hover:bg-primary/90 group-hover:opacity-100'}`}
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                  className={`w-full rounded border p-2 ${getError(`exercises.${idx}.name`) ? 'border-red-500' : ''}`}
                  placeholder="Exercise Name"
                />
                {getError(`exercises.${idx}.name`) && (
                  <p className="text-xs text-red-500">
                    {getError(`exercises.${idx}.name`)}
                  </p>
                )}{' '}
              </div>
              <select
                value={ex.type}
                onChange={(e) => updateExercise(idx, 'type', e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>
            <div className="relative rounded border bg-white p-2">
              <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
                <p className="text-xs text-gray-600">Set No.</p>
                <p className="text-xs text-gray-600">Repition</p>
                <p className="text-xs text-gray-600">Weight (kg)</p>
                <p className="text-xs text-gray-600">Rest (sec)</p>
              </div>
            </div>
            <div className="space-y-2">
              {ex.sets.map((set, sIdx) => (
                <div
                  key={sIdx}
                  className="relative rounded border bg-white p-2"
                >
                  <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => deleteSet(idx, sIdx)}
                        disabled={ex.sets.length === 1}
                        className={`text-xs ${ex.sets.length === 1 ? 'cursor-not-allowed text-gray-400' : 'text-primary hover:text-red-700'}`}
                      >
                        ✕
                      </button>
                      <p className="text-xs text-gray-600">
                        Set {set.setNumber}
                      </p>
                    </div>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(idx, sIdx, 'reps', Number(e.target.value))
                      }
                      className={`w-full rounded border p-1 text-xs ${getError(`exercises.${idx}.sets.${sIdx}.reps`) ? 'border-red-500' : ''}`}
                      placeholder="Reps"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(idx, sIdx, 'weight', Number(e.target.value))
                      }
                      className={`w-full rounded border p-1 text-xs ${getError(`exercises.${idx}.sets.${sIdx}.weight`) ? 'border-red-500' : ''}`}
                      placeholder="Weight"
                    />
                    <input
                      type="number"
                      value={set.restSec}
                      onChange={(e) =>
                        updateSet(idx, sIdx, 'restSec', Number(e.target.value))
                      }
                      className={`w-full rounded border p-1 text-xs ${getError(`exercises.${idx}.sets.${sIdx}.restSec`) ? 'border-red-500' : ''}`}
                      placeholder="Rest"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSet(idx)}
                className="text-xs text-primary underline"
              >
                + Add Set
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addExercise}
          className="text-xs text-primary underline"
        >
          + Add Exercise
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-primary p-2 text-sm font-semibold text-primary-foreground text-white hover:bg-primary/90"
      >
        Save Workout
      </button>
    </form>
  );
}

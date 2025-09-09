const WorkoutSkeleton = () => (
  <div className="bg-base-100/70 mb-4 animate-pulse rounded-xl border p-4 shadow-sm backdrop-blur-sm">
    {/* Workout header skeleton */}
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-primary/40 blur-sm" />
        <div className="h-4 w-32 rounded bg-primary/40 blur-sm" />
      </div>
      <div className="h-3 w-20 rounded bg-secondary/40 blur-sm" />
    </div>

    {/* Exercise block skeleton */}
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-base-200/30 rounded-lg border p-3 backdrop-blur-sm"
        >
          {/* Exercise header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-primary/50 blur-sm" />
            <div className="h-3 w-16 rounded bg-secondary/40 blur-sm" />
          </div>

          {/* Table rows */}
          <div className="space-y-2">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex gap-2">
                <div className="h-3 w-8 rounded bg-primary/30 blur-sm" />
                <div className="h-3 w-10 rounded bg-primary/30 blur-sm" />
                <div className="h-3 w-12 rounded bg-primary/30 blur-sm" />
                <div className="h-3 w-8 rounded bg-primary/30 blur-sm" />
                <div className="h-3 w-20 rounded bg-primary/30 blur-sm" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WorkoutSkeleton;

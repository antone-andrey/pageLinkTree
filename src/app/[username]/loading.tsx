export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        {/* Avatar skeleton */}
        <div className="mx-auto mb-4 h-24 w-24 animate-pulse rounded-full bg-gray-200" />

        {/* Name skeleton */}
        <div className="mx-auto mb-2 h-6 w-40 animate-pulse rounded-lg bg-gray-200" />

        {/* Bio skeleton */}
        <div className="mx-auto mb-8 h-4 w-56 animate-pulse rounded bg-gray-200" />

        {/* Link button skeletons */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="mx-auto h-12 w-full animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

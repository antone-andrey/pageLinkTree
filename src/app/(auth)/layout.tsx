export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">PageDrop</h1>
          <p className="text-gray-500 mt-1">One link. Get paid, get booked, get followed.</p>
        </div>
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080c] p-4">
      <div className="text-center">
        <p className="mb-2 text-7xl font-bold text-white">404</p>
        <h1 className="mb-3 text-xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

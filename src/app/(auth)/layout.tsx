import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen auth-bg flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex">
            <Logo variant="full" theme="dark" size="lg" />
          </Link>
          <p className="text-gray-500 mt-2 text-sm">One link. Get paid, get booked, get followed.</p>
        </div>

        {/* Card */}
        {children}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8">
          &copy; {new Date().getFullYear()} PageDrop. All rights reserved.
        </p>
      </div>
    </div>
  );
}

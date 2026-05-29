import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#07070f" }}>
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="text-8xl font-black text-red-600 mb-4">404</p>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          Page not found
        </h1>
        <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
          The page you are looking for does not exist. But while you are here, why not scan something for compliance risks? Free. 60 seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/#demo"
            className="rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Try a free scan →
          </a>
          <Link
            href="/"
            className="rounded-xl border border-gray-700 px-8 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

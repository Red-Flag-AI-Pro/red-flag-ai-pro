import Link from "next/link";
import Image from "next/image";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/redflag-logo-transparent.png"
              alt="Red Flag AI Pro"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </Link>
          <h1
            className="mt-4 text-2xl font-bold"
            style={{ background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            No credit card required · Cancel anytime
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

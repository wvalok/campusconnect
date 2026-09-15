import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/bennett-logo.png"
            alt="Bennett University"
            width={150}
            height={200}
            className="h-auto w-[130px]"
            priority
          />
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
            CampusConnect
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bennett University student portal
          </p>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Events, societies, hackathons and campus resources.
          </p>

          <LoginForm />
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <p className="font-medium text-slate-600 dark:text-slate-300">
            Demo accounts
          </p>
          <p className="mt-1">
            <span className="font-mono">aarav@campus.edu</span> ·{" "}
            <span className="font-mono">password123</span>
          </p>
          <p className="mt-0.5">
            Also: diya@campus.edu, kabir@campus.edu, meera@campus.edu (same
            password)
          </p>
        </div>
      </div>
    </div>
  );
}

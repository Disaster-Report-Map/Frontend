import React from "react";
import RegisterForm from "../../../components/forms/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-10 relative">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join the community and report incidents.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

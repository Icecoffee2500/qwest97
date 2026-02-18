"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "로그인에 실패했습니다");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xs">
        <h1 className="text-xs font-medium tracking-[0.25em] uppercase text-center mb-10">
          Admin
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 text-sm border border-neutral-200 outline-none focus:border-black transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 text-xs tracking-[0.15em] uppercase bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Login"}
          </button>
          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

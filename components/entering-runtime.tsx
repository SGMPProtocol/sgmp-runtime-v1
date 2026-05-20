"use client";

import { useState, useTransition } from "react";
import { submitWaitlist } from "@/app/actions/waitlist";

export function EnteringRuntime() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitWaitlist(formData);
      if (result.success) {
        setStatus({ type: "success" });
        const form = document.getElementById("waitlist-form") as HTMLFormElement;
        form?.reset();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  };

  return (
    <section
      id="entering-runtime"
      className="py-24 md:py-32 border-t border-[hsl(var(--border))]"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-4 block">
          Coming Soon
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 text-balance">
          Entering Runtime Soon
        </h2>
        <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed mb-12 max-w-2xl mx-auto">
          The first generation of SGMP autonomous artists are preparing for
          their public debut. Join the waitlist to be among the first to witness
          musical intelligence that truly evolves.
        </p>

        {status.type === "success" ? (
          <div className="max-w-md mx-auto">
            <div className="p-8 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--accent))]/30">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--accent))]/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[hsl(var(--accent))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Welcome to the waitlist
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6">
                {"You'll"} be among the first to experience SGMP when we launch.
              </p>
              <button
                onClick={() => setStatus({ type: "idle" })}
                className="text-sm text-[hsl(var(--accent))] hover:underline"
              >
                Submit another response
              </button>
            </div>
          </div>
        ) : (
          <form
            id="waitlist-form"
            action={handleSubmit}
            className="max-w-md mx-auto space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="w-full px-5 py-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-5 py-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
              />
            </div>
            <input
              type="text"
              name="role"
              placeholder="Role (e.g., Artist, Developer, Investor)"
              className="w-full px-5 py-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
            />
            <textarea
              name="message"
              placeholder="Message (optional)"
              rows={3}
              className="w-full px-5 py-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors resize-none"
            />

            {status.type === "error" && (
              <p className="text-sm text-red-400">{status.message}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-8 py-4 rounded-lg bg-[hsl(var(--accent))] hover:bg-[hsl(220,70%,50%)] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Joining..." : "Join Waitlist"}
            </button>

            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Be notified when we launch. No spam, just signals.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

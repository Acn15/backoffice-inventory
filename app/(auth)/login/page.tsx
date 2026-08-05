import { LoginForm } from "@/domains/auth/presentation/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#d7e4f0_0%,_transparent_55%),linear-gradient(180deg,_#f3f5f7_0%,_#e7edf3_100%)]"
      />
      <div className="relative w-full max-w-md">
        <p className="mb-6 text-center text-sm font-semibold tracking-[0.18em] text-[var(--color-primary)] uppercase">
          Automotive Parts
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

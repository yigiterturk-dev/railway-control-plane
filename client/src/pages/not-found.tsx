import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-md border border-border bg-card p-6">
        <AlertCircle className="size-6 text-destructive" aria-hidden="true" />
        <p className="eyebrow mt-6">404 / route unavailable</p>
        <h1 className="mt-2 text-xl font-semibold">This control-plane view does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Return to the verified service operations workspace.</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Return to control plane</Link>
      </section>
    </main>
  );
}

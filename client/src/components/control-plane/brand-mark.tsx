import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={cn("size-7", className)} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M5 7.5h11.5c3.6 0 6.5 2.9 6.5 6.5S20.1 20.5 16.5 20.5H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12h11.5a2 2 0 0 1 0 4H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 5v5M10 18v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

import { CircleCheck, CircleDashed, CircleStop, TriangleAlert } from "lucide-react";
import type { DeploymentStatus } from "@shared/schema";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  SUCCESS: "border-emerald-700/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REMOVED: "border-border bg-muted text-muted-foreground",
  SLEEPING: "border-border bg-muted text-muted-foreground",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
  CRASHED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status, compact = false }: { status: DeploymentStatus | string; compact?: boolean }) {
  const pending = ["BUILDING", "DEPLOYING", "WAITING", "QUEUED"].includes(status);
  const failed = ["FAILED", "CRASHED", "SKIPPED"].includes(status);
  const stopped = ["REMOVED", "SLEEPING"].includes(status);
  const Icon = status === "SUCCESS" ? CircleCheck : failed ? TriangleAlert : stopped ? CircleStop : CircleDashed;
  return (
    <span className={cn("inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[11px] font-semibold tracking-[0.04em]", styles[status] ?? "border-amber-600/25 bg-amber-500/10 text-amber-700 dark:text-amber-300")}>
      <Icon className={cn("size-3.5", pending && "motion-safe:animate-pulse")} aria-hidden="true" />
      {!compact && status}
      <span className="sr-only">Deployment status</span>
    </span>
  );
}

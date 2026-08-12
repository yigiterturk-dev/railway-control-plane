import { useState } from "react";
import { ChevronDown, CircleCheck, CircleX, Clock3 } from "lucide-react";
import type { WorkflowRunWithEvents } from "@shared/schema";
import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });

function LedgerRow({ run }: { run: WorkflowRunWithEvents }) {
  const [open, setOpen] = useState(false);
  const Icon = run.outcome === "success" ? CircleCheck : run.outcome === "failure" ? CircleX : Clock3;
  return (
    <article className={cn("ledger-record", run.outcome === "success" && "is-new")} data-testid={`ledger-${run.id}`}>
      <button className="ledger-summary" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span className={cn("ledger-icon", run.outcome)}><Icon className="size-4" aria-hidden="true" /></span>
        <span className="min-w-0"><span className="block truncate text-sm font-medium capitalize">{run.action} service</span><span className="block font-mono text-[11px] text-muted-foreground">{run.id.slice(0, 8)}</span></span>
        <span className="hidden text-sm capitalize text-muted-foreground sm:block">{run.stage}</span>
        <span className="hidden text-sm text-muted-foreground lg:block">{run.actor}</span>
        <time className="font-mono text-[11px] text-muted-foreground" dateTime={new Date(run.updatedAt).toISOString()}>{formatter.format(new Date(run.updatedAt))}</time>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      <div className={cn("ledger-detail-grid", open && "is-open")}><div><ol className="space-y-0 border-l border-border py-1">
        {run.events.map((event) => <li key={event.id} className="relative ml-4 grid gap-1 border-b border-border/70 py-3 last:border-0 sm:grid-cols-[110px_1fr_auto] sm:items-start"><span className={cn("absolute -left-[19px] top-4 size-2 rounded-full ring-4 ring-card", event.severity === "error" ? "bg-destructive" : event.severity === "warning" ? "bg-amber-500" : "bg-primary")} /><span className="font-mono text-[11px] uppercase text-muted-foreground">{event.stage}</span><span className="text-sm">{event.message}</span><time className="font-mono text-[10px] text-muted-foreground">{new Date(event.createdAt).toLocaleTimeString()}</time>{Object.keys(event.evidence).length > 0 && <code className="col-span-full mt-1 overflow-x-auto bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">{JSON.stringify(event.evidence)}</code>}</li>)}
      </ol></div></div>
    </article>
  );
}

export function ActivityLedger({ workflows, loading }: { workflows: WorkflowRunWithEvents[]; loading?: boolean }) {
  return <section id="activity" className="ledger-panel" aria-labelledby="ledger-title"><div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-5 sm:px-6"><div><p className="eyebrow">Audit trail</p><h2 id="ledger-title" className="mt-1 text-lg font-semibold tracking-[-0.02em]">Activity ledger</h2></div><span className="font-mono text-[11px] text-muted-foreground">{workflows.length} RECORDED OPERATIONS</span></div><div className="ledger-columns hidden border-b border-border px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid"><span>Operation</span><span>State</span><span className="hidden lg:block">Actor</span><span>Observed</span><span /></div>{loading ? <div className="p-6 text-sm text-muted-foreground">Loading durable evidence…</div> : workflows.length ? workflows.map((run) => <LedgerRow key={run.id} run={run} />) : <div className="empty-ledger"><Clock3 className="size-5" /><p>No operations yet.</p><span>Run a safe demo command to create the first evidence record.</span></div>}</section>;
}

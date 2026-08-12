import { Check, Clock3, Circle, TriangleAlert } from "lucide-react";
import type { WorkflowRunWithEvents, WorkflowStage } from "@shared/schema";
import { cn } from "@/lib/utils";

const stages: Array<{ key: Exclude<WorkflowStage, "failed" | "timed_out">; label: string; detail: string }> = [
  { key: "requested", label: "Requested", detail: "Intent recorded" },
  { key: "validated", label: "Validated", detail: "Policy checked" },
  { key: "dispatched", label: "Dispatched", detail: "API accepted" },
  { key: "observed", label: "Observed", detail: "State returned" },
  { key: "settled", label: "Settled", detail: "Outcome verified" },
];

export function WorkflowRail({ workflow }: { workflow?: WorkflowRunWithEvents }) {
  const failure = workflow?.stage === "failed" || workflow?.stage === "timed_out";
  const observedKeys = new Set(workflow?.events.map((event) => event.stage) ?? []);
  const activeIndex = workflow ? stages.findIndex((item) => item.key === workflow.stage) : -1;
  const fallbackIndex = workflow ? Math.max(0, stages.findIndex((item) => !observedKeys.has(item.key)) - 1) : -1;
  const currentIndex = activeIndex >= 0 ? activeIndex : fallbackIndex;

  return (
    <section className="rail-panel" aria-labelledby="workflow-title" data-testid="workflow-rail">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Active operation</p>
          <h2 id="workflow-title" className="mt-1 text-lg font-semibold tracking-[-0.02em]">
            {workflow ? `${workflow.action[0].toUpperCase()}${workflow.action.slice(1)} lifecycle` : "No operation in progress"}
          </h2>
        </div>
        <p className="font-mono text-xs text-muted-foreground" aria-live="polite" data-testid="workflow-live-status">
          {workflow ? `${workflow.stage} · ${workflow.outcome}` : "Ready for a verified command"}
        </p>
      </div>

      <ol className="workflow-rail">
        {stages.map((stage, index) => {
          const completed = workflow ? observedKeys.has(stage.key) : false;
          const active = workflow?.stage === stage.key || (failure && index === currentIndex);
          const Icon = failure && active ? TriangleAlert : completed ? Check : active ? Clock3 : Circle;
          return (
            <li key={stage.key} className={cn("workflow-stage", completed && "is-complete", active && "is-active", failure && active && "is-failed")}>
              <div className="stage-line" aria-hidden="true"><span /></div>
              <div className="stage-node"><Icon className="size-4" aria-hidden="true" /></div>
              <div className="stage-copy"><span className="text-sm font-medium">{stage.label}</span><span className="text-xs text-muted-foreground">{stage.detail}</span></div>
            </li>
          );
        })}
      </ol>

      {failure && <div className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm" role="alert"><strong className="font-semibold">Verification failed.</strong>{" "}<span className="text-muted-foreground">{workflow?.errorMessage || "Inspect the latest evidence before retrying."}</span></div>}
    </section>
  );
}

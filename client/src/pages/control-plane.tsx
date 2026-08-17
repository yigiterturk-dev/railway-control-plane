import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Activity, BookOpenText, Box, ChevronRight, CircleGauge, CloudCog, Github, Moon, RefreshCw, Rocket, Square, Sun } from "lucide-react";
import type { ResourceContext, WorkflowAction, WorkflowRunWithEvents } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BrandMark } from "@/components/control-plane/brand-mark";
import { StatusBadge } from "@/components/control-plane/status-badge";
import { WorkflowRail } from "@/components/control-plane/workflow-rail";
import { ActivityLedger } from "@/components/control-plane/activity-ledger";

const nav = [
  { label: "Control plane", href: "/", icon: CircleGauge },
  { label: "Activity", href: "/#activity", icon: Activity },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return <Button variant="ghost" size="icon" className="size-9" onClick={() => setDark((value) => !value)} aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>;
}

function ArchitectureDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline" className="h-10 gap-2"><BookOpenText className="size-4" /> Architecture</Button></DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>Reliability is part of the interface</DialogTitle><DialogDescription>The browser never receives a Railway credential. Every action becomes a typed, auditable server workflow.</DialogDescription></DialogHeader>
        <div className="architecture-flow" aria-label="Architecture flow">{["React operator UI", "Express workflow API", "Demo / Railway adapter", "Observed deployment state"].map((item, index) => <div key={item} className="contents"><span>{item}</span>{index < 3 && <ChevronRight className="size-4 text-muted-foreground" />}</div>)}</div>
        <div className="grid gap-5 text-sm sm:grid-cols-2">
          <div><h3 className="font-semibold">Safety boundary</h3><p className="mt-2 leading-6 text-muted-foreground">Strict Zod input validation, server-only secrets, explicit live-mode confirmations, request timeouts, sanitized errors, and idempotency keys.</p></div>
          <div><h3 className="font-semibold">Truth boundary</h3><p className="mt-2 leading-6 text-muted-foreground">The UI displays success only after the adapter observes the expected Railway deployment state. Dispatch acceptance is not treated as completion.</p></div>
          <div><h3 className="font-semibold">Persistence seam</h3><p className="mt-2 leading-6 text-muted-foreground">The in-memory demo storage implements an interface modeled by Drizzle tables, so a durable Postgres adapter can replace it without changing the workflow contract.</p></div>
          <div><h3 className="font-semibold">Honest scope</h3><p className="mt-2 leading-6 text-muted-foreground">This portfolio build proves one-service lifecycle control. It does not claim production tenancy, RBAC, or distributed workflow guarantees.</p></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ActionButton({ action, context, pending, onRun }: { action: WorkflowAction; context: ResourceContext; pending: boolean; onRun: (action: WorkflowAction) => void }) {
  const [confirm, setConfirm] = useState(false);
  const config = {
    deploy: { label: context.currentDeployment?.status === "REMOVED" ? "Start service" : "Deploy latest", Icon: Rocket, variant: "default" as const },
    restart: { label: "Restart", Icon: RefreshCw, variant: "outline" as const },
    stop: { label: "Stop", Icon: Square, variant: "outline" as const },
  }[action];
  const stopped = !context.currentDeployment || ["REMOVED", "SLEEPING"].includes(context.currentDeployment.status);
  const unavailable = action !== "deploy" && stopped;
  const invoke = () => context.mode === "live" && action !== "deploy" ? setConfirm(true) : onRun(action);
  return <>
    <Button variant={config.variant} className="h-11 gap-2" disabled={pending || unavailable} onClick={invoke} data-testid={`action-${action}`}><config.Icon className={pending ? "size-4 animate-pulse" : "size-4"} />{config.label}</Button>
    <AlertDialog open={confirm} onOpenChange={setConfirm}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{config.label} in live mode?</AlertDialogTitle><AlertDialogDescription>This sends a real command to Railway for {context.service.name} in {context.environment.name}. The result remains pending until observed.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className={action === "stop" ? "bg-destructive text-destructive-foreground" : ""} onClick={() => onRun(action)}>Confirm {action}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}

export default function ControlPlanePage() {
  const contextQuery = useQuery<ResourceContext>({ queryKey: ["/api/context"], refetchInterval: 4_000, staleTime: 1_500 });
  const workflowsQuery = useQuery<WorkflowRunWithEvents[]>({ queryKey: ["/api/workflows"], refetchInterval: (query) => query.state.data?.some((run) => run.outcome === "pending") ? 500 : 3_000, staleTime: 250 });
  const workflows = workflowsQuery.data ?? [];
  const active = useMemo(() => workflows.find((run) => run.outcome === "pending") ?? workflows[0], [workflows]);
  const mutation = useMutation({
    mutationFn: async (action: WorkflowAction) => {
      const context = contextQuery.data;
      if (!context) throw new Error("Resource context is not ready.");
      const response = await apiRequest("POST", "/api/actions", { action, projectId: context.project.id, environmentId: context.environment.id, serviceId: context.service.id, idempotencyKey: `ui_${action}_${Date.now()}` });
      return response.json() as Promise<WorkflowRunWithEvents>;
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["/api/workflows"] }); await queryClient.invalidateQueries({ queryKey: ["/api/context"] }); },
  });
  const context = contextQuery.data;
  const pending = mutation.isPending || workflows.some((run) => run.outcome === "pending");

  return (
    <SidebarProvider style={{ "--sidebar-width": "15.5rem" } as CSSProperties}>
      <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border p-5"><Link href="/" className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-9 place-items-center rounded-md bg-sidebar-foreground text-sidebar"><BrandMark className="size-6" /></span><span><strong className="block text-sm tracking-[-0.02em]">Control Plane</strong><span className="block font-mono text-[10px] text-muted-foreground">RAILWAY ADAPTER / 01</span></span></Link></SidebarHeader>
        <SidebarContent>
          <SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{nav.map(({ label, href, icon: Icon }, index) => <SidebarMenuItem key={label}><SidebarMenuButton asChild isActive={index === 0}><Link href={href}><Icon /><span>{label}</span></Link></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup>
          <SidebarGroup><SidebarGroupLabel>Selected resource</SidebarGroupLabel><SidebarGroupContent><div className="mx-2 border-l border-sidebar-border pl-3 text-xs leading-6 text-muted-foreground"><p className="truncate text-sidebar-foreground">{context?.project.name || "Loading project…"}</p><p className="truncate">{context?.environment.name || "environment"}</p><p className="truncate font-mono text-[10px]">{context?.service.id || "service-id"}</p></div></SidebarGroupContent></SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4"><a href="https://github.com/yigiterturk-dev/railway-control-plane" target="_blank" rel="noreferrer" className="flex min-h-10 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"><Github className="size-4" /> Source & decisions</a></SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-3"><SidebarTrigger className="size-9" /><div className="h-5 w-px bg-border" /><div><p className="text-sm font-medium">Service operations</p><p className="hidden font-mono text-[10px] text-muted-foreground sm:block">REQUEST → OBSERVE → VERIFY</p></div></div><div className="flex items-center gap-2"><span className="mode-badge"><span className="size-1.5 rounded-full bg-current" />{context?.mode || "demo"} mode</span><ThemeToggle /></div></header>

        <main className="main-canvas">
          {contextQuery.isError && <div className="error-banner" role="alert">Could not load control-plane context. Check server configuration and try again.</div>}
          <section className="context-band" aria-labelledby="service-title"><div className="min-w-0"><div className="mb-4 flex flex-wrap items-center gap-2"><span className="eyebrow">{context?.project.name || "Control plane"}</span><span className="text-muted-foreground">/</span><span className="font-mono text-[11px] text-muted-foreground">{context?.environment.name || "environment"}</span></div><div className="flex flex-wrap items-center gap-3"><h1 id="service-title" className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">{context?.service.name || "Loading service…"}</h1>{context?.currentDeployment && <StatusBadge status={context.currentDeployment.status} />}</div><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Run a service lifecycle command, follow its verified state transition, and inspect the evidence that made the result trustworthy.</p></div><div className="context-meta"><div><span>Source</span><strong>{context?.source === "railway-api" ? "Railway GraphQL" : "Deterministic simulation"}</strong></div><div><span>Last observed</span><strong className="font-mono">{context ? new Date(context.observedAt).toLocaleTimeString() : "—"}</strong></div><div><span>Deployment</span><strong className="font-mono">{context?.currentDeployment?.id.slice(0, 16) || "None"}</strong></div></div></section>

          <section className="command-band" aria-labelledby="command-title"><div><p className="eyebrow">Lifecycle command</p><h2 id="command-title" className="mt-1 text-lg font-semibold tracking-[-0.02em]">Choose an explicit operation</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Dispatch is only the beginning. Completion appears after the expected deployment state is observed.</p></div><div className="flex flex-wrap gap-2">{context && <><ActionButton action="deploy" context={context} pending={pending} onRun={(action) => mutation.mutate(action)} /><ActionButton action="restart" context={context} pending={pending} onRun={(action) => mutation.mutate(action)} /><ActionButton action="stop" context={context} pending={pending} onRun={(action) => mutation.mutate(action)} /></>}</div></section>
          {mutation.isError && <div className="error-banner" role="alert">{mutation.error instanceof Error ? mutation.error.message : "The action could not be requested."}</div>}

          <div className="operation-grid"><WorkflowRail workflow={active} /><aside className="evidence-panel" aria-labelledby="evidence-title"><div><p className="eyebrow">Current evidence</p><h2 id="evidence-title" className="mt-1 text-lg font-semibold tracking-[-0.02em]">Deployment truth</h2></div><dl className="evidence-list"><div><dt>Status</dt><dd>{context?.currentDeployment ? <StatusBadge status={context.currentDeployment.status} /> : "No deployment"}</dd></div><div><dt>Service</dt><dd className="font-mono">{context?.service.id || "—"}</dd></div><div><dt>Environment</dt><dd>{context?.environment.name || "—"}</dd></div><div><dt>Credential boundary</dt><dd>Server only</dd></div></dl><div className="mt-auto border-t border-border pt-4"><p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><CloudCog className="mt-0.5 size-4 shrink-0" />Demo data is labelled and deterministic. Live mode uses the same workflow contract with real observations.</p></div></aside></div>

          <ActivityLedger workflows={workflows} loading={workflowsQuery.isLoading} />
          <section id="architecture" className="proof-band"><div><div className="flex items-center gap-2 text-primary"><Box className="size-4" /><span className="eyebrow text-primary">Engineering proof</span></div><h2 className="mt-2 text-lg font-semibold">The interface and system tell the same story.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Typed state, idempotent requests, explicit failure, server-only credentials, reduced motion, and a replaceable persistence seam are documented in the repository.</p></div><div className="flex gap-2"><ArchitectureDialog /><Button variant="ghost" className="h-10 gap-2" asChild><a href="https://github.com/yigiterturk-dev/railway-control-plane" target="_blank" rel="noreferrer"><Github className="size-4" /> Repository</a></Button></div></section>
          <footer className="flex flex-col justify-between gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row"><p>Independent portfolio project. Not affiliated with Railway.</p><p className="font-mono">BUILT FOR OBSERVABILITY, NOT THEATRE.</p></footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { randomUUID } from "node:crypto";
import { actionRequestSchema } from "@shared/schema";
import { createControlPlane, expectedOutcome, type ControlPlaneAdapter } from "./control-plane";
import { storage, type IStorage } from "./storage";

const terminalFailure = new Set(["FAILED", "CRASHED", "REMOVED", "SKIPPED"]);
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function createWorkflowRunner(adapter: ControlPlaneAdapter, store: IStorage) {
  return async function run(workflowId: string, input: ReturnType<typeof actionRequestSchema.parse>) {
    try {
      const context = await adapter.getContext();
      if (context.project.id !== input.projectId || context.environment.id !== input.environmentId || context.service.id !== input.serviceId) {
        throw new Error("Requested resource context does not match the server-approved target.");
      }
      await store.advanceWorkflow(workflowId, "validated", "Resource context and action policy validated.", { action: input.action });
      const dispatched = await adapter.dispatch(input);
      await store.advanceWorkflow(workflowId, "dispatched", "Operation dispatched to control-plane adapter.", { acceptedAt: dispatched.acceptedAt }, "info", { deploymentId: dispatched.deploymentId });

      const attempts = adapter.mode === "demo" ? 1 : 30;
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        if (adapter.mode === "live") await pause(2_000);
        const observation = await adapter.observe(dispatched.deploymentId);
        await store.advanceWorkflow(workflowId, "observed", `Observed deployment state: ${observation.status}.`, { status: observation.status, attempt, observedAt: observation.observedAt });
        if (expectedOutcome(input.action).includes(observation.status)) {
          await store.advanceWorkflow(workflowId, "settled", "Observed state verifies the requested outcome.", { status: observation.status }, "info", { outcome: "success" });
          return;
        }
        if (terminalFailure.has(observation.status)) throw new Error(`Deployment reached terminal state ${observation.status}.`);
      }
      await store.advanceWorkflow(workflowId, "timed_out", "Verification window elapsed before the expected state was observed.", { timeoutSeconds: 60 }, "warning", { outcome: "failure", errorMessage: "Verification timed out." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed.";
      await store.advanceWorkflow(workflowId, "failed", message, { recoverable: true }, "error", { outcome: "failure", errorMessage: message });
    }
  };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const adapter = createControlPlane();
  const runWorkflow = createWorkflowRunner(adapter, storage);

  if (adapter.mode === "demo" && (await storage.listWorkflows()).length === 0) {
    const context = await adapter.getContext();
    const seeded = await storage.createWorkflow({
      idempotencyKey: "demo_seed_restart_01",
      mode: "demo",
      action: "restart",
      actor: "demo-operator",
      projectId: context.project.id,
      environmentId: context.environment.id,
      serviceId: context.service.id,
    });
    await storage.advanceWorkflow(seeded.id, "validated", "Demo resource context and action policy validated.", { action: "restart", simulation: true });
    await storage.advanceWorkflow(seeded.id, "dispatched", "Demo operation dispatched to the simulation adapter.", { simulation: true }, "info", { deploymentId: context.currentDeployment?.id ?? "dep_demo_seed" });
    await storage.advanceWorkflow(seeded.id, "observed", "Observed simulated deployment state: SUCCESS.", { status: "SUCCESS", simulation: true });
    await storage.advanceWorkflow(seeded.id, "settled", "Observed demo state verifies the requested outcome.", { status: "SUCCESS", simulation: true }, "info", { outcome: "success" });
  }

  app.get("/api/health", (_req, res) => res.json({ ok: true, mode: adapter.mode, time: new Date().toISOString() }));

  app.get("/api/context", async (_req, res, next) => {
    try { res.json(await adapter.getContext()); } catch (error) { next(error); }
  });

  app.get("/api/workflows", async (req, res, next) => {
    try {
      const limit = Number.parseInt(String(req.query.limit || "25"), 10);
      res.json(await storage.listWorkflows(Number.isFinite(limit) ? limit : 25));
    } catch (error) { next(error); }
  });

  app.get("/api/workflows/:id", async (req, res, next) => {
    try {
      const workflow = await storage.getWorkflow(req.params.id);
      if (!workflow) return res.status(404).json({ message: "Workflow not found." });
      res.json(workflow);
    } catch (error) { next(error); }
  });

  app.post("/api/actions", async (req: Request, res: Response, next) => {
    try {
      const parsed = actionRequestSchema.safeParse({ ...req.body, idempotencyKey: req.body?.idempotencyKey || req.header("idempotency-key") || undefined });
      if (!parsed.success) return res.status(400).json({ message: "Invalid action request.", issues: parsed.error.flatten() });
      const idempotencyKey = parsed.data.idempotencyKey || `op_${randomUUID()}`;
      const existing = await storage.getWorkflowByIdempotencyKey(idempotencyKey);
      if (existing) return res.status(200).json(existing);
      const active = (await storage.listWorkflows(100)).find((workflow) => workflow.outcome === "pending");
      if (active) return res.status(409).json({ message: "An operation is already in progress.", workflowId: active.id });
      const workflow = await storage.createWorkflow({ ...parsed.data, idempotencyKey, mode: adapter.mode, actor: "portfolio-reviewer" });
      void runWorkflow(workflow.id, { ...parsed.data, idempotencyKey });
      return res.status(202).json(workflow);
    } catch (error) { next(error); }
  });

  return httpServer;
}

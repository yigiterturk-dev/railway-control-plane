import type { WorkflowEvent, WorkflowRun, WorkflowRunWithEvents, WorkflowStage, WorkflowOutcome } from "@shared/schema";
import { randomUUID } from "node:crypto";

export interface CreateWorkflowInput {
  idempotencyKey: string;
  mode: "demo" | "live";
  action: WorkflowRun["action"];
  actor: string;
  projectId: string;
  environmentId: string;
  serviceId: string;
}

export interface IStorage {
  createWorkflow(input: CreateWorkflowInput): Promise<WorkflowRunWithEvents>;
  getWorkflow(id: string): Promise<WorkflowRunWithEvents | undefined>;
  getWorkflowByIdempotencyKey(key: string): Promise<WorkflowRunWithEvents | undefined>;
  listWorkflows(limit?: number): Promise<WorkflowRunWithEvents[]>;
  advanceWorkflow(id: string, stage: WorkflowStage, message: string, evidence?: WorkflowEvent["evidence"], severity?: WorkflowEvent["severity"], patch?: Partial<Pick<WorkflowRun, "deploymentId" | "outcome" | "errorMessage">>): Promise<WorkflowRunWithEvents>;
}

export class MemStorage implements IStorage {
  private readonly runs = new Map<string, WorkflowRun>();
  private readonly events = new Map<string, WorkflowEvent[]>();

  async createWorkflow(input: CreateWorkflowInput): Promise<WorkflowRunWithEvents> {
    const existing = await this.getWorkflowByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;
    const now = new Date();
    const run: WorkflowRun = {
      id: randomUUID(),
      ...input,
      deploymentId: null,
      stage: "requested",
      outcome: "pending",
      errorMessage: null,
      createdAt: now,
      updatedAt: now,
    };
    this.runs.set(run.id, run);
    this.events.set(run.id, [this.event(run.id, "requested", "Operation accepted and recorded.", { idempotencyKey: run.idempotencyKey })]);
    return this.withEvents(run);
  }

  async getWorkflow(id: string) {
    const run = this.runs.get(id);
    return run ? this.withEvents(run) : undefined;
  }

  async getWorkflowByIdempotencyKey(key: string) {
    const run = [...this.runs.values()].find((item) => item.idempotencyKey === key);
    return run ? this.withEvents(run) : undefined;
  }

  async listWorkflows(limit = 25) {
    return [...this.runs.values()]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, Math.min(limit, 100))
      .map((run) => this.withEvents(run));
  }

  async advanceWorkflow(id: string, stage: WorkflowStage, message: string, evidence: WorkflowEvent["evidence"] = {}, severity: WorkflowEvent["severity"] = "info", patch: Partial<Pick<WorkflowRun, "deploymentId" | "outcome" | "errorMessage">> = {}) {
    const current = this.runs.get(id);
    if (!current) throw new Error("Workflow not found");
    const next: WorkflowRun = { ...current, ...patch, stage, updatedAt: new Date() };
    this.runs.set(id, next);
    this.events.set(id, [...(this.events.get(id) ?? []), this.event(id, stage, message, evidence, severity)]);
    return this.withEvents(next);
  }

  private event(workflowId: string, stage: WorkflowStage, message: string, evidence: WorkflowEvent["evidence"], severity: WorkflowEvent["severity"] = "info"): WorkflowEvent {
    return { id: randomUUID(), workflowId, stage, severity, message, evidence, createdAt: new Date() };
  }

  private withEvents(run: WorkflowRun): WorkflowRunWithEvents {
    return { ...run, events: [...(this.events.get(run.id) ?? [])] };
  }
}

export const storage = new MemStorage();

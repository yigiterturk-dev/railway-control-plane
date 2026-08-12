import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const actionSchema = z.enum(["deploy", "restart", "stop"]);
export const workflowStageSchema = z.enum([
  "requested",
  "validated",
  "dispatched",
  "observed",
  "settled",
  "failed",
  "timed_out",
]);
export const outcomeSchema = z.enum(["pending", "success", "failure"]);
export const severitySchema = z.enum(["info", "warning", "error"]);
export const deploymentStatusSchema = z.enum([
  "BUILDING",
  "DEPLOYING",
  "SUCCESS",
  "FAILED",
  "CRASHED",
  "REMOVED",
  "SLEEPING",
  "SKIPPED",
  "WAITING",
  "QUEUED",
  "UNKNOWN",
]);

export const workflowStageEnum = pgEnum("workflow_stage", workflowStageSchema.options);
export const workflowOutcomeEnum = pgEnum("workflow_outcome", outcomeSchema.options);
export const workflowActionEnum = pgEnum("workflow_action", actionSchema.options);
export const eventSeverityEnum = pgEnum("event_severity", severitySchema.options);

export const workflowRuns = pgTable("workflow_runs", {
  id: uuid("id").primaryKey(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  mode: text("mode").notNull(),
  action: workflowActionEnum("action").notNull(),
  actor: text("actor").notNull(),
  projectId: text("project_id").notNull(),
  environmentId: text("environment_id").notNull(),
  serviceId: text("service_id").notNull(),
  deploymentId: text("deployment_id"),
  stage: workflowStageEnum("stage").notNull(),
  outcome: workflowOutcomeEnum("outcome").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
}, (table) => [index("workflow_runs_updated_at_idx").on(table.updatedAt)]);

export const workflowEvents = pgTable("workflow_events", {
  id: uuid("id").primaryKey(),
  workflowId: uuid("workflow_id").notNull(),
  stage: workflowStageEnum("stage").notNull(),
  severity: eventSeverityEnum("severity").notNull(),
  message: text("message").notNull(),
  evidence: jsonb("evidence").$type<Record<string, string | number | boolean | null>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
}, (table) => [index("workflow_events_workflow_idx").on(table.workflowId)]);

export const insertWorkflowRunSchema = createInsertSchema(workflowRuns);
export const insertWorkflowEventSchema = createInsertSchema(workflowEvents);

export const actionRequestSchema = z.object({
  action: actionSchema,
  projectId: z.string().min(1).max(128),
  environmentId: z.string().min(1).max(128),
  serviceId: z.string().min(1).max(128),
  idempotencyKey: z.string().min(8).max(128).regex(/^[a-zA-Z0-9:_-]+$/).optional(),
}).strict();

export const resourceContextSchema = z.object({
  mode: z.enum(["demo", "live"]),
  project: z.object({ id: z.string(), name: z.string() }),
  environment: z.object({ id: z.string(), name: z.string() }),
  service: z.object({ id: z.string(), name: z.string() }),
  currentDeployment: z.object({
    id: z.string(),
    status: deploymentStatusSchema,
    createdAt: z.string(),
    meta: z.record(z.unknown()).optional(),
  }).nullable(),
  observedAt: z.string(),
  source: z.enum(["simulation", "railway-api"]),
});

export type WorkflowAction = z.infer<typeof actionSchema>;
export type WorkflowStage = z.infer<typeof workflowStageSchema>;
export type WorkflowOutcome = z.infer<typeof outcomeSchema>;
export type DeploymentStatus = z.infer<typeof deploymentStatusSchema>;
export type ActionRequest = z.infer<typeof actionRequestSchema>;
export type ResourceContext = z.infer<typeof resourceContextSchema>;
export type WorkflowRun = typeof workflowRuns.$inferSelect;
export type WorkflowEvent = typeof workflowEvents.$inferSelect;
export type WorkflowRunWithEvents = WorkflowRun & { events: WorkflowEvent[] };

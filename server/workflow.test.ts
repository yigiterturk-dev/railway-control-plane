import { describe, expect, it } from "vitest";
import { DemoControlPlane } from "./control-plane";
import { createWorkflowRunner } from "./routes";
import { MemStorage } from "./storage";

describe("verified lifecycle workflow", () => {
  it("moves a demo restart through evidence-backed settlement", async () => {
    const adapter = new DemoControlPlane();
    const store = new MemStorage();
    const context = await adapter.getContext();
    const input = { action: "restart" as const, projectId: context.project.id, environmentId: context.environment.id, serviceId: context.service.id, idempotencyKey: "test_restart_01" };
    const workflow = await store.createWorkflow({ ...input, mode: "demo", actor: "test" });

    await createWorkflowRunner(adapter, store)(workflow.id, input);

    const result = await store.getWorkflow(workflow.id);
    expect(result?.stage).toBe("settled");
    expect(result?.outcome).toBe("success");
    expect(result?.events.map((event) => event.stage)).toEqual(["requested", "validated", "dispatched", "observed", "settled"]);
  });

  it("returns the original workflow for a repeated idempotency key", async () => {
    const store = new MemStorage();
    const input = { idempotencyKey: "duplicate_key_01", mode: "demo" as const, action: "deploy" as const, actor: "test", projectId: "p", environmentId: "e", serviceId: "s" };
    const first = await store.createWorkflow(input);
    const second = await store.createWorkflow(input);
    expect(second.id).toBe(first.id);
    expect((await store.listWorkflows()).length).toBe(1);
  });

  it("fails closed when the requested resource does not match server context", async () => {
    const adapter = new DemoControlPlane();
    const store = new MemStorage();
    const input = { action: "stop" as const, projectId: "wrong", environmentId: "wrong", serviceId: "wrong", idempotencyKey: "wrong_target_01" };
    const workflow = await store.createWorkflow({ ...input, mode: "demo", actor: "test" });
    await createWorkflowRunner(adapter, store)(workflow.id, input);
    const result = await store.getWorkflow(workflow.id);
    expect(result?.stage).toBe("failed");
    expect(result?.errorMessage).toContain("server-approved target");
  });
});

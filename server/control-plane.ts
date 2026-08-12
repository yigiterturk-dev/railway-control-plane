import { randomUUID } from "node:crypto";
import { deploymentStatusSchema, type ActionRequest, type DeploymentStatus, type ResourceContext, type WorkflowAction } from "@shared/schema";

export interface DispatchResult { deploymentId: string; acceptedAt: string }
export interface ObserveResult { status: DeploymentStatus; observedAt: string }

export interface ControlPlaneAdapter {
  readonly mode: "demo" | "live";
  getContext(): Promise<ResourceContext>;
  dispatch(input: ActionRequest): Promise<DispatchResult>;
  observe(deploymentId: string): Promise<ObserveResult>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class DemoControlPlane implements ControlPlaneAdapter {
  readonly mode = "demo" as const;
  private deployment = { id: "dep_demo_7F3A", status: "SUCCESS" as DeploymentStatus, createdAt: new Date(Date.now() - 18 * 60_000).toISOString() };
  private finalStatus: DeploymentStatus = "SUCCESS";

  async getContext(): Promise<ResourceContext> {
    return {
      mode: this.mode,
      project: { id: "prj_demo_control", name: "control-plane-demo" },
      environment: { id: "env_demo_production", name: "production" },
      service: { id: "svc_demo_api", name: "checkout-api" },
      currentDeployment: { ...this.deployment, meta: { region: "us-west1", runtime: "node 20" } },
      observedAt: new Date().toISOString(),
      source: "simulation",
    };
  }

  async dispatch(input: ActionRequest): Promise<DispatchResult> {
    await delay(260);
    const deploymentId = input.action === "deploy" ? `dep_demo_${randomUUID().slice(0, 8)}` : this.deployment.id;
    this.deployment = { id: deploymentId, status: input.action === "stop" ? "REMOVED" : "DEPLOYING", createdAt: new Date().toISOString() };
    this.finalStatus = input.action === "stop" ? "REMOVED" : "SUCCESS";
    return { deploymentId, acceptedAt: new Date().toISOString() };
  }

  async observe(deploymentId: string): Promise<ObserveResult> {
    await delay(520);
    this.deployment = { ...this.deployment, id: deploymentId, status: this.finalStatus };
    return { status: this.finalStatus, observedAt: new Date().toISOString() };
  }
}

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export class RailwayControlPlane implements ControlPlaneAdapter {
  readonly mode = "live" as const;
  private readonly endpoint = "https://backboard.railway.com/graphql/v2";

  constructor(private readonly env: NodeJS.ProcessEnv) {}

  async getContext(): Promise<ResourceContext> {
    const ids = this.ids();
    const data = await this.graphql<{ deployments: { edges: Array<{ node: { id: string; status: string; createdAt: string; meta?: Record<string, unknown> } }> } }>(`
      query CurrentDeployment($input: DeploymentListInput!) {
        deployments(input: $input, first: 1) { edges { node { id status createdAt meta } } }
      }
    `, { input: ids });
    const node = data.deployments.edges[0]?.node;
    return {
      mode: "live",
      project: { id: ids.projectId, name: this.env.RAILWAY_PROJECT_NAME || "Railway project" },
      environment: { id: ids.environmentId, name: this.env.RAILWAY_ENVIRONMENT_NAME || "environment" },
      service: { id: ids.serviceId, name: this.env.RAILWAY_SERVICE_NAME || "service" },
      currentDeployment: node ? { ...node, status: deploymentStatusSchema.catch("UNKNOWN").parse(node.status) } : null,
      observedAt: new Date().toISOString(),
      source: "railway-api",
    };
  }

  async dispatch(input: ActionRequest): Promise<DispatchResult> {
    const current = await this.getContext();
    if (input.action === "deploy") {
      const data = await this.graphql<{ serviceInstanceDeployV2: string }>(`
        mutation Deploy($environmentId: String!, $serviceId: String!) {
          serviceInstanceDeployV2(environmentId: $environmentId, serviceId: $serviceId)
        }
      `, { environmentId: input.environmentId, serviceId: input.serviceId });
      return { deploymentId: data.serviceInstanceDeployV2, acceptedAt: new Date().toISOString() };
    }
    if (!current.currentDeployment) throw new Error("No current deployment is available for this operation.");
    const field = input.action === "restart" ? "deploymentRestart" : "deploymentStop";
    await this.graphql<Record<string, boolean>>(`mutation Lifecycle($id: String!) { ${field}(id: $id) }`, { id: current.currentDeployment.id });
    return { deploymentId: current.currentDeployment.id, acceptedAt: new Date().toISOString() };
  }

  async observe(deploymentId: string): Promise<ObserveResult> {
    const data = await this.graphql<{ deployment: { status: string } }>(`
      query Deployment($id: String!) { deployment(id: $id) { status } }
    `, { id: deploymentId });
    return { status: deploymentStatusSchema.catch("UNKNOWN").parse(data.deployment.status), observedAt: new Date().toISOString() };
  }

  private ids() {
    const projectId = this.required("RAILWAY_PROJECT_ID");
    const environmentId = this.required("RAILWAY_ENVIRONMENT_ID");
    const serviceId = this.required("RAILWAY_SERVICE_ID");
    return { projectId, environmentId, serviceId };
  }

  private required(name: string) {
    const value = this.env[name];
    if (!value) throw new Error(`Missing server configuration: ${name}`);
    return value;
  }

  private async graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const token = this.required("RAILWAY_API_TOKEN");
    const header = this.env.RAILWAY_TOKEN_TYPE === "project" ? "Project-Access-Token" : "Authorization";
    const value = header === "Authorization" ? `Bearer ${token}` : token;
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", [header]: value },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Railway API request failed (${response.status}).`);
    const payload = await response.json() as GraphQLResponse<T>;
    if (payload.errors?.length || !payload.data) throw new Error(payload.errors?.[0]?.message || "Railway API returned no data.");
    return payload.data;
  }
}

export function createControlPlane(env: NodeJS.ProcessEnv = process.env): ControlPlaneAdapter {
  return env.CONTROL_PLANE_MODE === "live" ? new RailwayControlPlane(env) : new DemoControlPlane();
}

export function expectedOutcome(action: WorkflowAction): DeploymentStatus[] {
  return action === "stop" ? ["REMOVED", "SLEEPING"] : ["SUCCESS"];
}

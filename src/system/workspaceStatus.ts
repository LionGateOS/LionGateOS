export type WorkspaceStatus =
  | "idle"
  | "active"
  | "attention"
  | "error";

type StatusMap = Record<string, WorkspaceStatus>;

const statusMap: StatusMap = {};

export function setWorkspaceStatus(
  workspaceKey: string,
  status: WorkspaceStatus
) {
  statusMap[workspaceKey] = status;
}

export function getWorkspaceStatus(
  workspaceKey: string
): WorkspaceStatus {
  return statusMap[workspaceKey] ?? "idle";
}

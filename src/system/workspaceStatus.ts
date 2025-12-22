export type WorkspaceId = "smartquote" | "travels";

let activeWorkspace: WorkspaceId | null = null;

export function setActiveWorkspace(id: WorkspaceId | null) {
  activeWorkspace = id;
}

export function getActiveWorkspace(): WorkspaceId | null {
  return activeWorkspace;
}
export interface UserProfile {
  id: number;
  username: string;
  displayName?: string;
  roleCode: string;
  workspaceCodes: string[];
}

export interface UserItem {
  id: number;
  username: string;
  email: string;
  displayName: string;
  roleCode: string;
  status: number;
  workspaceCodes: string[];
  workspaceNames: string[];
}

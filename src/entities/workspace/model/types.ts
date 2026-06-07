export interface Workspace {
  code: string;
  name: string;
  description?: string;
  allScope: boolean;
  workspaceType: string;
  ownerUserId?: number;
  ownerName?: string;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

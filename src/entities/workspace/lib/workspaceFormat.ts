import type { Workspace } from '../model/types';
import { t } from '@shared/i18n';

export function formatWorkspaceName(workspace?: Workspace) {
  return workspace?.name || t.workspace.unselected;
}

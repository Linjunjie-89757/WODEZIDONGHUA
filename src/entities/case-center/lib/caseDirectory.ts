import type { CaseDirectoryNode, CaseDirectoryWorkspace } from '../model/types';

export function countCaseDirectories(workspaces: CaseDirectoryWorkspace[]) {
  let total = 0;
  const stack: CaseDirectoryNode[] = workspaces.flatMap((workspace) => workspace.children);

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) {
      continue;
    }

    total += 1;
    stack.push(...current.children);
  }

  return total;
}

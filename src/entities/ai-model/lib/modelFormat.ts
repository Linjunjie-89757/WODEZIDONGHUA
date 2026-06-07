import type { AiConnection } from '../model/types';
import { t } from '@shared/i18n';

export function getAiConnectionStatusLabel(status: AiConnection['status']) {
  const labels: Record<AiConnection['status'], string> = {
    ready: t.aiConnection.statusReady,
    disabled: t.aiConnection.statusDisabled,
    error: t.aiConnection.statusError
  };

  return labels[status];
}

import { feedback } from '@shared/lib/feedback';
import { t } from '@shared/i18n';

export function appConfirm(
  content: string,
  title = t.common.confirmAction,
  onOk?: () => void | Promise<void>
) {
  return feedback.confirm(content, title, onOk);
}

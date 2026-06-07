import { Message, Modal } from '@arco-design/web-vue';

import { t } from '@shared/i18n';

export const feedback = {
  success(content: string) {
    Message.success(content);
  },
  error(content: string) {
    Message.error(content);
  },
  warning(content: string) {
    Message.warning(content);
  },
  confirm(content: string, title = t.common.confirmAction, onOk?: () => void | Promise<void>) {
    return Modal.confirm({
      title,
      content,
      onOk
    });
  }
};

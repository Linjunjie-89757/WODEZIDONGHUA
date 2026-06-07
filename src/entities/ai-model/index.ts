export { aiModelApi } from './api/aiModelApi';
export {
  aiProtocolOptions,
  createAiConnectionEditForm,
  createDefaultAiConnectionForm,
  toSaveAiConnectionPayload
} from './lib/connectionPayload';
export { aiProviderMeta, aiProviderOptions, normalizeAiProvider } from './lib/providerMeta';
export { getAiConnectionStatusLabel } from './lib/modelFormat';
export { default as ModelSelect } from './ui/ModelSelect.vue';
export { default as ProviderBadge } from './ui/ProviderBadge.vue';
export type {
  AiConnection,
  AiConnectionFormValues,
  AiProvider,
  AiProviderConnectionResponse,
  AiProviderMeta,
  AiProtocolType,
  SaveAiProviderConnectionPayload
} from './model/types';

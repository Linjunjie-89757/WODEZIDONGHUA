import type { AiProvider, AiProviderMeta } from '../model/types';

export const aiProviderMeta: Record<AiProvider, AiProviderMeta> = {
  openai: {
    label: 'OpenAI',
    value: 'openai',
    color: 'green'
  },
  'azure-openai': {
    label: 'Azure OpenAI',
    value: 'azure-openai',
    color: 'blue'
  },
  ollama: {
    label: 'Ollama',
    value: 'ollama',
    color: 'orange'
  },
  custom: {
    label: 'Custom',
    value: 'custom',
    color: 'purple'
  }
};

export const aiProviderOptions = Object.values(aiProviderMeta);

export function normalizeAiProvider(protocolType?: string): AiProvider {
  const normalized = protocolType?.toLowerCase();

  if (
    normalized === 'openai' ||
    normalized === 'openai_compatible_chat' ||
    normalized === 'openai_compatible_responses'
  ) {
    return 'openai';
  }

  if (normalized === 'azure-openai' || normalized === 'azure_openai' || normalized === 'azure') {
    return 'azure-openai';
  }

  if (normalized === 'ollama') {
    return 'ollama';
  }

  return 'custom';
}

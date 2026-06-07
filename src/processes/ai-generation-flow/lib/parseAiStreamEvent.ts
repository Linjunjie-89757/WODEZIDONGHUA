import type { AiGenerationEvent } from '../model/aiGenerationEvents';

export function parseAiStreamEvent(raw: string): AiGenerationEvent {
  try {
    return JSON.parse(raw) as AiGenerationEvent;
  } catch {
    return {
      type: 'chunk',
      payload: raw
    };
  }
}

export type AiGenerationEventType = 'start' | 'chunk' | 'finish' | 'error';

export interface AiGenerationEvent {
  type: AiGenerationEventType;
  payload?: unknown;
}

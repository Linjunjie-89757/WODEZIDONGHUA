# Case Center AI Contract Notes

## Scope

This document records the R2 contract audit for Case Center AI pages:

- AI 用例生成
- AI 生成记录
- AI 配置

## Confirmed References

Visual mother source:

- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\TestCasePage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\AiHistoryPage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\AiConfigPage.tsx`

Old project reference:

- `D:\CodeProject\AutoTestHub\reference\old-auto\api.ts`
- `D:\CodeProject\AutoTestHub\reference\old-auto\knowledge-graph.json`

## Confirmed Data Shapes

`reference/old-auto/api.ts` confirms these Case AI task structures:

- `AiGenerationOutputMode`: `STREAM | COMPLETE`
- `AiGenerationTaskStatus`: `PENDING | GENERATING | REVIEWING | COMPLETED | FAILED | CANCELED`
- `AiGenerationTask`
- `AiGenerationTaskEvent`
- `CreateAiGenerationTaskPayload`
- `UpdateAiGenerationTaskPayload`
- `AiGeneratedCase`
- `AiGenerateResponse`
- `ReviewAiGeneratedCasesPayload`

The knowledge graph also references old files:

- `web/src/views/CaseAiGenerateView.vue`
- `web/src/views/CaseAiRecordsView.vue`
- `web/src/views/CaseAiRecordDetailView.vue`
- `web/src/views/CaseAiConfigView.vue`
- backend AI generation task service/entity/mapper files

## Confirmed New Frontend Contracts

The new frontend currently has confirmed AI connection pool endpoints only:

- `GET /cases/ai/providers`
- `POST /cases/ai/providers`
- `PUT /cases/ai/providers/{id}`
- `DELETE /cases/ai/providers/{id}`
- `POST /cases/ai/providers/{id}/test`
- provider model and secret endpoints under `endpoints.aiModel`

R2 AI 配置 reuses `entities/ai-model` and reads the existing AI connection pool for model selection.

## Not Yet Connected

The new frontend does not yet define confirmed endpoints for:

- creating a Case Center AI generation task;
- listing Case Center AI generation records;
- reading a generation task detail;
- adopting generated cases;
- deleting/retrying/canceling generation records;
- persisting Case AI generator/reviewer role config.

Because the controller path was not fully available in the copied reference, R2 does not guess endpoint paths and does not send fake generation requests.

## R2 Decision

R2 restores the visual shell for AI 用例生成、AI 生成记录、AI 配置.

It intentionally keeps AI generation/history as contract-limited shells until the controller contract is read or copied. AI 配置 reads real AI connection pool data but does not persist role settings because the Case AI config endpoint is not confirmed in the new frontend contract.

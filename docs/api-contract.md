# API Contract

New frontend endpoints must be mapped from verified old frontend calls and backend controllers. Do not add or rename endpoint paths by guessing.

## Contract Format

| Area | Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Auth | Login | `POST` | `/api/...` | `LoginPayload` | `LoginResult` | `endpoints.auth.login` | `features/auth-login` | Old frontend + backend controller |

## Migration Areas

### Auth

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Login | `POST` | `/api/auth/login` | `LoginRequest { username, password }` | `ApiResponse<CurrentUserResponse>` | `endpoints.auth.login` | `features/auth-login` | `web/src/api/platform.ts`, `AuthController.java` |
| Current user | `GET` | `/api/auth/me` | none | `ApiResponse<CurrentUserResponse>` | `endpoints.auth.me` | `entities/user` | `web/src/api/platform.ts`, `AuthController.java` |
| Logout | `POST` | `/api/auth/logout` | none | `ApiResponse<Void>` | `endpoints.auth.logout` | `features/auth-logout` | `web/src/api/platform.ts`, `AuthController.java` |

### Workspace

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| List workspaces | `GET` | `/api/workspaces` | none | `ApiResponse<List<WorkspaceItem>>` | `endpoints.workspace.list` | `entities/workspace` | `web/src/api/platform.ts`, `WorkspaceController.java` |
| List switchable workspaces | `GET` | `/api/workspaces/switchable` | none | `ApiResponse<List<WorkspaceItem>>` | `endpoints.workspace.switchable` | `features/workspace-switch` | `web/src/api/platform.ts`, `WorkspaceController.java` |
| Create workspace | `POST` | `/api/workspaces` | `CreateWorkspaceRequest` | `ApiResponse<WorkspaceItem>` | `endpoints.workspace.list` | `entities/workspace` | `web/src/api/platform.ts`, `WorkspaceController.java` |
| Update workspace | `PUT` | `/api/workspaces/{workspaceCode}` | `CreateWorkspaceRequest` | `ApiResponse<WorkspaceItem>` | `endpoints.workspace.detail(workspaceCode)` | `entities/workspace` | `web/src/api/platform.ts`, `WorkspaceController.java` |
| Delete workspace | `DELETE` | `/api/workspaces/{workspaceCode}` | none | `ApiResponse<Void>` | `endpoints.workspace.detail(workspaceCode)` | `entities/workspace` | `web/src/api/platform.ts`, `WorkspaceController.java` |
| List members | `GET` | `/api/workspaces/{workspaceCode}/members` | none | `ApiResponse<List<WorkspaceMemberItem>>` | `endpoints.workspace.members(workspaceCode)` | `entities/workspace` | `web/src/api/platform.ts`, `WorkspaceController.java` |

### AI Connections

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| List connections | `GET` | `/api/cases/ai/providers` | header `X-Workspace-Code` | `ApiResponse<List<AiProviderConnectionItem>>` | `endpoints.aiModel.connections` | `entities/ai-model` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Create connection | `POST` | `/api/cases/ai/providers` | `SaveAiProviderConnectionRequest` | `ApiResponse<AiProviderConnectionItem>` | `endpoints.aiModel.createConnection` | `features/ai-connection-create` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Preview provider models | `POST` | `/api/cases/ai/providers/preview-models` | `PreviewAiProviderModelsRequest` | `ApiResponse<PreviewAiProviderModelsResponse>` | `endpoints.aiModel.previewModels` | `features/ai-connection-create` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Update connection | `PUT` | `/api/cases/ai/providers/{id}` | `SaveAiProviderConnectionRequest` | `ApiResponse<AiProviderConnectionItem>` | `endpoints.aiModel.updateConnection(id)` | `features/ai-connection-edit` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Delete connection | `DELETE` | `/api/cases/ai/providers/{id}` | none | `ApiResponse<Void>` | `endpoints.aiModel.deleteConnection(id)` | `features/ai-connection-edit` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Test connection | `POST` | `/api/cases/ai/providers/{id}/test` | header `X-Workspace-Code` | `ApiResponse<TestAiProviderConnectionResponse>` | `endpoints.aiModel.testConnection(id)` | `features/ai-connection-test` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Fetch models | `POST` | `/api/cases/ai/providers/{id}/fetch-models` | header `X-Workspace-Code` | `ApiResponse<FetchAiProviderModelsResponse>` | `endpoints.aiModel.fetchModels(id)` | `entities/ai-model` | `web/src/api/platform.ts`, `AiCaseController.java` |
| List provider models | `GET` | `/api/cases/ai/providers/{id}/models` | header `X-Workspace-Code` | `ApiResponse<List<AiProviderModelItem>>` | `endpoints.aiModel.models(id)` | `entities/ai-model` | `web/src/api/platform.ts`, `AiCaseController.java` |
| Get connection secret | `GET` | `/api/cases/ai/providers/{id}/secret` | header `X-Workspace-Code` | `ApiResponse<AiProviderConnectionSecretResponse>` | `endpoints.aiModel.secret(id)` | `features/ai-connection-edit` | `web/src/api/platform.ts`, `AiCaseController.java` |

### Config Center

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| List environments | `GET` | `/api/settings/envs` | header `X-Workspace-Code` | `ApiResponse<PageResponse<EnvConfigItem>>` | `endpoints.configCenter.envs` | `entities/config-center` | `web/src/api/platform.ts`, `SettingsController.java` |
| Create environment | `POST` | `/api/settings/envs` | `CreateEnvConfigRequest { workspaceCode?, envType, envName, baseUrl, configJson? }` | `ApiResponse<EnvConfigItem>` | `endpoints.configCenter.createEnv` | `features/config-env-create` | `web/src/api/platform.ts`, `SettingsController.java` |
| Update environment | `PUT` | `/api/settings/envs/{id}` | `CreateEnvConfigRequest { workspaceCode?, envType, envName, baseUrl, configJson? }` | `ApiResponse<EnvConfigItem>` | `endpoints.configCenter.updateEnv(id)` | `features/config-env-edit` | `web/src/api/platform.ts`, `SettingsController.java` |
| Update environment status | `PUT` | `/api/settings/envs/{id}/status` | `UpdateSettingStatusRequest { status }` | `ApiResponse<EnvConfigItem>` | `endpoints.configCenter.updateEnvStatus(id)` | `features/config-env-toggle` | `web/src/api/platform.ts`, `SettingsController.java` |
| Delete environment | `DELETE` | `/api/settings/envs/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.configCenter.deleteEnv(id)` | `features/config-env-delete` | `web/src/api/platform.ts`, `SettingsController.java` |
| List parameter sets | `GET` | `/api/settings/params` | header `X-Workspace-Code` | `ApiResponse<PageResponse<ParamSetItem>>` | `endpoints.configCenter.params` | `entities/config-center` | `web/src/api/platform.ts`, `SettingsController.java` |
| Create parameter set | `POST` | `/api/settings/params` | `CreateParamSetRequest { workspaceCode?, paramType, paramName, contentJson? }` | `ApiResponse<ParamSetItem>` | `endpoints.configCenter.createParam` | `features/config-param-create` | `web/src/api/platform.ts`, `SettingsController.java` |
| Update parameter set | `PUT` | `/api/settings/params/{id}` | `CreateParamSetRequest { workspaceCode?, paramType, paramName, contentJson? }` | `ApiResponse<ParamSetItem>` | `endpoints.configCenter.updateParam(id)` | `features/config-param-edit` | `web/src/api/platform.ts`, `SettingsController.java` |
| Update parameter set status | `PUT` | `/api/settings/params/{id}/status` | `UpdateSettingStatusRequest { status }` | `ApiResponse<ParamSetItem>` | `endpoints.configCenter.updateParamStatus(id)` | `features/config-param-toggle` | `web/src/api/platform.ts`, `SettingsController.java` |
| Delete parameter set | `DELETE` | `/api/settings/params/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.configCenter.deleteParam(id)` | `features/config-param-delete` | `web/src/api/platform.ts`, `SettingsController.java` |
| List database connections | `GET` | `/api/settings/db-connections` | header `X-Workspace-Code` | `ApiResponse<PageResponse<DbConnectionItem>>` | `endpoints.configCenter.dbConnections` | `entities/config-center` | `web/src/api/platform.ts`, `SettingsController.java` |
| Create database connection | `POST` | `/api/settings/db-connections` | `DbConnectionRequest { workspaceCode?, connectionName, dbType, driverClassName?, jdbcUrl, username?, password?, poolMax?, timeoutMs?, description?, status? }` | `ApiResponse<DbConnectionItem>` | `endpoints.configCenter.createDbConnection` | `features/config-db-create` | `web/src/api/platform.ts`, `SettingsController.java` |
| Update database connection | `PUT` | `/api/settings/db-connections/{id}` | `DbConnectionRequest { workspaceCode?, connectionName, dbType, driverClassName?, jdbcUrl, username?, password?, poolMax?, timeoutMs?, description?, status? }` | `ApiResponse<DbConnectionItem>` | `endpoints.configCenter.updateDbConnection(id)` | `features/config-db-edit` | `web/src/api/platform.ts`, `SettingsController.java` |
| Update database connection status | `PUT` | `/api/settings/db-connections/{id}/status` | `UpdateSettingStatusRequest { status }` | `ApiResponse<DbConnectionItem>` | `endpoints.configCenter.updateDbConnectionStatus(id)` | `features/config-db-toggle` | `web/src/api/platform.ts`, `SettingsController.java` |
| Delete database connection | `DELETE` | `/api/settings/db-connections/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.configCenter.deleteDbConnection(id)` | `features/config-db-delete` | `web/src/api/platform.ts`, `SettingsController.java` |
| Test database connection | `POST` | `/api/settings/db-connections/test` | `DbConnectionTestRequest { id?, workspaceCode?, connectionName?, dbType?, driverClassName?, jdbcUrl?, username?, password?, timeoutMs? }` | `ApiResponse<DbConnectionTestResult { success, message }>` | `endpoints.configCenter.testDbConnection` | `features/config-db-test` | `web/src/api/platform.ts`, `SettingsController.java` |

### Case Center

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| List cases | `GET` | `/api/cases?pageNo={pageNo}&pageSize={pageSize}&directoryId={directoryId}` | header `X-Workspace-Code`, optional query `{ pageNo?, pageSize?, directoryId? }` | `ApiResponse<PageResponse<CaseSummaryResponse>>` | `endpoints.caseCenter.cases` | `entities/case-center` | `web/src/api/platform.ts`, `CaseController.java` |
| List case directories | `GET` | `/api/cases/directories` | header `X-Workspace-Code` | `ApiResponse<List<CaseDirectoryWorkspaceResponse>>` | `endpoints.caseCenter.directories` | `entities/case-center` | `web/src/api/platform.ts`, `CaseController.java` |
| Get case detail | `GET` | `/api/cases/{id}` | header `X-Workspace-Code` | `ApiResponse<CaseDetailResponse>` | `endpoints.caseCenter.detail(id)` | `entities/case-center` | `web/src/api/platform.ts`, `CaseController.java` |
| Create case | `POST` | `/api/cases` | `CreateCaseRequest { workspaceCode?, directoryId?, title, caseType, priority, sourceType, caseStatus, ownerId?, precondition?, steps?, expectedResult? }` | `ApiResponse<CaseSummaryResponse>` | `endpoints.caseCenter.createCase` | `features/case-create` | `web/src/api/platform.ts`, `CreateCaseRequest.java`, `CaseController.java` |
| Update case | `PUT` | `/api/cases/{id}` | `CreateCaseRequest { workspaceCode?, directoryId?, title, caseType, priority, sourceType, caseStatus, ownerId?, precondition?, steps?, expectedResult? }` | `ApiResponse<CaseSummaryResponse>` | `endpoints.caseCenter.updateCase(id)` | `features/case-edit` | `web/src/api/platform.ts`, `CreateCaseRequest.java`, `CaseController.java` |
| Delete case | `DELETE` | `/api/cases/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.caseCenter.deleteCase(id)` | `features/case-delete` | `web/src/api/platform.ts`, `CaseController.java` |
| Create case directory | `POST` | `/api/cases/directories` | `CreateCaseDirectoryRequest { workspaceCode?, parentId?, name }` | `ApiResponse<CaseDirectoryNodeResponse>` | `endpoints.caseCenter.createDirectory` | `features/case-directory-create` | `web/src/api/platform.ts`, `CreateCaseDirectoryRequest.java`, `CaseController.java` |
| Rename case directory | `PUT` | `/api/cases/directories/{id}` | `RenameCaseDirectoryRequest { name }` | `ApiResponse<CaseDirectoryNodeResponse>` | `endpoints.caseCenter.renameDirectory(id)` | `features/case-directory-rename` | `web/src/api/platform.ts`, `RenameCaseDirectoryRequest.java`, `CaseController.java` |
| Move case directory | `POST` | `/api/cases/directories/{id}/move` | `MoveCaseDirectoryRequest { targetParentId? }` | `ApiResponse<CaseDirectoryNodeResponse>` | `endpoints.caseCenter.moveDirectory(id)` | `features/case-directory-move` | `web/src/api/platform.ts`, `MoveCaseDirectoryRequest.java`, `CaseController.java` |
| Delete case directory | `DELETE` | `/api/cases/directories/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.caseCenter.deleteDirectory(id)` | `features/case-directory-delete` | `web/src/api/platform.ts`, `CaseController.java` |
| Review case | `POST` | `/api/cases/{id}/review` | `ReviewCaseRequest { reviewStatus, reviewComment? }` | `ApiResponse<CaseDetailResponse>` | `endpoints.caseCenter.reviewCase(id)` | `features/case-review` | `web/src/api/platform.ts`, `ReviewCaseRequest.java`, `CaseController.java` |
| AI review case | `POST` | `/api/cases/{id}/ai-review` | header `X-Workspace-Code` | `ApiResponse<AiReviewResult>` | `endpoints.caseCenter.aiReviewCase(id)` | `features/case-ai-review` | `web/src/api/platform.ts`, `CaseController.java`, `AiCaseService.java` |
| Execute case | `POST` | `/api/cases/{id}/execute` | `ExecuteCaseRequest { executionStatus, executionComment?, executionNote? }` | `ApiResponse<CaseDetailResponse>` | `endpoints.caseCenter.executeCase(id)` | `features/case-execute` | `web/src/api/platform.ts`, `ExecuteCaseRequest.java`, `CaseController.java` |
| Upload execution attachments | `POST` | `/api/cases/{id}/attachments` | `multipart/form-data` field `files`, header `X-Workspace-Code` | `ApiResponse<List<CaseExecutionAttachmentResponse>>` | `endpoints.caseCenter.attachments(id)` | `features/case-attachment-upload` | `web/src/api/platform.ts`, `CaseController.java` |
| Delete execution attachment | `DELETE` | `/api/cases/{id}/attachments/{attachmentId}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.caseCenter.deleteAttachment(id, attachmentId)` | `features/case-attachment-delete` | `web/src/api/platform.ts`, `CaseController.java` |
| Download execution attachment | `GET` | `/api/cases/{id}/attachments/{attachmentId}/download` | header `X-Workspace-Code` | binary `Resource` response | `endpoints.caseCenter.downloadAttachment(id, attachmentId)` | `features/case-attachment-download` | `web/src/api/platform.ts`, `CaseController.java` |
| Batch move cases | `POST` | `/api/cases/batch/move` | `BatchMoveCasesRequest { caseIds, targetDirectoryId? }` | `ApiResponse<PageResponse<CaseSummaryResponse>>` | `endpoints.caseCenter.batchMove` | `features/case-batch-move` | `web/src/api/platform.ts`, `BatchMoveCasesRequest.java`, `CaseController.java` |
| Batch update cases | `POST` | `/api/cases/batch/update` | `BatchUpdateCasesRequest { caseIds, priority?, reviewStatus?, executionStatus? }` | `ApiResponse<PageResponse<CaseSummaryResponse>>` | `endpoints.caseCenter.batchUpdate` | `features/case-batch-update` | `web/src/api/platform.ts`, `BatchUpdateCasesRequest.java`, `CaseController.java` |
| Batch delete cases | `POST` | `/api/cases/batch/delete` | `BatchDeleteCasesRequest { caseIds }` | `ApiResponse<Void>` | `endpoints.caseCenter.batchDelete` | `features/case-batch-delete` | `web/src/api/platform.ts`, `BatchDeleteCasesRequest.java`, `CaseController.java` |

Notes:

- Old frontend `CreateCasePayload` includes `testAngle`, `generationReason`, and `requirementEvidence`, but backend `CreateCaseRequest` currently does not accept those fields. New frontend basic case CRUD should not depend on them unless backend contract changes.
- AI generation endpoints under `/api/cases/ai/*` are intentionally handled separately from this basic Case Center contract.

### Bug Management

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Get bug statistics | `GET` | `/api/bugs/statistics` | header `X-Workspace-Code` | `ApiResponse<BugStatisticsResponse { total, todo, assigned, inProgress, pendingVerify, closed, rejected }>` | `endpoints.bug.statistics` | `entities/bug` | `web/src/api/platform.ts`, `BugController.java`, `BugStatisticsResponse.java` |
| List bugs | `GET` | `/api/bugs` | header `X-Workspace-Code` | `ApiResponse<PageResponse<BugSummaryResponse>>` | `endpoints.bug.list` | `entities/bug` | `web/src/api/platform.ts`, `BugController.java`, `BugSummaryResponse.java` |
| Get bug detail | `GET` | `/api/bugs/{id}` | header `X-Workspace-Code` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.detail(id)` | `entities/bug` | `web/src/api/platform.ts`, `BugController.java`, `BugDetailResponse.java` |
| Create bug | `POST` | `/api/bugs` | `CreateBugRequest { workspaceCode?, title, description, priority, severity, assigneeId, relatedCaseId?, relatedReportId?, relatedTaskId?, tags? }` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.create` | `features/bug-create` | `web/src/api/platform.ts`, `BugController.java`, `CreateBugRequest.java` |
| Update bug | `PUT` | `/api/bugs/{id}` | `UpdateBugRequest { workspaceCode?, title, description, priority, severity, assigneeId?, relatedCaseId?, tags? }` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.update(id)` | `features/bug-edit` | `web/src/api/platform.ts`, `BugController.java`, `UpdateBugRequest.java` |
| Assign bug | `POST` | `/api/bugs/{id}/assign` | `AssignBugRequest { workspaceCode?, assigneeId }` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.assign(id)` | `features/bug-assign` | `web/src/api/platform.ts`, `BugController.java`, `AssignBugRequest.java` |
| Transition bug status | `POST` | `/api/bugs/{id}/transition` | `TransitionBugRequest { workspaceCode?, toStatus, actionComment? }` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.transition(id)` | `features/bug-transition` | `web/src/api/platform.ts`, `BugController.java`, `TransitionBugRequest.java` |
| List bug comments | `GET` | `/api/bugs/{id}/comments` | header `X-Workspace-Code` | `ApiResponse<List<BugCommentResponse>>` | `endpoints.bug.comments(id)` | `entities/bug` | `BugController.java`, `BugCommentResponse.java` |
| Add bug comment | `POST` | `/api/bugs/{id}/comments` | `CreateBugCommentRequest { workspaceCode?, content }` | `ApiResponse<BugCommentResponse>` | `endpoints.bug.addComment(id)` | `features/bug-comment-add` | `web/src/api/platform.ts`, `BugController.java`, `CreateBugCommentRequest.java` |
| Upload bug attachments | `POST` | `/api/bugs/{id}/attachments` | `multipart/form-data` field `files`, header `X-Workspace-Code` | `ApiResponse<List<BugAttachmentResponse>>` | `endpoints.bug.attachments(id)` | `features/bug-attachment-upload` | `web/src/api/platform.ts`, `BugController.java`, `BugAttachmentResponse.java` |
| Delete bug attachment | `DELETE` | `/api/bugs/{id}/attachments/{attachmentId}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.bug.deleteAttachment(id, attachmentId)` | `features/bug-attachment-delete` | `web/src/api/platform.ts`, `BugController.java` |
| Download bug attachment | `GET` | `/api/bugs/{id}/attachments/{attachmentId}/download` | header `X-Workspace-Code` | binary `Resource` response | `endpoints.bug.downloadAttachment(id, attachmentId)` | `features/bug-attachment-download` | `web/src/api/platform.ts`, `BugController.java` |
| Create bug from case | `POST` | `/api/cases/{id}/bugs` | `CreateBugRequest { workspaceCode?, title, description, priority, severity, assigneeId, relatedCaseId?, relatedReportId?, relatedTaskId?, tags? }` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.createFromCase(caseId)` | `features/bug-create-from-case` | `web/src/api/platform.ts`, `BugController.java`, `CreateBugRequest.java` |
| Create bug from report | `POST` | `/api/reports/{id}/bugs` | `CreateBugRequest { workspaceCode?, title, description, priority, severity, assigneeId, relatedCaseId?, relatedReportId?, relatedTaskId?, tags? }` | `ApiResponse<BugDetailResponse>` | `endpoints.bug.createFromReport(reportId)` | `features/bug-create-from-report` | `web/src/api/platform.ts`, `BugController.java`, `CreateBugRequest.java` |

Notes:

- Backend `BugController.java` does not expose a bug delete endpoint, and old frontend `platform.ts` does not define one. New frontend must not add `features/bug-delete` unless backend contract changes.
- `BugPriority`: `P0`, `P1`, `P2`, `P3`.
- `BugSeverity`: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`.
- `BugStatus`: `TODO`, `ASSIGNED`, `IN_PROGRESS`, `PENDING_VERIFY`, `CLOSED`, `REJECTED`.
- `BugSourceType`: `MANUAL`, `CASE`, `REPORT`.
- `BugActivityType`: `CREATED`, `ASSIGNED`, `STATUS_CHANGED`, `COMMENT_ADDED`, `ATTACHMENT_ADDED`, `ATTACHMENT_REMOVED`, `RELATION_UPDATED`.
- `BugDetailResponse` is an aggregate detail model with attachments, source context, activities, flows, and comments. The old frontend normally refreshes comments through `getBugDetail`; backend also exposes `GET /api/bugs/{id}/comments`.

### API Automation

| Operation | Method | Backend Path | Request | Response | New Endpoint Key | Used By | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| List API definitions | `GET` | `/api/automation/api/definitions` | header `X-Workspace-Code` | `ApiResponse<PageResponse<ApiDefinitionItem>>` | `endpoints.apiAutomation.definitions` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Get API definition detail | `GET` | `/api/automation/api/definitions/{id}` | header `X-Workspace-Code` | `ApiResponse<ApiDefinitionDetail>` | `endpoints.apiAutomation.definitionDetail(id)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create API definition | `POST` | `/api/automation/api/definitions` | `SaveApiDefinitionRequest` | `ApiResponse<ApiDefinitionDetail>` | `endpoints.apiAutomation.createDefinition` | `features/api-definition-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update API definition | `PUT` | `/api/automation/api/definitions/{id}` | `SaveApiDefinitionRequest` | `ApiResponse<ApiDefinitionDetail>` | `endpoints.apiAutomation.updateDefinition(id)` | `features/api-definition-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete API definition | `DELETE` | `/api/automation/api/definitions/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteDefinition(id)` | `features/api-definition-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Debug saved API definition | `POST` | `/api/automation/api/definitions/{id}/debug-run` | `ApiRunRequest { workspaceCode?, environmentId?, variableSetId? }` | `ApiResponse<ApiRunResponse>` | `endpoints.apiAutomation.debugDefinition(id)` | `features/api-request-debug` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Debug draft API definition | `POST` | `/api/automation/api/definitions/debug-run` | `ApiDebugDefinitionRequest` | `ApiResponse<ApiRunResponse>` | `endpoints.apiAutomation.debugDefinitionDraft` | `features/api-request-debug` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| List definition modules | `GET` | `/api/automation/api/definition-modules` | header `X-Workspace-Code` | `ApiResponse<List<ApiDefinitionModuleItem>>` | `endpoints.apiAutomation.definitionModules` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create definition module | `POST` | `/api/automation/api/definition-modules` | `ApiDefinitionModuleRequest { workspaceCode?, parentId?, name }` | `ApiResponse<ApiDefinitionModuleItem>` | `endpoints.apiAutomation.createDefinitionModule` | `features/api-definition-module-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update definition module | `PUT` | `/api/automation/api/definition-modules/{id}` | `ApiDefinitionModuleRequest { workspaceCode?, parentId?, name }` | `ApiResponse<ApiDefinitionModuleItem>` | `endpoints.apiAutomation.updateDefinitionModule(id)` | `features/api-definition-module-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Move definition module | `PUT` | `/api/automation/api/definition-modules/{id}/move` | `MoveApiDefinitionModuleRequest { parentId?, sortOrder? }` | `ApiResponse<ApiDefinitionModuleItem>` | `endpoints.apiAutomation.moveDefinitionModule(id)` | `features/api-definition-module-move` | `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete definition module | `DELETE` | `/api/automation/api/definition-modules/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteDefinitionModule(id)` | `features/api-definition-module-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| List API cases | `GET` | `/api/automation/api/cases?definitionId=&keyword=` | header `X-Workspace-Code`, optional `definitionId`, `keyword` | `ApiResponse<PageResponse<ApiDefinitionCaseItem>>` | `endpoints.apiAutomation.cases` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Get API case detail | `GET` | `/api/automation/api/cases/{id}` | header `X-Workspace-Code` | `ApiResponse<ApiDefinitionCaseDetail>` | `endpoints.apiAutomation.caseDetail(id)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create API case | `POST` | `/api/automation/api/cases` | `SaveApiDefinitionCaseRequest` | `ApiResponse<ApiDefinitionCaseDetail>` | `endpoints.apiAutomation.createCase` | `features/api-case-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update API case | `PUT` | `/api/automation/api/cases/{id}` | `SaveApiDefinitionCaseRequest` | `ApiResponse<ApiDefinitionCaseDetail>` | `endpoints.apiAutomation.updateCase(id)` | `features/api-case-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete API case | `DELETE` | `/api/automation/api/cases/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteCase(id)` | `features/api-case-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Run API case | `POST` | `/api/automation/api/cases/{id}/run` | `ApiRunRequest { workspaceCode?, environmentId?, variableSetId? }` | `ApiResponse<ApiRunResponse>` | `endpoints.apiAutomation.runCase(id)` | `features/api-case-run` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Debug draft API case | `POST` | `/api/automation/api/cases/debug-run` | `ApiDebugCaseRequest` | `ApiResponse<ApiRunResponse>` | `endpoints.apiAutomation.debugCaseDraft` | `features/api-request-debug` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| List case run history | `GET` | `/api/automation/api/cases/{id}/run-history` | header `X-Workspace-Code` | `ApiResponse<PageResponse<ApiDefinitionCaseRunHistoryItem>>` | `endpoints.apiAutomation.caseRunHistory(id)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Get case run history detail | `GET` | `/api/automation/api/cases/run-history/{historyId}` | header `X-Workspace-Code` | `ApiResponse<ApiDefinitionCaseRunHistoryDetail>` | `endpoints.apiAutomation.caseRunHistoryDetail(historyId)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| List case change history | `GET` | `/api/automation/api/cases/{id}/change-history` | header `X-Workspace-Code` | `ApiResponse<PageResponse<ApiDefinitionCaseChangeHistoryItem>>` | `endpoints.apiAutomation.caseChangeHistory(id)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Stream AI generated API cases | `POST` | `/api/automation/api/ai-case-generation/stream` | `ApiAiCaseGenerationRequest`, SSE | `text/event-stream` events | `endpoints.apiAutomation.streamAiCaseGeneration` | `processes/ai-generation-flow`, `features/api-ai-case-generate` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAiCaseGenerationService.java` |
| List API scenarios | `GET` | `/api/automation/api/scenarios?moduleId=&keyword=&status=` | header `X-Workspace-Code`, optional filters | `ApiResponse<PageResponse<ApiScenarioItem>>` | `endpoints.apiAutomation.scenarios` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Get API scenario detail | `GET` | `/api/automation/api/scenarios/{id}` | header `X-Workspace-Code` | `ApiResponse<ApiScenarioDetail>` | `endpoints.apiAutomation.scenarioDetail(id)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create API scenario | `POST` | `/api/automation/api/scenarios` | `SaveApiScenarioRequest` | `ApiResponse<ApiScenarioDetail>` | `endpoints.apiAutomation.createScenario` | `features/api-scenario-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update API scenario | `PUT` | `/api/automation/api/scenarios/{id}` | `SaveApiScenarioRequest` | `ApiResponse<ApiScenarioDetail>` | `endpoints.apiAutomation.updateScenario(id)` | `features/api-scenario-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete API scenario | `DELETE` | `/api/automation/api/scenarios/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteScenario(id)` | `features/api-scenario-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Run API scenario | `POST` | `/api/automation/api/scenarios/{id}/run` | `ApiRunRequest { workspaceCode?, environmentId?, variableSetId? }` | `ApiResponse<ApiRunResponse>` | `endpoints.apiAutomation.runScenario(id)` | `features/api-scenario-run` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| List scenario modules | `GET` | `/api/automation/api/scenario-modules` | header `X-Workspace-Code` | `ApiResponse<List<ApiScenarioModuleItem>>` | `endpoints.apiAutomation.scenarioModules` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create scenario module | `POST` | `/api/automation/api/scenario-modules` | `ApiScenarioModuleRequest { workspaceCode?, parentId?, name }` | `ApiResponse<ApiScenarioModuleItem>` | `endpoints.apiAutomation.createScenarioModule` | `features/api-scenario-module-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update scenario module | `PUT` | `/api/automation/api/scenario-modules/{id}` | `ApiScenarioModuleRequest { workspaceCode?, parentId?, name }` | `ApiResponse<ApiScenarioModuleItem>` | `endpoints.apiAutomation.updateScenarioModule(id)` | `features/api-scenario-module-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Move scenario module | `PUT` | `/api/automation/api/scenario-modules/{id}/move` | `MoveApiScenarioModuleRequest { parentId?, sortOrder? }` | `ApiResponse<ApiScenarioModuleItem>` | `endpoints.apiAutomation.moveScenarioModule(id)` | `features/api-scenario-module-move` | `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete scenario module | `DELETE` | `/api/automation/api/scenario-modules/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteScenarioModule(id)` | `features/api-scenario-module-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| List API environments | `GET` | `/api/automation/api/environments` | header `X-Workspace-Code` | `ApiResponse<PageResponse<ApiEnvironmentItem>>` | `endpoints.apiAutomation.environments` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create API environment | `POST` | `/api/automation/api/environments` | `ApiEnvironmentRequest` | `ApiResponse<ApiEnvironmentItem>` | `endpoints.apiAutomation.createEnvironment` | `features/api-environment-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update API environment | `PUT` | `/api/automation/api/environments/{id}` | `ApiEnvironmentRequest` | `ApiResponse<ApiEnvironmentItem>` | `endpoints.apiAutomation.updateEnvironment(id)` | `features/api-environment-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete API environment | `DELETE` | `/api/automation/api/environments/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteEnvironment(id)` | `features/api-environment-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| List API variable sets | `GET` | `/api/automation/api/variable-sets` | header `X-Workspace-Code` | `ApiResponse<PageResponse<ApiVariableSetItem>>` | `endpoints.apiAutomation.variableSets` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| Create API variable set | `POST` | `/api/automation/api/variable-sets` | `ApiVariableSetRequest` | `ApiResponse<ApiVariableSetItem>` | `endpoints.apiAutomation.createVariableSet` | `features/api-variable-set-create` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Update API variable set | `PUT` | `/api/automation/api/variable-sets/{id}` | `ApiVariableSetRequest` | `ApiResponse<ApiVariableSetItem>` | `endpoints.apiAutomation.updateVariableSet(id)` | `features/api-variable-set-edit` | `web/src/api/platform.ts`, `ApiAutomationController.java`, `ApiAutomationModels.java` |
| Delete API variable set | `DELETE` | `/api/automation/api/variable-sets/{id}` | header `X-Workspace-Code` | `ApiResponse<Void>` | `endpoints.apiAutomation.deleteVariableSet(id)` | `features/api-variable-set-delete` | `web/src/api/platform.ts`, `ApiAutomationController.java` |
| List API run report steps | `GET` | `/api/automation/api/runs/reports/{id}/steps` | header `X-Workspace-Code` | `ApiResponse<List<ApiRunStepResultResponse>>` | `endpoints.apiAutomation.reportSteps(reportId)` | `entities/api-automation` | `web/src/api/platform.ts`, `ApiAutomationController.java` |

Notes:

- All paths above are under backend controller base `@RequestMapping("/api/automation/api")`; new frontend calls them through `VITE_API_BASE_URL=http://localhost:8080/api`, so endpoint constants should omit the leading `/api`.
- Old frontend implemented all API Automation calls in `web/src/api/platform.ts` and most UI/state orchestration in `web/src/components/ApiAutomationWorkspace.vue`.
- Backend exposes module move endpoints for definition modules and scenario modules, but old `platform.ts` currently has no wrapper for these two move calls. New frontend should still include contract keys because `ApiAutomationController.java` proves the backend API exists.
- API Automation has its own environment and variable-set APIs under `/automation/api/environments` and `/automation/api/variable-sets`. These are distinct from Config Center `/settings/envs` and `/settings/params`; later implementation should decide whether they share UI primitives or need explicit mapping.
- `ApiAssertionInput`, `ApiProcessorInput`, `ApiRequestConfigInput`, `ApiScenarioStepInput`, `ApiRunRequest`, and execution result snapshots are shared sub-models across definitions, cases, scenarios, debug runs, and reports.

## Update Rule

When a row is verified, update `src/shared/api/endpoints.ts` and the matching entity API file in the same change. Keep the source column pointing to the old frontend file or backend controller that proves the path.

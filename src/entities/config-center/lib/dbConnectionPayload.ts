import type {
  DbConnectionFormValues,
  DbConnectionItem,
  SaveDbConnectionPayload,
  TestDbConnectionPayload
} from '../model/types';

export function createDefaultDbConnectionForm(): DbConnectionFormValues {
  return {
    connectionName: '',
    dbType: 'MYSQL',
    driverClassName: '',
    jdbcUrl: '',
    username: '',
    password: '',
    poolMax: 5,
    timeoutMs: 3000,
    description: '',
    status: 1
  };
}

export function createDbConnectionEditForm(db: DbConnectionItem): DbConnectionFormValues {
  return {
    connectionName: db.connectionName,
    dbType: db.dbType,
    driverClassName: db.driverClassName || '',
    jdbcUrl: db.jdbcUrl,
    username: db.username || '',
    password: '',
    poolMax: db.poolMax || 5,
    timeoutMs: db.timeoutMs || 3000,
    description: db.description || '',
    status: db.status
  };
}

export function toSaveDbConnectionPayload(
  form: DbConnectionFormValues,
  workspaceCode?: string
): SaveDbConnectionPayload {
  const driverClassName = form.driverClassName.trim();
  const username = form.username.trim();
  const password = form.password.trim();
  const description = form.description.trim();

  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    connectionName: form.connectionName.trim(),
    dbType: form.dbType.trim(),
    ...(driverClassName ? { driverClassName } : {}),
    jdbcUrl: form.jdbcUrl.trim(),
    ...(username ? { username } : {}),
    ...(password ? { password } : {}),
    poolMax: form.poolMax,
    timeoutMs: form.timeoutMs,
    ...(description ? { description } : {}),
    status: form.status
  };
}

export function toTestDbConnectionPayload(
  db: DbConnectionItem,
  workspaceCode?: string
): TestDbConnectionPayload {
  return {
    id: db.id,
    ...(workspaceCode ? { workspaceCode } : {}),
    connectionName: db.connectionName,
    dbType: db.dbType,
    ...(db.driverClassName ? { driverClassName: db.driverClassName } : {}),
    jdbcUrl: db.jdbcUrl,
    ...(db.username ? { username: db.username } : {}),
    ...(db.timeoutMs ? { timeoutMs: db.timeoutMs } : {})
  };
}

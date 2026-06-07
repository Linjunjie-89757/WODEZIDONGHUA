import { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Edit2, Check, X, ChevronRight,
  Globe, Database, Settings as SettingsIcon,
  Users, Lock, Calendar, Activity, Key, Server, Eye, EyeOff,
} from 'lucide-react';

// ── 配置中心导航 ──────────────────────────────────────────────────────────

const configNav = [
  { id: 'env', label: '环境配置', icon: Globe, desc: '测试环境管理' },
  { id: 'params', label: '参数配置', icon: Key, desc: '全局参数设置' },
  { id: 'database', label: '数据库连接', icon: Server, desc: '数据源配置' },
];

// ── 环境配置数据结构 ──────────────────────────────────────────────────────

interface Environment {
  id: string;
  name: string;
  type: 'test' | 'staging' | 'prod';
  baseUrl: string;
  desc: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const initEnvironments: Environment[] = [
  {
    id: 'env1',
    name: '测试环境',
    type: 'test',
    baseUrl: 'https://test-api.example.com',
    desc: '开发和测试使用的环境',
    status: 'active',
    createdAt: '2026-01-10',
  },
  {
    id: 'env2',
    name: '预发布环境',
    type: 'staging',
    baseUrl: 'https://staging-api.example.com',
    desc: '上线前验证环境',
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: 'env3',
    name: '生产环境',
    type: 'prod',
    baseUrl: 'https://api.example.com',
    desc: '正式生产环境（谨慎操作）',
    status: 'inactive',
    createdAt: '2026-02-01',
  },
];

// ── 参数配置数据结构 ──────────────────────────────────────────────────────

interface Parameter {
  id: string;
  key: string;
  value: string;
  type: 'global' | 'api' | 'business';
  desc: string;
  isSecret: boolean;
  createdAt: string;
}

const initParameters: Parameter[] = [
  {
    id: 'p1',
    key: 'REQUEST_TIMEOUT',
    value: '30000',
    type: 'global',
    desc: '接口请求超时时间（毫秒）',
    isSecret: false,
    createdAt: '2026-01-05',
  },
  {
    id: 'p2',
    key: 'MAX_RETRY_COUNT',
    value: '3',
    type: 'global',
    desc: '失败重试最大次数',
    isSecret: false,
    createdAt: '2026-01-05',
  },
  {
    id: 'p3',
    key: 'APP_KEY',
    value: 'ak_••••••••••••••••',
    type: 'api',
    desc: '应用密钥',
    isSecret: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'p4',
    key: 'TEST_ACCOUNT',
    value: 'test_user_001',
    type: 'business',
    desc: '测试账号用户名',
    isSecret: false,
    createdAt: '2026-01-12',
  },
];

// ── 数据库连接数据结构 ────────────────────────────────────────────────────

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'redis' | 'mongodb';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  status: 'connected' | 'error' | 'untested';
  createdAt: string;
}

const initDatabases: DatabaseConnection[] = [
  {
    id: 'db1',
    name: '主数据库（测试）',
    type: 'mysql',
    host: 'test-mysql.example.com',
    port: 3306,
    database: 'test_db',
    username: 'test_user',
    password: '••••••••',
    status: 'connected',
    createdAt: '2026-01-08',
  },
  {
    id: 'db2',
    name: 'Redis缓存',
    type: 'redis',
    host: 'test-redis.example.com',
    port: 6379,
    database: '0',
    username: '',
    password: '••••••••',
    status: 'connected',
    createdAt: '2026-01-10',
  },
  {
    id: 'db3',
    name: 'PostgreSQL数据仓库',
    type: 'postgresql',
    host: 'test-pg.example.com',
    port: 5432,
    database: 'analytics',
    username: 'analyst',
    password: '••••••••',
    status: 'error',
    createdAt: '2026-02-05',
  },
];

// ── 环境配置页面 ──────────────────────────────────────────────────────────

function EnvironmentConfigPage() {
  const [environments, setEnvironments] = useState<Environment[]>(initEnvironments);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Environment | undefined>();

  const handleSave = (env: Environment) => {
    setEnvironments(prev => {
      const idx = prev.findIndex(e => e.id === env.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = env;
        return next;
      }
      return [...prev, env];
    });
    setModalOpen(false);
    setEditingEnv(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该环境配置吗？')) {
      setEnvironments(prev => prev.filter(e => e.id !== id));
    }
  };

  const typeConfig = {
    test: { label: '测试', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    staging: { label: '预发布', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    prod: { label: '生产', color: 'bg-red-50 text-red-700 border-red-200' },
  };

  const statusConfig = {
    active: { label: '启用中', color: 'bg-green-100 text-green-700' },
    inactive: { label: '已禁用', color: 'bg-gray-100 text-gray-600' },
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-base font-semibold text-gray-900">环境配置</h2>
          <p className="text-sm text-gray-500 mt-0.5">管理不同测试环境的配置信息</p>
        </div>
        <button
          onClick={() => { setEditingEnv(undefined); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增环境
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: '环境总数', value: environments.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '启用环境', value: environments.filter(e => e.status === 'active').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '生产环境', value: environments.filter(e => e.type === 'prod').length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {environments.map(env => {
          const tConfig = typeConfig[env.type];
          const sConfig = statusConfig[env.status];
          return (
            <div key={env.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{env.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sConfig.color}`}>
                      {sConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{env.desc}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingEnv(env); setModalOpen(true); }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(env.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-lg border ${tConfig.color}`}>
                    {tConfig.label}环境
                  </span>
                </div>
                <div className="text-xs text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                  {env.baseUrl}
                </div>
                <div className="text-xs text-gray-400">创建于 {env.createdAt}</div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <EnvironmentModal
          initial={editingEnv}
          onClose={() => { setModalOpen(false); setEditingEnv(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function EnvironmentModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Environment;
  onClose: () => void;
  onSave: (env: Environment) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<Environment['type']>(initial?.type ?? 'test');
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? '');
  const [desc, setDesc] = useState(initial?.desc ?? '');
  const [status, setStatus] = useState<Environment['status']>(initial?.status ?? 'active');

  const handleSave = () => {
    if (!name || !baseUrl) {
      alert('请填写环境名称和URL');
      return;
    }
    onSave({
      id: initial?.id ?? `env${Date.now()}`,
      name,
      type,
      baseUrl,
      desc,
      status,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{initial ? '编辑环境' : '新增环境'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">环境名称</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：测试环境"
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">环境类型</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {[
                { value: 'test', label: '测试' },
                { value: 'staging', label: '预发布' },
                { value: 'prod', label: '生产' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value as Environment['type'])}
                  className={`px-3 py-2 rounded-lg border-2 text-sm ${
                    type === t.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Base URL</label>
            <input
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">描述</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={2}
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">状态</label>
            <div className="flex gap-3 mt-1.5">
              {[
                { value: 'active', label: '启用' },
                { value: 'inactive', label: '禁用' },
              ].map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value as Environment['status'])}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm ${
                    status === s.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
            取消
          </button>
          <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 参数配置页面 ──────────────────────────────────────────────────────────

function ParameterConfigPage() {
  const [parameters, setParameters] = useState<Parameter[]>(initParameters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<Parameter | undefined>();
  const [filter, setFilter] = useState<'all' | 'global' | 'api' | 'business'>('all');

  const filteredParams = filter === 'all' ? parameters : parameters.filter(p => p.type === filter);

  const typeConfig = {
    global: { label: '全局参数', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '⚙️' },
    api: { label: '接口参数', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '🔌' },
    business: { label: '业务参数', color: 'bg-green-50 text-green-700 border-green-200', icon: '💼' },
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-base font-semibold text-gray-900">参数配置</h2>
          <p className="text-sm text-gray-500 mt-0.5">管理全局配置参数和业务参数</p>
        </div>
        <button
          onClick={() => { setEditingParam(undefined); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增参数
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: '全部参数', value: parameters.length, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: '全局参数', value: parameters.filter(p => p.type === 'global').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '接口参数', value: parameters.filter(p => p.type === 'api').length, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: '业务参数', value: parameters.filter(p => p.type === 'business').length, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        {[
          { value: 'all', label: '全部' },
          { value: 'global', label: '全局参数' },
          { value: 'api', label: '接口参数' },
          { value: 'business', label: '业务参数' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f.value
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">参数名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">参数值</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredParams.map(param => {
              const tConfig = typeConfig[param.type];
              return (
                <tr key={param.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{param.key}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {param.isSecret ? param.value : <span className="bg-gray-100 px-2 py-1 rounded">{param.value}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${tConfig.color}`}>
                      <span>{tConfig.icon}</span>
                      <span>{tConfig.label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{param.desc}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setEditingParam(param); setModalOpen(true); }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定删除该参数吗？')) {
                            setParameters(prev => prev.filter(p => p.id !== param.id));
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ParameterModal
          initial={editingParam}
          onClose={() => { setModalOpen(false); setEditingParam(undefined); }}
          onSave={(param) => {
            setParameters(prev => {
              const idx = prev.findIndex(p => p.id === param.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = param;
                return next;
              }
              return [...prev, param];
            });
            setModalOpen(false);
            setEditingParam(undefined);
          }}
        />
      )}
    </div>
  );
}

function ParameterModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Parameter;
  onClose: () => void;
  onSave: (param: Parameter) => void;
}) {
  const [key, setKey] = useState(initial?.key ?? '');
  const [value, setValue] = useState(initial?.value ?? '');
  const [type, setType] = useState<Parameter['type']>(initial?.type ?? 'global');
  const [desc, setDesc] = useState(initial?.desc ?? '');
  const [isSecret, setIsSecret] = useState(initial?.isSecret ?? false);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{initial ? '编辑参数' : '新增参数'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">参数名</label>
            <input
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="例如：REQUEST_TIMEOUT"
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">参数值</label>
            <input
              type={isSecret ? 'password' : 'text'}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="参数值"
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">参数类型</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {[
                { value: 'global', label: '全局参数' },
                { value: 'api', label: '接口参数' },
                { value: 'business', label: '业务参数' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value as Parameter['type'])}
                  className={`px-3 py-2 rounded-lg border-2 text-sm ${
                    type === t.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">说明</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={2}
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={e => setIsSecret(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">敏感参数（密码、密钥等）</label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
            取消
          </button>
          <button
            onClick={() => {
              if (!key || !value) {
                alert('请填写参数名和参数值');
                return;
              }
              onSave({
                id: initial?.id ?? `p${Date.now()}`,
                key,
                value: isSecret ? value : value,
                type,
                desc,
                isSecret,
                createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
              });
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 数据库连接页面 ────────────────────────────────────────────────────────

function DatabaseConfigPage() {
  const [databases, setDatabases] = useState<DatabaseConnection[]>(initDatabases);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDb, setEditingDb] = useState<DatabaseConnection | undefined>();
  const [testingId, setTestingId] = useState<string | null>(null);

  const dbTypeConfig = {
    mysql: { label: 'MySQL', icon: '🐬', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    postgresql: { label: 'PostgreSQL', icon: '🐘', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    redis: { label: 'Redis', icon: '⚡', color: 'bg-red-50 text-red-700 border-red-200' },
    mongodb: { label: 'MongoDB', icon: '🍃', color: 'bg-green-50 text-green-700 border-green-200' },
  };

  const statusConfig = {
    connected: { label: '已连接', color: 'bg-green-100 text-green-700', icon: Check },
    error: { label: '连接失败', color: 'bg-red-100 text-red-700', icon: X },
    untested: { label: '未测试', color: 'bg-gray-100 text-gray-600', icon: Activity },
  };

  const handleTest = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setDatabases(prev =>
        prev.map(db => (db.id === id ? { ...db, status: Math.random() > 0.3 ? 'connected' : 'error' } : db))
      );
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-base font-semibold text-gray-900">数据库连接</h2>
          <p className="text-sm text-gray-500 mt-0.5">管理测试数据库连接配置</p>
        </div>
        <button
          onClick={() => { setEditingDb(undefined); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增连接
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: '连接总数', value: databases.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '正常连接', value: databases.filter(d => d.status === 'connected').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '异常连接', value: databases.filter(d => d.status === 'error').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'MySQL', value: databases.filter(d => d.type === 'mysql').length, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {databases.map(db => {
          const typeConf = dbTypeConfig[db.type];
          const statusConf = statusConfig[db.status];
          const StatusIcon = statusConf.icon;
          return (
            <div key={db.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{db.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusConf.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConf.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${typeConf.color}`}>
                      <span>{typeConf.icon}</span>
                      <span>{typeConf.label}</span>
                    </span>
                    <span className="text-xs text-gray-600 font-mono">{db.host}:{db.port}</span>
                    <span className="text-xs text-gray-500">数据库：{db.database}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTest(db.id)}
                    disabled={testingId === db.id}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                  >
                    <Activity className={`w-4 h-4 ${testingId === db.id ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => { setEditingDb(db); setModalOpen(true); }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('确定删除该数据库连接吗？')) {
                        setDatabases(prev => prev.filter(d => d.id !== db.id));
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <DatabaseModal
          initial={editingDb}
          onClose={() => { setModalOpen(false); setEditingDb(undefined); }}
          onSave={(db) => {
            setDatabases(prev => {
              const idx = prev.findIndex(d => d.id === db.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = db;
                return next;
              }
              return [...prev, db];
            });
            setModalOpen(false);
            setEditingDb(undefined);
          }}
        />
      )}
    </div>
  );
}

function DatabaseModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: DatabaseConnection;
  onClose: () => void;
  onSave: (db: DatabaseConnection) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<DatabaseConnection['type']>(initial?.type ?? 'mysql');
  const [host, setHost] = useState(initial?.host ?? '');
  const [port, setPort] = useState(initial?.port ?? 3306);
  const [database, setDatabase] = useState(initial?.database ?? '');
  const [username, setUsername] = useState(initial?.username ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const defaultPorts = { mysql: 3306, postgresql: 5432, redis: 6379, mongodb: 27017 };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{initial ? '编辑数据库连接' : '新增数据库连接'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">连接名称</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：主数据库（测试）"
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">数据库类型</label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {[
                { value: 'mysql', label: 'MySQL' },
                { value: 'postgresql', label: 'PostgreSQL' },
                { value: 'redis', label: 'Redis' },
                { value: 'mongodb', label: 'MongoDB' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => {
                    setType(t.value as DatabaseConnection['type']);
                    setPort(defaultPorts[t.value as keyof typeof defaultPorts]);
                  }}
                  className={`px-3 py-2 rounded-lg border-2 text-sm ${
                    type === t.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">主机地址</label>
              <input
                value={host}
                onChange={e => setHost(e.target.value)}
                placeholder="localhost 或 IP"
                className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">端口</label>
              <input
                type="number"
                value={port}
                onChange={e => setPort(parseInt(e.target.value))}
                className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">数据库名</label>
            <input
              value={database}
              onChange={e => setDatabase(e.target.value)}
              placeholder="数据库名称"
              className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">用户名</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="数据库用户名"
                className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={initial ? '不修改请留空' : '数据库密码'}
                  className="w-full mt-1.5 px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-0.75"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
            取消
          </button>
          <button
            onClick={() => {
              if (!name || !host || !database) {
                alert('请填写必填项');
                return;
              }
              onSave({
                id: initial?.id ?? `db${Date.now()}`,
                name,
                type,
                host,
                port,
                database,
                username,
                password: password || initial?.password || '••••••••',
                status: 'untested',
                createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
              });
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 主配置中心页面 ────────────────────────────────────────────────────────

export default function ConfigCenterPage() {
  const [activeNav, setActiveNav] = useState('env');

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Left config nav */}
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-4 px-3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-3 mb-2">配置分类</p>
        {configNav.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-0.5 ${
              activeNav === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`w-4 h-4 flex-shrink-0 ${activeNav === item.id ? 'text-blue-500' : 'text-gray-400'}`}
            />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{item.label}</div>
              <div className="text-xs text-gray-400 truncate">{item.desc}</div>
            </div>
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeNav === 'env' ? (
          <EnvironmentConfigPage />
        ) : activeNav === 'params' ? (
          <ParameterConfigPage />
        ) : activeNav === 'database' ? (
          <DatabaseConfigPage />
        ) : null}
      </div>
    </div>
  );
}

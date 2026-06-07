import { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Edit2, Check, X, ChevronRight, ChevronLeft,
  Layers, Users, UserCog, Shield, Crown, Activity, Calendar, ChevronDown,
} from 'lucide-react';

// ── 工作空间数据结构 ──────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  desc: string;
  type: 'project' | 'team' | 'product';
  owner: string;
  admins: string[];
  members: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const initWorkspaces: Workspace[] = [
  {
    id: 'ws1',
    name: '开户工作空间',
    desc: '开户流程相关的自动化测试项目和用例',
    type: 'project',
    owner: '张君',
    admins: ['王欣'],
    members: ['李文', '钱瑶', '周杰', '吴磊'],
    status: 'active',
    createdAt: '2026-02-20',
    updatedAt: '2026-06-03',
  },
  {
    id: 'ws2',
    name: '核心产品测试',
    desc: '核心产品功能的全面测试和质量保障',
    type: 'product',
    owner: '组织管理员',
    admins: ['张君', '王欣'],
    members: ['李文', '钱瑶'],
    status: 'active',
    createdAt: '2026-03-10',
    updatedAt: '2026-06-02',
  },
  {
    id: 'ws3',
    name: '支付团队空间',
    desc: '支付团队的日常测试和协作空间',
    type: 'team',
    owner: '王欣',
    admins: ['李文'],
    members: ['钱瑶', '周杰'],
    status: 'active',
    createdAt: '2026-04-01',
    updatedAt: '2026-05-28',
  },
];

// ── 多选下拉框组件 ────────────────────────────────────────────────────────

function MultiSelect({
  selected,
  options,
  onChange,
}: {
  selected: string[];
  options: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <span className={selected.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
            {selected.length === 0
              ? '请选择成员'
              : selected.length <= 2
              ? selected.join(', ')
              : `${selected.slice(0, 2).join(', ')} +${selected.length - 2}`}
          </span>
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {selected.length > 0 ? `已选 ${selected.length} 人` : '未选择'}
              </span>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  清空
                </button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {options.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-gray-400">暂无可选成员</div>
              ) : (
                options.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                      selected.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span>{option}</span>
                    {selected.includes(option) && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">已选择 {selected.length} 名成员</p>
      )}
    </div>
  );
}

// ── 工作空间编辑/新增弹窗 ─────────────────────────────────────────────────

export function WorkspaceModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Workspace;
  onClose: () => void;
  onSave: (ws: Workspace) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [desc, setDesc] = useState(initial?.desc ?? '');
  const [type, setType] = useState<Workspace['type']>(initial?.type ?? 'project');
  const [owner, setOwner] = useState(initial?.owner ?? '组织管理员');
  const [admins, setAdmins] = useState<string[]>(initial?.admins ?? []);
  const [members, setMembers] = useState<string[]>(initial?.members ?? []);
  const [status, setStatus] = useState<Workspace['status']>(initial?.status ?? 'active');

  const allUsers = ['组织管理员', '张君', '王欣', '李文', '钱瑶', '周杰', '吴磊', '郑强', '孙丽', '陈明', '刘洋'];

  const availableAdmins = allUsers.filter(u => u !== owner);
  const availableMembers = allUsers.filter(u => u !== owner && !admins.includes(u));

  const handleOwnerChange = (newOwner: string) => {
    setOwner(newOwner);
    setAdmins(prev => prev.filter(a => a !== newOwner));
    setMembers(prev => prev.filter(m => m !== newOwner));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入空间名称');
      return;
    }
    onSave({
      id: initial?.id ?? `ws${Date.now()}`,
      name: name.trim(),
      desc: desc.trim(),
      type,
      owner,
      admins,
      members,
      status,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">
            {initial ? '编辑工作空间' : '新增工作空间'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">空间名称 *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：开户工作空间"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">空间描述</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="描述该工作空间的用途和范围"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">空间类型</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'project', label: '项目空间', icon: '📦', desc: '项目专用' },
                { value: 'team', label: '团队空间', icon: '👥', desc: '团队协作' },
                { value: 'product', label: '产品空间', icon: '🎯', desc: '产品测试' },
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as Workspace['type'])}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    type === t.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xs font-medium text-gray-900">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">负责人（Owner）</label>
            <select
              value={owner}
              onChange={e => handleOwnerChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allUsers.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400">负责人拥有空间最高权限，创建后可通过成员管理添加管理员和成员</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">状态</label>
            <div className="flex gap-3">
              {[
                { value: 'active', label: '启用', color: 'bg-green-50 text-green-700 border-green-200' },
                { value: 'inactive', label: '禁用', color: 'bg-gray-100 text-gray-600 border-gray-200' },
              ].map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value as Workspace['status'])}
                  className={`flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    status === s.value
                      ? s.color
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {initial ? '保存修改' : '创建空间'}
          </button>
        </div>
      </div>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

// ── 工作空间卡片 ──────────────────────────────────────────────────────────

export function WorkspaceCard({
  workspace,
  onEdit,
  onDelete,
  onManageMembers,
}: {
  workspace: Workspace;
  onEdit: () => void;
  onDelete: () => void;
  onManageMembers: () => void;
}) {
  const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
    project: { icon: '📦', label: '项目', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    team: { icon: '👥', label: '团队', color: 'bg-green-50 text-green-700 border-green-200' },
    product: { icon: '🎯', label: '产品', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const statusConfig = {
    active: { label: '启用中', color: 'bg-green-100 text-green-700' },
    inactive: { label: '已禁用', color: 'bg-gray-100 text-gray-600' },
  };

  const config = typeConfig[workspace.type] || typeConfig.project;
  const statusCfg = statusConfig[workspace.status];

  if (!workspace || !config) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{workspace.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{workspace.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onManageMembers}
            title="成员管理"
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <UserCog className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            title="编辑"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="删除"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${config.color}`}>
          <span>{config.icon}</span>
          <span>{config.label}空间</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          {workspace.owner || '未指定'} (负责人)
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          {(workspace.admins?.length || 0) + (workspace.members?.length || 0) + 1} 名成员
        </span>
      </div>
    </div>
  );
}

// ── 成员管理详情页 ────────────────────────────────────────────────────────

export function MemberManagementPage({
  workspace,
  onBack,
  onUpdate,
}: {
  workspace: Workspace;
  onBack: () => void;
  onUpdate: (admins: string[], members: string[]) => void;
}) {
  const [admins, setAdmins] = useState<string[]>(workspace.admins || []);
  const [members, setMembers] = useState<string[]>(workspace.members || []);
  const [showAdminSelector, setShowAdminSelector] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const adminSelectorRef = useRef<HTMLDivElement>(null);
  const memberSelectorRef = useRef<HTMLDivElement>(null);

  const allUsers = ['组织管理员', '张君', '王欣', '李文', '钱瑶', '周杰', '吴磊', '郑强', '孙丽', '陈明', '刘洋'];

  const availableAdmins = allUsers.filter(u => u !== workspace.owner && !admins.includes(u));
  const availableMembers = allUsers.filter(
    u => u !== workspace.owner && !admins.includes(u) && !members.includes(u)
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (adminSelectorRef.current && !adminSelectorRef.current.contains(e.target as Node)) {
        setShowAdminSelector(false);
      }
      if (memberSelectorRef.current && !memberSelectorRef.current.contains(e.target as Node)) {
        setShowMemberSelector(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    onUpdate(admins, members);
    onBack();
  };

  const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
    project: { icon: '📦', label: '项目', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    team: { icon: '👥', label: '团队', color: 'bg-green-50 text-green-700 border-green-200' },
    product: { icon: '🎯', label: '产品', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const config = typeConfig[workspace.type] || typeConfig.project;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            返回工作空间列表
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                {config.icon}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">{workspace.name}</h1>
                <p className="text-sm text-gray-500">{workspace.desc}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${config.color}`}>
                    <span>{config.icon}</span>
                    <span>{config.label}空间</span>
                  </span>
                  <span className="text-xs text-gray-400">创建于 {workspace.createdAt}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              保存更改
            </button>
          </div>
        </div>

        <div className="px-8 flex items-center gap-6 border-t border-gray-100">
          <button className="px-1 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            成员管理
          </button>
          <button className="px-1 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            权限设置
          </button>
          <button className="px-1 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            操作日志
          </button>
        </div>
      </div>

      <div className="px-8 py-7 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">成员管理</h2>
          <div className="text-sm text-gray-500">
            共 {admins.length + members.length + 1} 名成员
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-900">负责人 (1人)</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-medium">
                {workspace.owner.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{workspace.owner}</div>
                <div className="text-xs text-gray-500">拥有空间最高权限</div>
              </div>
            </div>
            <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              Owner
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-900">管理员 ({admins.length}人)</h3>
            </div>
            <div className="relative" ref={adminSelectorRef}>
              <button
                onClick={() => setShowAdminSelector(!showAdminSelector)}
                disabled={availableAdmins.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                添加管理员
              </button>
              {showAdminSelector && availableAdmins.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                    <span className="text-xs text-gray-500 font-medium">选择成员</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {availableAdmins.map(user => (
                      <button
                        key={user}
                        onClick={() => {
                          setAdmins([...admins, user]);
                          setShowAdminSelector(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        {user}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {admins.length > 0 ? (
            <div className="space-y-2">
              {admins.map(admin => (
                <div
                  key={admin}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                      {admin.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{admin}</div>
                      <div className="text-xs text-gray-500">具有管理权限，可编辑用例和配置</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      Admin
                    </span>
                    <button
                      onClick={() => setAdmins(admins.filter(a => a !== admin))}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              暂无管理员，点击右上角添加
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">成员 ({members.length}人)</h3>
            </div>
            <div className="relative" ref={memberSelectorRef}>
              <button
                onClick={() => setShowMemberSelector(!showMemberSelector)}
                disabled={availableMembers.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                添加成员
              </button>
              {showMemberSelector && availableMembers.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                    <span className="text-xs text-gray-500 font-medium">选择成员</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {availableMembers.map(user => (
                      <button
                        key={user}
                        onClick={() => {
                          setMembers([...members, user]);
                          setShowMemberSelector(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        {user}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {members.length > 0 ? (
            <div className="space-y-2">
              {members.map(member => (
                <div
                  key={member}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-medium">
                      {member.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member}</div>
                      <div className="text-xs text-gray-500">可查看和执行测试用例</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
                      Member
                    </span>
                    <button
                      onClick={() => setMembers(members.filter(m => m !== member))}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              暂无成员，点击右上角添加
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 空间配置页面 ──────────────────────────────────────────────────────────

export default function WorkspaceConfigPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initWorkspaces);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | undefined>();
  const [managingWorkspace, setManagingWorkspace] = useState<Workspace | undefined>();

  const handleSave = (ws: Workspace) => {
    setWorkspaces(prev => {
      const idx = prev.findIndex(x => x.id === ws.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = ws;
        return next;
      }
      return [...prev, ws];
    });
    setModalOpen(false);
    setEditingWorkspace(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该工作空间吗？删除后相关数据将无法恢复。')) {
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
    }
  };

  const handleUpdateMembers = (id: string, admins: string[], members: string[]) => {
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === id
          ? { ...ws, admins, members, updatedAt: new Date().toISOString().slice(0, 10) }
          : ws
      )
    );
  };

  const activeCount = workspaces.filter(ws => ws.status === 'active').length;
  const totalMembers = workspaces.reduce((sum, ws) => {
    const admins = ws.admins?.length || 0;
    const members = ws.members?.length || 0;
    return sum + admins + members + 1;
  }, 0);

  if (managingWorkspace) {
    return (
      <MemberManagementPage
        workspace={managingWorkspace}
        onBack={() => setManagingWorkspace(undefined)}
        onUpdate={(admins, members) => {
          handleUpdateMembers(managingWorkspace.id, admins, members);
          setManagingWorkspace(undefined);
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-base font-semibold text-gray-900">工作空间配置</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            管理测试空间，控制不同项目和团队的测试资源隔离
          </p>
        </div>
        <button
          onClick={() => {
            setEditingWorkspace(undefined);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增空间
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: '空间总数', value: workspaces.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Layers },
          { label: '启用空间', value: activeCount, color: 'text-green-600', bg: 'bg-green-50', icon: Check },
          { label: '总成员数', value: totalMembers, color: 'text-purple-600', bg: 'bg-purple-50', icon: Users },
          {
            label: '项目空间',
            value: workspaces.filter(ws => ws.type === 'project').length,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            icon: Activity,
          },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500">{s.label}</div>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">暂无工作空间</p>
          <p className="text-xs text-gray-400 mb-4">创建第一个工作空间开始管理测试资源</p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> 创建工作空间
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {workspaces.map(ws => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              onEdit={() => {
                setEditingWorkspace(ws);
                setModalOpen(true);
              }}
              onDelete={() => handleDelete(ws.id)}
              onManageMembers={() => setManagingWorkspace(ws)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <WorkspaceModal
          initial={editingWorkspace}
          onClose={() => {
            setModalOpen(false);
            setEditingWorkspace(undefined);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

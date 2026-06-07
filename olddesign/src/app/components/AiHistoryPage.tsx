import { useState } from 'react';
import {
  ChevronLeft, RefreshCw, CheckCheck, Check, Trash2,
  RotateCcw, ChevronRight, Search, AlertCircle,
} from 'lucide-react';

// ── Mock data ─────────────────────────────────────────────────────────────

interface GenTask {
  id: string;
  taskId: string;
  workspace: string;
  requirement: string;
  outputMode: string;
  status: 'done' | 'fail' | 'running';
  count: number;
  createdAt: string;
}

const mockTasks: GenTask[] = [
  { id: '1', taskId: 'TASK_159F6C2FC7AA', workspace: '开户工作空间', requirement: '测试222', outputMode: '实时流式输出', status: 'done', count: 19, createdAt: '2026/5/29 16:57:24' },
  { id: '2', taskId: 'TASK_034744621588', workspace: '开户工作空间', requirement: '123', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 16:16:09' },
  { id: '3', taskId: 'TASK_40791941C1C6', workspace: '开户工作空间', requirement: '测试u', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 16:10:14' },
  { id: '4', taskId: 'TASK_7F49FFEDB2AE', workspace: '开户工作空间', requirement: '测试一下', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 15:41:30' },
  { id: '5', taskId: 'TASK_9BB8956E8BE1', workspace: '开户工作空间', requirement: '测试一下', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 15:41:24' },
  { id: '6', taskId: 'TASK_834485BA8BE1', workspace: '开户工作空间', requirement: '【订单中心】持续以增加是否区配范围成功验验', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 12:09:07' },
  { id: '7', taskId: 'TASK_42321F297ABC', workspace: '开户工作空间', requirement: '【订单中心】持续以增加是否区配范围成功验验', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 11:07:41' },
  { id: '8', taskId: 'TASK_F6857C12ABAD', workspace: '开户工作空间', requirement: '【订单中心】持续以增加是否区配范围成功验验', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/29 10:27:18' },
  { id: '9', taskId: 'TASK_A12BC3DE4F56', workspace: '开户工作空间', requirement: '用户登录流程验证', outputMode: '实时流式输出', status: 'running', count: 0, createdAt: '2026/5/29 09:15:00' },
  { id: '10', taskId: 'TASK_B98765432CDE', workspace: '交易工作空间', requirement: '支付链路全流程', outputMode: '实时流式输出', status: 'done', count: 8, createdAt: '2026/5/28 17:42:11' },
  { id: '11', taskId: 'TASK_C11223344EFF', workspace: '交易工作空间', requirement: '订单退款测试', outputMode: '实时流式输出', status: 'fail', count: 0, createdAt: '2026/5/28 14:30:05' },
];

interface CaseItem {
  id: string;
  name: string;
  precondition: string;
  steps: string;
  expected: string;
  requirement: string;
  priority: string;
  adopted: boolean;
}

const mockCases: CaseItem[] = [
  { id: 'AI-001', name: '验证开户流程正常提交后系统跳转至成功页面', precondition: '用户已注册，处于开户页面', steps: '1. 填写完整信息\n2. 点击提交', expected: '系统提示开户成功，跳转至首页', requirement: '测试222', priority: 'P1', adopted: false },
  { id: 'AI-002', name: '开户表单必填项为空时点击提交应给出提示', precondition: '用户在开户页面', steps: '1. 不填写任何内容\n2. 点击提交', expected: '显示必填项错误提示', requirement: '测试222', priority: 'P2', adopted: false },
  { id: 'AI-003', name: '身份证号格式不符合规范时系统应拒绝提交', precondition: '用户在填写身份证号码字段', steps: '1. 输入格式错误的身份证号\n2. 点击提交', expected: '系统提示身份证格式错误', requirement: '测试222', priority: 'P1', adopted: true },
  { id: 'AI-004', name: '银行卡号输入后系统自动识别所属银行', precondition: '用户在开户页面填写银行卡号', steps: '1. 输入有效银行卡号', expected: '系统显示银行名称及卡类型', requirement: '测试222', priority: 'P2', adopted: false },
  { id: 'AI-005', name: '开户超时后再次提交系统应提示重新登录', precondition: 'Session 过期', steps: '1. 等待Session超时\n2. 提交开户表单', expected: '系统提示登录超时，引导重新登录', requirement: '测试222', priority: 'P0', adopted: true },
  { id: 'AI-006', name: '上传身份证照片格式不支持时给出提示', precondition: '用户在上传身份证环节', steps: '1. 上传非支持格式文件', expected: '系统提示支持的文件格式', requirement: '测试222', priority: 'P2', adopted: false },
  { id: 'AI-007', name: '验证手机号已注册时开户流程给予提示', precondition: '手机号已存在于系统', steps: '1. 填写已注册手机号\n2. 提交', expected: '提示手机号已注册', requirement: '测试222', priority: 'P1', adopted: false },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: GenTask['status'] }) {
  const map = {
    done: { label: '已完成', cls: 'bg-green-50 text-green-700 border-green-200' },
    fail: { cls: 'bg-red-50 text-red-700 border-red-200', label: '失败' },
    running: { cls: 'bg-blue-50 text-blue-700 border-blue-200', label: '进行中' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status === 'done' && <Check className="w-3 h-3" />}
      {status === 'fail' && <AlertCircle className="w-3 h-3" />}
      {status === 'running' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    P0: 'bg-red-100 text-red-700',
    P1: 'bg-orange-100 text-orange-700',
    P2: 'bg-yellow-100 text-yellow-700',
    P3: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[priority] ?? map.P3}`}>
      {priority}
    </span>
  );
}

// ── Detail view ────────────────────────────────────────────────────────────

function TaskDetailView({ task, onBack }: { task: GenTask; onBack: () => void }) {
  const [cases, setCases] = useState<CaseItem[]>(mockCases);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');

  const adoptedCount = cases.filter(c => c.adopted).length;
  const filtered = cases.filter(c =>
    !searchText || c.name.includes(searchText) || c.id.includes(searchText)
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const adoptSelected = () => {
    setCases(prev => prev.map(c => selected.has(c.id) ? { ...c, adopted: true } : c));
    setSelected(new Set());
  };

  const adoptAll = () => {
    setCases(prev => prev.map(c => ({ ...c, adopted: true })));
    setSelected(new Set());
  };

  const adoptOne = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, adopted: true } : c));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb + title */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          AI 生成记录
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-sm text-gray-800 font-medium">{task.requirement}</span>
        <span className="text-xs text-gray-400 ml-1 font-mono">{task.taskId}</span>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden px-6 py-5" style={{ scrollbarWidth: 'none' }}>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-5">
          {[
            { label: '全部', value: cases.length, color: 'text-gray-900' },
            { label: '已选', value: selected.size, color: 'text-blue-600' },
            { label: '已采纳', value: adoptedCount, color: 'text-green-600' },
            { label: '未采纳', value: cases.length - adoptedCount, color: 'text-orange-500' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <span className="text-xs text-gray-400">{s.label}</span>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="搜索用例名称"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <button
              onClick={adoptSelected}
              disabled={selected.size === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5" />
              采纳选中
            </button>
            <button
              onClick={adoptAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              全部采纳
            </button>
          </div>
        </div>

        {/* Cases table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={e => setSelected(e.target.checked ? new Set(filtered.map(c => c.id)) : new Set())}
                  />
                </th>
                {['用例编号', '用例名称', '前置条件', '测试步骤', '预期结果', '优先级', '状态', '操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${selected.has(c.id) ? 'bg-blue-50/40' : ''}`}>
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono text-blue-600">{c.id}</span>
                  </td>
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <span className="text-sm text-gray-900 line-clamp-2">{c.name}</span>
                  </td>
                  <td className="px-4 py-3.5 max-w-[130px]">
                    <span className="text-xs text-gray-500 line-clamp-2">{c.precondition}</span>
                  </td>
                  <td className="px-4 py-3.5 max-w-[150px]">
                    <span className="text-xs text-gray-500 line-clamp-2 whitespace-pre-line">{c.steps}</span>
                  </td>
                  <td className="px-4 py-3.5 max-w-[130px]">
                    <span className="text-xs text-gray-500 line-clamp-2">{c.expected}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {c.adopted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <Check className="w-3 h-3" />已采纳
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                        未采纳
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {!c.adopted && (
                        <button
                          onClick={() => adoptOne(c.id)}
                          className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                        >
                          采纳
                        </button>
                      )}
                      <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">
                        查看详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-400">共 {cases.length} 条用例，已采纳 {adoptedCount} 条</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">上一页</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">下一页</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main list view ─────────────────────────────────────────────────────────

export default function AiHistoryPage() {
  const [tasks, setTasks] = useState<GenTask[]>(mockTasks);
  const [statusFilter, setStatusFilter] = useState<'all' | GenTask['status']>('all');
  const [detailTask, setDetailTask] = useState<GenTask | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  if (detailTask) {
    return <TaskDetailView task={detailTask} onBack={() => setDetailTask(null)} />;
  }

  const filtered = statusFilter === 'all' ? tasks : tasks.filter(t => t.status === statusFilter);

  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const runningCount = tasks.filter(t => t.status === 'running').length;
  const failCount = tasks.filter(t => t.status === 'fail').length;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden px-6 py-5" style={{ scrollbarWidth: 'none' }}>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: '任务总数', value: totalCount, color: 'text-blue-600', bg: 'bg-blue-50', filter: 'all' as const },
          { label: '已完成', value: doneCount, color: 'text-green-600', bg: 'bg-green-50', filter: 'done' as const },
          { label: '进行中', value: runningCount, color: 'text-orange-500', bg: 'bg-orange-50', filter: 'running' as const },
          { label: '失败', value: failCount, color: 'text-red-500', bg: 'bg-red-50', filter: 'fail' as const },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.filter)}
            className={`bg-white border rounded-2xl px-5 py-4 text-left transition-all hover:shadow-sm ${statusFilter === s.filter ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200'}`}
          >
            <div className="text-xs text-gray-400 mb-1.5">{s.label}</div>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <option value="all">全部状态</option>
            <option value="done">已完成</option>
            <option value="running">进行中</option>
            <option value="fail">失败</option>
          </select>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
          刷新
        </button>

        <span className="ml-auto text-sm text-gray-400">
          共 <span className="font-medium text-gray-600">{filtered.length}</span> 条记录
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['序号', '任务 ID', '所属空间', '关联需求', '输出模式', '状态', '生成用例数', '生成时间', '操作'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((task, idx) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3.5 text-sm text-gray-400 tabular-nums">{idx + 1}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{task.taskId}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{task.workspace}</td>
                <td className="px-5 py-3.5 max-w-[200px]">
                  <span className="text-sm text-gray-900 line-clamp-1">{task.requirement}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{task.outputMode}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-semibold ${task.count > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {task.count}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{task.createdAt}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDetailTask(task)}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      查看详情
                    </button>
                    {task.status === 'done' && (
                      <button className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors">
                        全部采纳
                      </button>
                    )}
                    {task.status === 'fail' && (
                      <button className="flex items-center gap-0.5 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                        <RotateCcw className="w-3 h-3" />
                        重新生成
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors opacity-0 group-hover:opacity-100"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">暂无符合条件的记录</p>
          </div>
        )}

        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-400">共 {filtered.length} 条 / 1 页，每页 20 条</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

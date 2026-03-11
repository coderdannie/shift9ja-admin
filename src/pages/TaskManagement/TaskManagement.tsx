import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Filter, Download, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import TaskTabs from '../../Modules/TaskManagement/TaskTabs';
import type { TaskTabType } from '../../Modules/TaskManagement/TaskTabs';
import TaskTable from '../../Modules/TaskManagement/TaskTable';
import type { Task, TaskStatus } from '../../Modules/TaskManagement/TaskTable';
import UserStatsBar from '../../Modules/UserManagement/UserStatsBar';
import { Toaster } from 'react-hot-toast';

const TASKS_PER_PAGE = 6;

const MOCK_TASKS: Task[] = [
  { id: 't1', title: "Inspect my parents' house", city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo' },
  { id: 't2', title: 'Check if the shop is real', city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo' },
  { id: 't3', title: 'Deliver my document', city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo' },
  { id: 't4', title: 'Buy groceries for grandma', city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo' },
  { id: 't5', title: 'Inspect my friends house', city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo' },
  { id: 't6', title: 'Help pickup my package', city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo' },
  { id: 't7', title: 'Move furniture to new apartment', city: 'Lagos', status: 'open', price: 12000, client: 'Amara Okonkwo', helper: null },
  { id: 't8', title: 'Fix kitchen sink', city: 'Abuja', status: 'open', price: 8000, client: 'Emeka Nwosu', helper: null },
  { id: 't9', title: 'Pick up dry cleaning', city: 'Kano', status: 'open', price: 3000, client: 'Fatima Bello', helper: null },
  { id: 't10', title: 'Paint the living room', city: 'Lagos', status: 'completed', price: 35000, client: 'Biodun Adeleke', helper: 'Chioma James' },
  { id: 't11', title: 'Tutor my child in math', city: 'Ibadan', status: 'completed', price: 10000, client: 'Seun Adedayo', helper: 'Kola Abiodun' },
  { id: 't12', title: 'Repair air conditioner', city: 'Enugu', status: 'disputed', price: 25000, client: 'Ngozi Eze', helper: 'Yusuf Garba' },
  { id: 't13', title: 'Deliver birthday cake', city: 'Lagos', status: 'disputed', price: 6000, client: 'Amara Okonkwo', helper: 'Chioma James' },
];

const TAB_STATUS_MAP: Record<TaskTabType, TaskStatus> = {
  open: 'open',
  in_progress: 'in_progress',
  completed: 'completed',
  disputed: 'disputed',
};

const stats = [
  { title: 'Total Tasks Posted', value: '12,842', icon: ClipboardList },
  { title: 'Active Tasks', value: '9,306', icon: Clock },
  { title: 'Tasks in Progress', value: '8,621', icon: CheckCircle },
  { title: 'Tasks in Dispute', value: '3', icon: AlertTriangle },
];

const TaskManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TaskTabType>('in_progress');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab: TaskTabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch('');
  };

  const filtered = useMemo(() =>
    MOCK_TASKS.filter((t) =>
      t.status === TAB_STATUS_MAP[activeTab] &&
      (t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.city.toLowerCase().includes(search.toLowerCase()) ||
        t.client.toLowerCase().includes(search.toLowerCase()))
    ), [activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TASKS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * TASKS_PER_PAGE, currentPage * TASKS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828]">Task Management</h1>
          <p className="text-[#475467] text-sm mt-1">View and manage all tasks across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button label="Filter" variant="outline" fullWidth={false} className="!h-10 border-[#F2F4F7]" icon={<Filter size={18} />} />
          <Button label="Export Data" variant="primary" fullWidth={false} className="!h-10 px-6" icon={<Download size={18} />} />
        </div>
      </div>

      {/* Stats */}
      <UserStatsBar stats={stats} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]" size={18} />
        <input
          type="text"
          placeholder="Search task"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full h-12 pl-12 pr-4 rounded-full border border-[#F2F4F7] bg-white text-[#101828] placeholder:text-[#98A2B3] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
      </div>

      {/* Tabs */}
      <TaskTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* Table */}
      <TaskTable
        tasks={paginated}
        onView={(task) => navigate(`/task-management/${task.id}`)}
      />

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default TaskManagement;

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Filter, Download, Search } from "lucide-react";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import TaskTabs from "../../components/Modules/TaskManagement/TaskTabs.tsx";
import type { TaskTabType } from "../../components/Modules/TaskManagement/TaskTabs.tsx";
import TaskTable from "../../components/Modules/TaskManagement/TaskTable.tsx";
import CancelTaskModal from "../../components/Modules/TaskManagement/CancelTaskModal.tsx";
import UserStatsBar from "../../components/Modules/UserManagement/UserStatsBar.tsx";
import { Toaster } from "react-hot-toast";
import {
  useGetTaskStats,
  useGetTasks,
  useCancelTask,
} from "../../services/query/taskMgt";
import type { TaskItem, TaskStatus } from "../../types/index.ts";

const TASKS_PER_PAGE = 10;

const TAB_STATUS_MAP: Record<TaskTabType, TaskStatus | ""> = {
  open: "open",
  assigned: "assigned",
  in_progress: "in_progress",
  completed: "completed",
  disputed: "disputed",
  paid: "paid",
  cancelled: "cancelled",
};

const TaskManagement: React.FC = () => {
  const navigate = useNavigate();
  const { data: taskStats, isPending: isLoadingStats } = useGetTaskStats();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TaskTabType>("open");
  const [search, setSearch] = useState("");

  // Cancel modal state
  const [taskToCancel, setTaskToCancel] = useState<TaskItem | null>(null);
  const { mutate: cancelTask, isPending: isCancelling } = useCancelTask();

  const { data: tasksData, isPending: isLoadingTasks } = useGetTasks({
    page: currentPage,
    limit: TASKS_PER_PAGE,
    status: TAB_STATUS_MAP[activeTab],
    search,
  });

  const tasks = tasksData?.data?.items || [];
  const meta = tasksData?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  const statsData = taskStats?.data;
  const stats = useMemo(
    () => [
      {
        title: "Total Tasks",
        value: statsData?.totalTasks?.toLocaleString() || "0",
        icon: ClipboardList,
      },
      {
        title: "Open Tasks",
        value: statsData?.openTasks?.toLocaleString() || "0",
        icon: Clock,
      },
      {
        title: "Tasks in Progress",
        value: statsData?.taskInProgress?.toLocaleString() || "0",
        icon: CheckCircle,
      },
      {
        title: "Tasks in Dispute",
        value: statsData?.tasksInDispute?.toLocaleString() || "0",
        icon: AlertTriangle,
      },
    ],
    [statsData],
  );

  const handleTabChange = (tab: TaskTabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCancelConfirm = (reason: string) => {
    if (!taskToCancel) return;
    cancelTask(
      { uuid: taskToCancel.uuid, reason },
      {
        onSuccess: () => setTaskToCancel(null),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Toaster position="top-right" />

      {/* Cancel Modal */}
      <CancelTaskModal
        isOpen={!!taskToCancel}
        taskTitle={taskToCancel?.title}
        onClose={() => setTaskToCancel(null)}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828]">
            Task Management
          </h1>
          <p className="text-[#475467] text-sm mt-1">
            View and manage all tasks across the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            label="Filter"
            variant="outline"
            fullWidth={false}
            className="!h-10 border-[#F2F4F7]"
            icon={<Filter size={18} />}
          />
          <Button
            label="Export Data"
            variant="primary"
            fullWidth={false}
            className="!h-10 px-6"
            icon={<Download size={18} />}
          />
        </div>
      </div>

      {/* Stats */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <UserStatsBar stats={stats} />
      )}

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
          size={18}
        />
        <input
          type="text"
          placeholder="Search task"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full h-12 pl-12 pr-4 rounded-full border border-[#F2F4F7] bg-white text-[#101828] placeholder:text-[#98A2B3] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
      </div>

      {/* Tabs */}
      <TaskTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* Table */}
      <TaskTable
        tasks={tasks}
        isLoading={isLoadingTasks}
        onView={(task) => navigate(`/task-management/${task.uuid}`)}
        onCancel={(task) => setTaskToCancel(task)}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TaskManagement;

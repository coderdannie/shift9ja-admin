import React from "react";
import { Eye, XCircle, Copy } from "lucide-react";
import toast from "react-hot-toast";
import CustomTable from "../../common/CustomTable.tsx";

import type { TaskItem, TaskStatus } from "../../../types/index.ts";

const statusConfig: Record<
  TaskStatus,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  open: {
    label: "Open",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  assigned: {
    label: "Assigned",
    dot: "bg-indigo-500",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  in_progress: {
    label: "In progress",
    dot: "bg-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  disputed: {
    label: "Disputed",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-gray-500",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  paid: {
    label: "Paid",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

const CANCELLABLE_STATUSES: TaskStatus[] = ["open", "assigned", "in_progress"];

const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const s = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const TASK_HEADERS = [
  "Task Title",
  "City",
  "Status",
  "Budget",
  "Client",
  "Helper",
  "Actions",
];

interface TaskTableProps {
  tasks: TaskItem[];
  isLoading?: boolean;
  onView: (task: TaskItem) => void;
  onCancel?: (task: TaskItem) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading = false,
  onView,
  onCancel,
}) => (
  <CustomTable headers={TASK_HEADERS} isLoading={isLoading}>
    {tasks.length === 0 && !isLoading ? (
      <tr>
        <td
          colSpan={TASK_HEADERS.length}
          className="px-6 py-16 text-center text-[#98A2B3] text-sm font-medium"
        >
          No tasks found.
        </td>
      </tr>
    ) : (
      tasks.map((task) => (
        <tr key={task.uuid} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 max-w-[240px]">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[#101828] font-semibold truncate hover:text-primary cursor-pointer transition-colors"
                title={task.title}
                onClick={() => onView(task)}
              >
                {task.title}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#98A2B3] font-mono group/uuid">
                <span className="truncate max-w-[140px]" title={task.uuid}>
                  {task.uuid}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(task.uuid);
                    toast.success("Task UUID copied");
                  }}
                  className="hover:text-primary transition-colors p-0.5 text-[#98A2B3]"
                  title={`Copy: ${task.uuid}`}
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-[#475467] whitespace-nowrap">
            {task.location?.city || "N/A"}
          </td>
          <td className="px-6 py-4">
            <TaskStatusBadge status={task.status} />
          </td>
          <td className="px-6 py-4 text-[#475467] font-medium whitespace-nowrap">
            #{Number(task.budget).toLocaleString()}
          </td>
          <td className="px-6 py-4 text-[#475467] whitespace-nowrap">
            {task.client
              ? `${task.client.firstName} ${task.client.lastName}`
              : "N/A"}
          </td>
          <td className="px-6 py-4 text-[#475467] whitespace-nowrap">
            {task.helper ? (
              `${task.helper.firstName} ${task.helper.lastName}`
            ) : (
              <span className="text-[#D0D5DD] italic font-normal">
                Unassigned
              </span>
            )}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onView(task)}
                className="flex items-center gap-1.5 text-primary hover:text-green-700 font-semibold text-sm transition-colors"
              >
                <Eye size={16} />
                View
              </button>
              {onCancel && CANCELLABLE_STATUSES.includes(task.status) && (
                <button
                  onClick={() => onCancel(task)}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              )}
            </div>
          </td>
        </tr>
      ))
    )}
  </CustomTable>
);

export default TaskTable;

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  User,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  ExternalLink,
  Download,
  Tag,
} from "lucide-react";
import { PRIVATE_PATHS } from "../../routes/constants";
import Button from "../../components/common/Button";

import { useGetTaskDetails } from "../../services/query/taskMgt";
import { format } from "date-fns";

const statusConfig: Record<
  string,
  {
    label: string;
    dot: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ReactNode;
  }
> = {
  open: {
    label: "Open",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: <Clock size={14} />,
  },
  assigned: {
    label: "In Progress",
    dot: "bg-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    icon: <Clock size={14} />,
  },
  completed: {
    label: "Completed",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: <CheckCircle size={14} />,
  },
  disputed: {
    label: "Disputed",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: <AlertTriangle size={14} />,
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-gray-500",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: <AlertTriangle size={14} />,
  },
  paid: {
    label: "Paid",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: <CheckCircle size={14} />,
  },
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-3.5 border-b border-[#F2F4F7] last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg text-nowrap">
    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600 border border-green-100">
      {icon}
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider">
        {label}
      </span>
      <div className="text-[#101828] font-semibold text-sm leading-tight">
        {value}
      </div>
    </div>
  </div>
);

const ParticipantCard: React.FC<{
  title: string;
  user: any | null;
  roleLabel?: string;
}> = ({ title, user, roleLabel }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h2 className="text-base font-bold text-[#101828]">{title}</h2>
      {user?.isEmailVerified && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
          <CheckCircle size={10} /> VERIFIED
        </span>
      )}
    </div>
    {user ? (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary/10 p-0.5">
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=10B981`
              }
              alt={user.firstName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-[#101828] text-sm">
              {user.firstName} {user.lastName}
            </p>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                user.status === "ACTIVE"
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-gray-50 text-gray-700 border-gray-100"
              }`}
            >
              {user.status || roleLabel}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-[#475467]">
            <User size={14} className="text-gray-400" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#475467]">
            <MapPin size={14} className="text-gray-400" />
            <span>{user.phoneNumber || "No phone number"}</span>
          </div>
          {user.lastSeen && (
            <p className="text-[10px] text-[#98A2B3] font-medium">
              Last active: {safeFormat(user.lastSeen, "MMM dd, yyyy")}
            </p>
          )}
        </div>
      </div>
    ) : (
      <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
        <Users size={24} className="text-gray-300 mb-2" />
        <p className="text-gray-400 text-xs font-semibold">
          No {title.toLowerCase()} assigned
        </p>
      </div>
    )}
  </div>
);

const safeFormat = (dateStr: string | null | undefined, formatStr: string) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return format(date, formatStr);
  } catch (error) {
    return "N/A";
  }
};

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: taskData, isPending: isLoading } = useGetTaskDetails(id || "");

  const task = taskData?.data;

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl animate-pulse">
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
        <div className="h-40 bg-gray-100 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-48 bg-gray-100 rounded-2xl"></div>
          <div className="h-48 bg-gray-100 rounded-2xl"></div>
        </div>
        <div className="h-[400px] bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#475467]">
        <AlertTriangle size={48} className="text-gray-300" />
        <p className="text-lg font-semibold">Task not found.</p>
        <Button
          label="Back to Task Feed"
          fullWidth={false}
          onClick={() => navigate(PRIVATE_PATHS.TASK_MANAGEMENT)}
        />
      </div>
    );
  }

  const status = statusConfig[task.status] ?? statusConfig.open;
  const taskShortId = String(task.uuid || "")
    .split("-")[0]
    .toUpperCase();

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <Link
        to={PRIVATE_PATHS.TASK_MANAGEMENT}
        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all w-fit"
      >
        <ArrowLeft size={18} />
        Back to Tasks
      </Link>

      {/* Header section */}
      <div className="bg-white p-8 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${status.bg} ${status.text} ${status.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className="text-xs text-[#98A2B3] font-medium tracking-tight">
              #{taskShortId}
            </span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wide">
              Posted {safeFormat(task.createdAt, "MMM dd, yyyy")}
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-[#101828] leading-tight">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-[#475467]">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={16} className="text-primary" /> {task.location?.streetAddress || task.location?.city || "Remote"}
            </span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="flex items-center gap-1.5 font-medium">
              <Tag size={16} className="text-primary" /> {task.category || "Uncategorized"}
            </span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={16} className="text-primary" /> Due{" "}
              {safeFormat(task.dueDate, "MMM dd, yyyy")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 bg-primary/5 rounded-2xl border border-primary/10 text-center min-w-[140px]">
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
              Budget
            </p>
            <p className="text-2xl font-black text-primary">
              ₦{Number(task.budget || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ParticipantCard
          title="Client"
          user={task.client}
          roleLabel="Requester"
        />
        <ParticipantCard
          title="Helper"
          user={task.helper}
          roleLabel="Provider"
        />
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#101828] mb-3 flex items-center gap-2">
              <ClipboardList size={20} className="text-primary" />
              Description & Notes
            </h2>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <p className="text-[#475467] text-sm leading-relaxed whitespace-pre-wrap">
                {task.clientNote || "No client notes provided."}
              </p>
            </div>
          </div>

          {task.instruction && (
            <div>
              <h3 className="text-sm font-bold text-[#101828] mb-2 uppercase tracking-wide">
                Special Instructions
              </h3>
              <p className="text-[#475467] text-sm">{task.instruction}</p>
            </div>
          )}

          {task.imageUrls && task.imageUrls.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#101828] mb-4 uppercase tracking-wide">
                Attached Evidence ({task.imageUrls.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {task.imageUrls.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-100 group relative shadow-sm transition-all hover:ring-2 hover:ring-primary"
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Task detail ${i}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <button
                        onClick={() => window.open(img.imageUrl, "_blank")}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-xl text-white backdrop-blur-md border border-white/20 transition-all active:scale-90"
                        title="View Image"
                      >
                        <ExternalLink size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleDownload(
                            img.imageUrl,
                            `evidence-${String(task.uuid).split("-")[0]}-${i}`,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-xl text-white backdrop-blur-md border border-white/20 transition-all active:scale-90"
                        title="Download Image"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {(task.completionProof || task.completionNote) && (
          <div className="bg-white p-8 rounded-3xl border border-[#F2F4F7] shadow-sm border-t-[6px] border-t-green-500">
            <h2 className="text-lg font-bold text-[#101828] mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Completion & Delivery
            </h2>
            <div className="flex flex-col gap-6">
              {task.completionNote && (
                <div className="bg-green-50/30 p-4 rounded-xl border border-green-100">
                  <p className="text-green-900 text-sm font-medium mb-1 uppercase text-[10px] tracking-wide">
                    Helper Note:
                  </p>
                  <p className="text-[#475467] text-sm">
                    {task.completionNote}
                  </p>
                </div>
              )}
              {task.completionProof && (
                <div>
                  <p className="text-[#101828] text-sm font-bold mb-3">
                    Completion Proof
                  </p>
                  <div className="group relative w-48 aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:ring-2 hover:ring-green-500">
                    <img
                      src={task.completionProof}
                      alt="Proof"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          window.open(task.completionProof, "_blank")
                        }
                        className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md border border-white/20 transition-all active:scale-90"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDownload(
                            task.completionProof,
                            `proof-${String(task.uuid).split("-")[0]}`,
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md border border-white/20 transition-all active:scale-90"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {task.dispute && (
          <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 flex items-start gap-5 shadow-sm">
            <div className="bg-red-100 p-3 rounded-2xl shrink-0">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-red-800 text-lg">
                Active Dispute Detected
              </h3>
              <p className="text-red-700/80 text-sm max-w-lg">
                Reason:{" "}
                <span className="font-bold">"{task.dispute.reason}"</span>. This
                task was disputed on{" "}
                {safeFormat(task.dispute.createdAt, "MMM dd, yyyy")}.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Link
                  to={`${PRIVATE_PATHS.DISPUTE_REPORTS}/${task.dispute.uuid}`}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  Review Dispute
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { PRIVATE_PATHS } from "../../routes/constants";
import { useGetDisputeDetails } from "../../services/query/dispute";
import { useResolveDispute } from "../../services/query/taskMgt";
import { format } from "date-fns";
import MediationChat from "../../components/Modules/DisputeReports/MediationChat";
import ResolveDisputeModal from "../../components/Modules/DisputeReports/ResolveDisputeModal";
import { toast, Toaster } from "react-hot-toast";
import type { ResolveDisputePayload } from "../../types/task";

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-3 border-b border-[#F2F4F7] last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg">
    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 text-primary border border-primary/10">
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

const DisputeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: disputeData, isPending: isLoading } = useGetDisputeDetails(
    id || "",
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const { mutate: resolveDispute, isPending: isResolving } = useResolveDispute();

  const handleResolve = (payload: ResolveDisputePayload) => {
    if (!dispute?.task?.uuid) return;
    
    resolveDispute(
      { uuid: dispute.task.uuid, payload },
      {
        onSuccess: () => {
          toast.success("Dispute resolved successfully!");
          setIsModalOpen(false);
          navigate(PRIVATE_PATHS.DISPUTE_REPORTS);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to resolve dispute");
        },
      }
    );
  };


  const dispute = disputeData?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-6xl animate-pulse p-6">
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="h-40 bg-gray-100 rounded-2xl"></div>
            <div className="h-40 bg-gray-100 rounded-2xl"></div>
          </div>
          <div className="lg:col-span-2 h-[600px] bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#475467]">
        <AlertTriangle size={48} className="text-gray-300" />
        <p className="text-lg font-semibold">Dispute record not found.</p>
        <button
          onClick={() => navigate(PRIVATE_PATHS.DISPUTE_REPORTS)}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
        >
          Back to Disputes
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Link
          to={PRIVATE_PATHS.DISPUTE_REPORTS}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Disputes
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border bg-blue-50 text-blue-700 border-blue-100`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            {dispute.status.replace("_", " ")}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
              dispute.priority === "urgent"
                ? "bg-red-50 text-red-700 border-red-100"
                : "bg-gray-50 text-gray-700 border-gray-100"
            }`}
          >
            {dispute.priority} Priority
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={dispute.status === 'resolved' || dispute.status === 'closed'}
            className="ml-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20"
          >
            Resolve Dispute
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Context (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Dispute Context Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm">
            <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-primary" />
              Dispute Context
            </h2>
            <div className="flex flex-col gap-1">
              <InfoRow
                icon={<ClipboardList size={16} />}
                label="Category"
                value={dispute.category}
              />
              <InfoRow
                icon={<Clock size={16} />}
                label="Opened At"
                value={format(
                  new Date(dispute.createdAt),
                  "MMM dd, yyyy HH:mm",
                )}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider mb-2">
                  Detailed Reason
                </p>
                <p className="text-[#475467] text-sm leading-relaxed">
                  {dispute.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Task Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm">
            <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Task Information
            </h2>
            <div className="flex flex-col gap-1">
              <InfoRow
                icon={<ArrowLeft size={16} />}
                label="Title"
                value={dispute.task.title}
              />
              <InfoRow
                icon={<CheckCircle size={16} />}
                label="Task Status"
                value={dispute.task.status}
              />
              <button
                onClick={() =>
                  navigate(
                    PRIVATE_PATHS.TASK_DETAIL.replace(":id", dispute.task.uuid),
                  )
                }
                className="mt-4 w-full py-2.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/10 transition-all active:scale-95"
              >
                View Full Task Details
              </button>
            </div>
          </div>

          {/* Reporter Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm">
            <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Raised By
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {dispute.reporter.firstName[0]}
                {dispute.reporter.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-[#101828]">
                  {dispute.reporter.firstName} {dispute.reporter.lastName}
                </p>
                <p className="text-[10px] font-bold text-primary uppercase">
                  {dispute.reporter.activeRole}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mediation Chat (8/12) */}
        <div className="lg:col-span-8 h-[750px] bg-white rounded-2xl border border-[#F2F4F7] shadow-xl overflow-hidden flex flex-col">
          <MediationChat disputeUuid={dispute.uuid} />
        </div>
      </div>

      <ResolveDisputeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResolve={handleResolve}
        isLoading={isResolving}
      />
      <Toaster position="top-right" />
    </div>

  );
};

export default DisputeDetail;

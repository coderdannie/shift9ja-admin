import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, User, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { PRIVATE_PATHS } from '../../routes/constants';
import Button from '../../components/common/Button';

const MOCK_TASKS: Record<string, {
  id: string; title: string; city: string; status: string;
  price: number; client: string; helper: string | null;
  description: string; createdAt: string;
}> = {
  't1': { id: 't1', title: "Inspect my parents' house", city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo', description: 'I need someone to inspect my parents house and give me a detailed report.', createdAt: '2026-03-08' },
  't2': { id: 't2', title: 'Check if the shop is real', city: 'Ibadan', status: 'in_progress', price: 5500, client: 'Seun Adedayo', helper: 'Seun Adedayo', description: 'Verify that the shop exists and is operational before I make a payment.', createdAt: '2026-03-07' },
  't12': { id: 't12', title: 'Repair air conditioner', city: 'Enugu', status: 'disputed', price: 25000, client: 'Ngozi Eze', helper: 'Yusuf Garba', description: 'AC repair that went wrong — client says the work was not done properly.', createdAt: '2026-03-05' },
};

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  open: { label: 'Open', dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Clock size={14} /> },
  in_progress: { label: 'In Progress', dot: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: <Clock size={14} /> },
  completed: { label: 'Completed', dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <CheckCircle size={14} /> },
  disputed: { label: 'Disputed', dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <AlertTriangle size={14} /> },
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-[#F2F4F7] last:border-0">
    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600">{icon}</div>
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-[#98A2B3] font-medium uppercase tracking-wide">{label}</span>
      <span className="text-[#101828] font-semibold text-sm">{value}</span>
    </div>
  </div>
);

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const task = id ? MOCK_TASKS[id] : null;

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#475467]">
        <p className="text-lg font-semibold">Task not found.</p>
        <Button label="Back to Tasks" fullWidth={false} onClick={() => navigate(PRIVATE_PATHS.TASK_MANAGEMENT)} />
      </div>
    );
  }

  const status = statusConfig[task.status] ?? statusConfig.open;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        to={PRIVATE_PATHS.TASK_MANAGEMENT}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all w-fit"
      >
        <ArrowLeft size={18} />
        Back to Task Management
      </Link>

      {/* Header card */}
      <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[20px] font-bold text-[#101828] leading-tight">{task.title}</h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${status.bg} ${status.text} ${status.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
        <p className="text-[#475467] text-sm leading-relaxed">{task.description}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm">
          <h2 className="text-base font-bold text-[#101828] mb-2">Task Details</h2>
          <InfoRow icon={<MapPin size={16} />} label="City" value={task.city} />
          <InfoRow icon={<DollarSign size={16} />} label="Price" value={`#${task.price.toLocaleString()}`} />
          <InfoRow icon={<Clock size={16} />} label="Created" value={task.createdAt} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm">
          <h2 className="text-base font-bold text-[#101828] mb-2">Participants</h2>
          <InfoRow icon={<User size={16} />} label="Client" value={task.client} />
          <InfoRow icon={<Users size={16} />} label="Helper" value={task.helper ?? <span className="text-[#D0D5DD] italic">Unassigned</span>} />
        </div>
      </div>

      {task.status === 'disputed' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-red-700 text-sm">This task is under dispute</p>
            <p className="text-red-600 text-xs mt-0.5">Review the claim and resolve it from the Dispute & Reports section.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

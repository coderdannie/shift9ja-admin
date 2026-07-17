import React, { useState } from "react";
import {
  Play,
  Square,
  Zap,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  useGetCronJobs,
  useStartCronJob,
  useStopCronJob,
  useTriggerCronJob,
} from "../../services/query/cronMgt";
import type { CronJob } from "../../types/cron";

// ── helpers ────────────────────────────────────────────────────────────────

const formatJobName = (name: string) =>
  name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatDate = (iso: string | null) => {
  if (!iso) return "N/A";
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
};

// ── Confirm Modal ──────────────────────────────────────────────────────────

interface ConfirmModalProps {
  job: CronJob | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  job,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Trigger Cron Job Manually?
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          You are about to immediately run{" "}
          <span className="font-semibold">{formatJobName(job.name)}</span>. This
          may execute heavy operations such as sending emails or running database
          queries.
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Zap size={14} />
            )}
            Yes, Trigger Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Row ────────────────────────────────────────────────────────────────────

interface RowProps {
  job: CronJob;
  onTriggerClick: (job: CronJob) => void;
  startingName: string | null;
  stoppingName: string | null;
}

const CronJobRow: React.FC<RowProps> = ({
  job,
  onTriggerClick,
  startingName,
  stoppingName,
}) => {
  const { mutate: start } = useStartCronJob();
  const { mutate: stop } = useStopCronJob();

  const isStarting = startingName === job.name;
  const isStopping = stoppingName === job.name;
  const isBusy = isStarting || isStopping;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors group">
      {/* Name */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-gray-900">
            {formatJobName(job.name)}
          </span>
          <code className="text-xs text-gray-400 font-mono">{job.name}</code>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            job.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          {job.isActive ? (
            <CheckCircle size={11} />
          ) : (
            <XCircle size={11} />
          )}
          {job.isActive ? "Active" : "Stopped"}
        </span>
      </td>

      {/* Last Execution */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock size={13} className="text-gray-400 shrink-0" />
          {formatDate(job.lastDate)}
        </div>
      </td>

      {/* Next Execution */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          {formatDate(job.nextDate)}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Start / Stop toggle */}
          {job.isActive ? (
            <button
              id={`stop-${job.name}`}
              onClick={() => stop(job.name)}
              disabled={isBusy}
              title="Stop job"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {isStopping ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Square size={12} />
              )}
              Stop
            </button>
          ) : (
            <button
              id={`start-${job.name}`}
              onClick={() => start(job.name)}
              disabled={isBusy}
              title="Start job"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              {isStarting ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              Start
            </button>
          )}

          {/* Trigger manually */}
          <button
            id={`trigger-${job.name}`}
            onClick={() => onTriggerClick(job)}
            disabled={isBusy}
            title="Trigger immediately"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <Zap size={12} />
            Trigger
          </button>
        </div>
      </td>
    </tr>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────

const CronJobManagement: React.FC = () => {
  const { data, isPending, isError, refetch, isFetching } = useGetCronJobs();
  const { mutate: triggerJob, isPending: isTriggering } = useTriggerCronJob();
  const { isPending: isStarting, variables: startingVar } = useStartCronJob();
  const { isPending: isStopping, variables: stoppingVar } = useStopCronJob();

  const [jobToTrigger, setJobToTrigger] = useState<CronJob | null>(null);

  const jobs: CronJob[] = data?.data ?? [];
  const activeCount = jobs.filter((j) => j.isActive).length;
  const stoppedCount = jobs.filter((j) => !j.isActive).length;

  const handleConfirmTrigger = () => {
    if (!jobToTrigger) return;
    triggerJob(jobToTrigger.name, { onSettled: () => setJobToTrigger(null) });
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cron Job Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and control background scheduled tasks.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw
            size={15}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Total Jobs
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{jobs.length}</p>
        </div>
        <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">
            Active
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {activeCount}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Stopped
          </p>
          <p className="text-2xl font-bold text-gray-500 mt-1">
            {stoppedCount}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <RefreshCw size={28} className="animate-spin" />
            <span className="text-sm">Loading cron jobs…</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
            <XCircle size={28} />
            <span className="text-sm">Failed to load cron jobs.</span>
            <button
              onClick={() => refetch()}
              className="text-xs text-primary underline"
            >
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <Clock size={28} />
            <span className="text-sm">No cron jobs found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Job Name
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Last Execution
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Next Execution
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <CronJobRow
                    key={job.name}
                    job={job}
                    onTriggerClick={setJobToTrigger}
                    startingName={isStarting ? (startingVar as string) : null}
                    stoppingName={isStopping ? (stoppingVar as string) : null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm trigger modal */}
      <ConfirmModal
        job={jobToTrigger}
        onConfirm={handleConfirmTrigger}
        onCancel={() => setJobToTrigger(null)}
        isLoading={isTriggering}
      />
    </div>
  );
};

export default CronJobManagement;

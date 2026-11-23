import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ShieldX,
  RefreshCw,
  Fingerprint,
  Globe,
  Briefcase,
  Megaphone,
  Mail,
  Phone,
  ExternalLink,
  AlertOctagon,
  ArrowRight,
} from "lucide-react";
import Drawer from "../../common/Drawer";
import type { QuarantinedReferralItem, ReferralParty } from "../../../types/marketing";
import { useResolveQuarantine } from "../../../services/query/marketing";
import { PRIVATE_PATHS } from "../../../routes/constants";
import { formatDate, formatNaira, fullName } from "./marketingHelpers";

interface Props {
  referral: QuarantinedReferralItem | null;
  onClose: () => void;
}

const PartyCard: React.FC<{ role: string; party: ReferralParty; accent: string }> = ({ role, party, accent }) => (
  <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50/60 p-4 min-w-0">
    <p className={`text-[10px] font-bold uppercase tracking-wider ${accent}`}>{role}</p>
    <div className="flex items-center gap-2.5 mt-2">
      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
        {party?.firstName?.[0] ?? "?"}
        {party?.lastName?.[0] ?? ""}
      </div>
      <p className="text-sm font-semibold text-gray-900 truncate">{fullName(party)}</p>
    </div>
    <div className="mt-3 space-y-1.5 text-xs text-gray-600">
      <p className="flex items-center gap-1.5 truncate">
        <Mail size={12} className="text-gray-400 shrink-0" />
        <span className="truncate">{party?.email || "—"}</span>
      </p>
      <p className="flex items-center gap-1.5">
        <Phone size={12} className="text-gray-400 shrink-0" />
        {party?.phoneNumber || "—"}
      </p>
    </div>
  </div>
);

const InfoRow: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode }> = ({
  icon: Icon,
  label,
  children,
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
    <div className="p-1.5 rounded-lg bg-gray-100 text-gray-500 shrink-0">
      <Icon size={14} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="text-sm text-gray-900 mt-0.5 break-words">{children}</div>
    </div>
  </div>
);

const ResolveQuarantineDrawer: React.FC<Props> = ({ referral, onClose }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [pendingAction, setPendingAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const { mutate: resolve, isPending } = useResolveQuarantine();

  useEffect(() => {
    setNotes("");
    setPendingAction(null);
  }, [referral?.uuid]);

  const handleResolve = (action: "APPROVE" | "REJECT") => {
    if (!referral) return;
    setPendingAction(action);
    resolve(
      { uuid: referral.uuid, payload: { action, notes: notes.trim() || undefined } },
      {
        onSuccess: onClose,
        onSettled: () => setPendingAction(null),
      },
    );
  };

  return (
    <Drawer isOpen={!!referral} onClose={onClose} title="Review Quarantined Referral" size="lg">
      {referral && (
        <div className="space-y-6">
          {/* Reason banner */}
          <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600 shrink-0">
              <AlertOctagon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Trigger Reason</p>
              <p className="text-sm text-gray-900 mt-1">{referral.fraudReason || "No reason recorded."}</p>
              <p className="text-[11px] text-gray-500 mt-2">
                Flagged {formatDate(referral.updatedAt, true)} • Code{" "}
                <code className="font-mono bg-white border border-gray-200 px-1 rounded">{referral.codeUsed}</code>
              </p>
            </div>
          </div>

          {/* Parties */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <PartyCard role="Referrer" party={referral.referrer} accent="text-sky-600" />
            <div className="hidden sm:flex items-center text-gray-300">
              <ArrowRight size={18} />
            </div>
            <PartyCard role="Referee (Client)" party={referral.referee} accent="text-violet-600" />
          </div>

          {/* Signals */}
          <div className="rounded-xl border border-gray-100 px-4">
            <InfoRow icon={Fingerprint} label="Device Fingerprint">
              <code className="font-mono text-xs">{referral.deviceFingerprint || "—"}</code>
            </InfoRow>
            <InfoRow icon={Globe} label="IP Address">
              <code className="font-mono text-xs">{referral.ipAddress || "—"}</code>
            </InfoRow>
            <InfoRow icon={Briefcase} label="Qualifying Task">
              {referral.qualifyingTask ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{referral.qualifyingTask.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatNaira(referral.qualifyingTask.budget)} •{" "}
                      <span className="capitalize">{referral.qualifyingTask.status}</span>
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(PRIVATE_PATHS.TASK_DETAIL.replace(":id", referral.qualifyingTask!.uuid))
                    }
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#E7F3EC] shrink-0"
                    title="Open task"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              ) : (
                <span className="text-gray-400">No qualifying task yet</span>
              )}
            </InfoRow>
            <InfoRow icon={Megaphone} label="Campaign">
              {referral.campaign?.name || <span className="text-gray-400">Platform default</span>}
            </InfoRow>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <label htmlFor="quarantine-notes" className="text-xs font-semibold text-gray-700">
              Resolution Notes
            </label>
            <textarea
              id="quarantine-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified client and referrer are separate business partners operating from a shared office."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-500">
              <p className="rounded-lg bg-emerald-50/70 p-2.5">
                <b className="text-emerald-700">Approve</b> returns the referral to <i>Pending Task</i> so it can
                settle legitimately.
              </p>
              <p className="rounded-lg bg-red-50/70 p-2.5">
                <b className="text-red-700">Reject</b> expires the referral permanently — no reward will be paid.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              id="quarantine-reject-btn"
              onClick={() => handleResolve("REJECT")}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {pendingAction === "REJECT" ? <RefreshCw size={15} className="animate-spin" /> : <ShieldX size={15} />}
              Reject & Expire
            </button>
            <button
              id="quarantine-approve-btn"
              onClick={() => handleResolve("APPROVE")}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-[#0F6E2F] disabled:opacity-50 shadow-sm transition-colors"
            >
              {pendingAction === "APPROVE" ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <ShieldCheck size={15} />
              )}
              Approve & Clear
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default ResolveQuarantineDrawer;

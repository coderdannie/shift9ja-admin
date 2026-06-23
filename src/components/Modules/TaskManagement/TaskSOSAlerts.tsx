import React, { useState } from "react";
import { useGetSOSAlerts, useResolveSOSAlert } from "../../../services/query/taskMgt";
import { AlertTriangle, CheckCircle, ShieldAlert, Volume2 } from "lucide-react";
import Button from "../../common/Button";
import { format } from "date-fns";

interface TaskSOSAlertsProps {
  taskUuid: string;
}

const TaskSOSAlerts: React.FC<TaskSOSAlertsProps> = ({ taskUuid }) => {
  const { data: alertsResponse, isPending } = useGetSOSAlerts({ taskUuid });
  const { mutate: resolveAlert, isPending: isResolving } = useResolveSOSAlert();
  
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const alerts = alertsResponse?.data || [];
  
  // Also filter locally just in case the backend didn't filter by taskUuid correctly
  const taskAlerts = alerts.filter(a => a.taskUuid === taskUuid);

  if (isPending) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-48 bg-red-200 rounded mb-4"></div>
        <div className="h-16 bg-red-100 rounded"></div>
      </div>
    );
  }

  if (taskAlerts.length === 0) {
    return null; // Don't show anything if there are no alerts
  }

  const activeAlerts = taskAlerts.filter(a => a.status === "active");
  const resolvedAlerts = taskAlerts.filter(a => a.status === "resolved");

  const handleResolve = (uuid: string) => {
    if (!resolutionNote.trim()) return;
    resolveAlert(
      { uuid, payload: { status: "resolved", resolutionNote } },
      {
        onSuccess: () => {
          setResolvingId(null);
          setResolutionNote("");
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {activeAlerts.map(alert => (
        <div key={alert.uuid} className="bg-red-50 border-2 border-red-500 shadow-lg rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200 shadow-sm animate-pulse">
                <ShieldAlert size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-red-700 uppercase tracking-wide">Emergency SOS Alert</h3>
                <p className="text-red-900/80 font-medium mt-1">
                  Triggered by <span className="font-bold">{alert.userName}</span> on {format(new Date(alert.createdAt), "MMM dd, yyyy h:mm a")}
                </p>
              </div>
            </div>
            <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm">
              Active
            </div>
          </div>

          {alert.audioUrl && (
            <div className="bg-white/60 p-4 rounded-xl border border-red-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Volume2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900 mb-2">Audio Evidence</p>
                <audio controls className="w-full h-10" src={alert.audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-5 border border-red-200 mt-2">
            {resolvingId === alert.uuid ? (
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-700">Resolution Note</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                  placeholder="Explain how this emergency was resolved..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                ></textarea>
                <div className="flex gap-3 justify-end mt-2">
                  <Button 
                    label="Cancel" 
                    variant="outline" 
                    fullWidth={false} 
                    onClick={() => setResolvingId(null)}
                    disabled={isResolving}
                  />
                  <Button 
                    label="Mark as Resolved" 
                    variant="primary" 
                    className="bg-red-600 hover:bg-red-700 border-none"
                    fullWidth={false} 
                    onClick={() => handleResolve(alert.uuid)}
                    disabled={isResolving || !resolutionNote.trim()}
                    isLoading={isResolving}
                  />
                </div>
              </div>
            ) : (
              <Button 
                label="Resolve Emergency" 
                variant="primary" 
                fullWidth={false}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 border-none"
                icon={<CheckCircle size={18} />}
                onClick={() => setResolvingId(alert.uuid)}
              />
            )}
          </div>
        </div>
      ))}

      {resolvedAlerts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldAlert size={18} className="text-gray-400" />
            Past SOS Alerts ({resolvedAlerts.length})
          </h3>
          <div className="flex flex-col gap-4">
            {resolvedAlerts.map(alert => (
              <div key={alert.uuid} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900 text-sm">
                    Triggered by {alert.userName}
                  </p>
                  <span className="bg-gray-200 text-gray-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Resolved</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {format(new Date(alert.createdAt), "MMM dd, yyyy h:mm a")}
                </p>
                {alert.resolutionNote && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700">
                    <span className="font-bold block mb-1 text-xs text-gray-500 uppercase">Resolution Note:</span>
                    {alert.resolutionNote}
                  </div>
                )}
                {alert.audioUrl && (
                  <div className="mt-3">
                    <audio controls className="w-full h-8" src={alert.audioUrl} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSOSAlerts;

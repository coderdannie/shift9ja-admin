import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  MapPin, 
  ExternalLink, 
  CheckCircle, 
  Search, 
  AlertTriangle,
  User,
  Briefcase,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useGetSOSAlerts, useResolveSOSAlert } from "../../services/query/taskMgt";
import { PRIVATE_PATHS } from "../../routes/constants";
import Button from "../../components/common/Button";
import StatCard from "../../components/Modules/Dashboard/StatCard";
import { format } from "date-fns";

const SOSAlerts: React.FC = () => {
  const { data: alertsResponse, isPending: isLoading } = useGetSOSAlerts();
  const { mutate: resolveAlert, isPending: isResolving } = useResolveSOSAlert();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "resolved">("all");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const alerts = useMemo(() => {
    return alertsResponse?.data || [];
  }, [alertsResponse]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = alerts.length;
    const active = alerts.filter((a) => a.status === "active").length;
    const resolved = alerts.filter((a) => a.status === "resolved").length;
    return { total, active, resolved };
  }, [alerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Tab filter
      if (activeTab === "active" && alert.status !== "active") return false;
      if (activeTab === "resolved" && alert.status !== "resolved") return false;

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesUser = alert.userName?.toLowerCase().includes(query);
        const matchesTask = alert.taskTitle?.toLowerCase().includes(query);
        const matchesNote = alert.resolutionNote?.toLowerCase().includes(query);
        return matchesUser || matchesTask || matchesNote;
      }

      return true;
    });
  }, [alerts, activeTab, searchQuery]);

  const handleResolve = (uuid: string) => {
    if (!resolutionNote.trim()) return;
    resolveAlert(
      { uuid, payload: { status: "resolved", resolutionNote } },
      {
        onSuccess: () => {
          setResolvingId(null);
          setResolutionNote("");
        },
      }
    );
  };

  const statCards = [
    {
      title: "Total SOS Alerts",
      value: stats.total,
      icon: ShieldAlert,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50/50 border border-indigo-100",
    },
    {
      title: "Active Emergencies",
      value: stats.active,
      icon: AlertCircle,
      color: "text-rose-600 animate-pulse",
      bgColor: "bg-rose-50/50 border border-rose-100",
      isLive: stats.active > 0,
    },
    {
      title: "Resolved Incidents",
      value: stats.resolved,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/50 border border-emerald-100",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#101828] tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-rose-600" size={32} />
            Safety & SOS Management
          </h1>
          <p className="text-[#475467] mt-1.5 text-sm max-w-2xl leading-relaxed">
            Real-time emergency monitoring and dispute safety control center. Investigate, review recorded audio evidence, view GPS coordinates, and resolve active alerts.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => <StatCard key={i} loading />)
        ) : (
          statCards.map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between border border-[#EAECF0] hover:shadow-md transition-all duration-300`}>
              <div className="flex flex-col gap-1">
                <span className="text-[#667085] text-xs font-semibold uppercase tracking-wider">{stat.title}</span>
                <span className="text-3xl font-black text-[#101828] flex items-center gap-2">
                  {stat.value}
                  {stat.isLive && (
                    <span className="flex h-3.5 w-3.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                    </span>
                  )}
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={26} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#EAECF0] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-[#F2F4F7] bg-white sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by helper name or task title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex p-1 bg-[#F9FAFB] rounded-xl border border-[#F2F4F7] shadow-inner self-start md:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-white text-[#101828] shadow-sm ring-1 ring-gray-100"
                  : "text-[#667085] hover:text-[#101828]"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "active"
                  ? "bg-white text-rose-600 shadow-sm ring-1 ring-gray-100"
                  : "text-[#667085] hover:text-rose-600"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "resolved"
                  ? "bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100"
                  : "text-[#667085] hover:text-emerald-600"
              }`}
            >
              Resolved ({stats.resolved})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 bg-gray-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[#475467] font-medium">Loading SOS alerts dashboard...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white p-8">
              <ShieldCheck className="text-gray-300 mb-4" size={48} />
              <p className="text-[#101828] text-lg font-bold">No SOS Alerts Found</p>
              <p className="text-gray-400 text-sm max-w-sm mt-1">
                There are no security notifications matching your search or filters at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredAlerts.map((alert) => {
                const isActive = alert.status === "active";
                const alertDate = new Date(alert.createdAt);
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`;

                return (
                  <div 
                    key={alert.uuid} 
                    className={`bg-white rounded-3xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                      isActive 
                        ? "border-rose-200 shadow-sm shadow-rose-100/40" 
                        : "border-[#EAECF0]"
                    }`}
                  >
                    {/* Top alert banner line */}
                    <div className={`h-1.5 w-full ${isActive ? "bg-rose-500 animate-pulse" : "bg-gray-200"}`} />

                    <div className="p-6 flex-1 flex flex-col gap-5">
                      {/* Badge / Header info */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-rose-50 text-rose-600 animate-bounce" : "bg-emerald-50 text-emerald-600"}`}>
                            {isActive ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                          </span>
                          <div>
                            <span className={`text-xs font-black uppercase tracking-wider ${isActive ? "text-rose-600" : "text-emerald-600"}`}>
                              {isActive ? "Emergency Alert" : "Incident Resolved"}
                            </span>
                            <span className="text-[10px] text-gray-400 block font-semibold leading-tight">
                              ID: {alert.uuid.split("-")[0].toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          isActive 
                            ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse" 
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}>
                          {alert.status}
                        </span>
                      </div>

                      {/* Participant & Task info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider flex items-center gap-1">
                            <User size={12} /> Triggered By
                          </span>
                          <Link 
                            to={`${PRIVATE_PATHS.USER_MANAGEMENT}/${alert.userUuid}`} 
                            className="font-bold text-[#101828] text-sm hover:text-primary transition-colors truncate"
                          >
                            {alert.userName}
                          </Link>
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Briefcase size={12} /> Connected Task
                          </span>
                          <Link 
                            to={`${PRIVATE_PATHS.TASK_MANAGEMENT}/${alert.taskUuid}`} 
                            className="font-bold text-[#101828] text-sm hover:text-primary transition-colors truncate"
                          >
                            {alert.taskTitle || "View Task Details"}
                          </Link>
                        </div>
                      </div>

                      {/* Incident Meta (Date & Location) */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-[#475467] font-medium border-b border-gray-100 pb-3">
                        <span className="flex items-center gap-1.5 shrink-0">
                          <Calendar size={14} className="text-gray-400" />
                          {format(alertDate, "MMM dd, yyyy h:mm a")}
                        </span>
                        
                        <a 
                          href={googleMapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-primary hover:text-green-700 font-bold transition-all hover:gap-1.5 shrink-0 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10"
                        >
                          <MapPin size={14} />
                          Map View ({alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)})
                          <ExternalLink size={10} />
                        </a>
                      </div>

                      {/* Audio Player section */}
                      {alert.audioUrl ? (
                        <div className="bg-[#F8F9FC] p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Volume2 size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#101828] mb-1.5">Recorded Audio Evidence</p>
                            <audio controls className="w-full h-8" src={alert.audioUrl}>
                              Your browser does not support audio playback.
                            </audio>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-gray-400 italic text-xs border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                          No audio recording was capture for this SOS alert.
                        </div>
                      )}

                      {/* Resolution note display */}
                      {!isActive && alert.resolutionNote && (
                        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex flex-col gap-1.5">
                          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={12} /> Resolution Notes
                          </span>
                          <p className="text-sm text-emerald-950 font-medium italic leading-relaxed">
                            "{alert.resolutionNote}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions (Resolution inline flow) */}
                    {isActive && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-[#EAECF0] flex flex-col gap-3">
                        {resolvingId === alert.uuid ? (
                          <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold text-gray-700">Enter Resolution Details</label>
                            <textarea
                              rows={2}
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                              placeholder="Please describe actions taken to resolve this crisis or check on user's welfare..."
                              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-medium"
                            />
                            <div className="flex justify-end gap-3">
                              <Button
                                label="Cancel"
                                variant="outline"
                                fullWidth={false}
                                className="h-9 px-4 text-sm"
                                onClick={() => {
                                  setResolvingId(null);
                                  setResolutionNote("");
                                }}
                                disabled={isResolving}
                              />
                              <Button
                                label="Resolve Crisis"
                                variant="primary"
                                fullWidth={false}
                                className="h-9 px-4 text-sm bg-rose-600 hover:bg-rose-700 border-none"
                                onClick={() => handleResolve(alert.uuid)}
                                disabled={isResolving || !resolutionNote.trim()}
                                isLoading={isResolving}
                              />
                            </div>
                          </div>
                        ) : (
                          <Button
                            label="Investigate & Resolve"
                            variant="primary"
                            icon={<AlertTriangle size={16} />}
                            className="bg-rose-600 hover:bg-rose-700 border-none h-11"
                            onClick={() => setResolvingId(alert.uuid)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSAlerts;

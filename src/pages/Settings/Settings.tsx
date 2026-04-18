import React, { useState } from "react";
import PaymentProviders from "../../components/Modules/Settings/PaymentProviders";
import NotificationChannels from "../../components/Modules/Settings/NotificationChannels";
import SecurityPolicies from "../../components/Modules/Settings/SecurityPolicies";
import {
  Settings as SettingsIcon,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Lock,
} from "lucide-react";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("payment");

  const tabs = [
    { id: "payment", label: "Payment Configuration", icon: CreditCard },
    { id: "general", label: "General Settings", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
  ];

  return (
    <div className=" space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 px-1">
        <h1 className="text-3xl font-black text-[#101828] tracking-tight">
          Settings
        </h1>
        <p className="text-[#667085] font-medium">
          Manage your platform configurations and system preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                      : "text-[#667085] hover:bg-gray-100 hover:text-[#101828]"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-5 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hidden lg:block">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase mb-3 tracking-widest">
              <Globe size={14} />
              System Status
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085] font-semibold">API Version</span>
                <span className="font-mono font-bold text-[#101828]">
                  v1.4.2
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085] font-semibold">Environment</span>
                <span className="px-2 py-0.5 rounded-lg bg-green-50 text-green-700 font-black italic uppercase text-[9px] border border-green-100">
                  Production
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 bg-[#F9FAFB]/50 border border-[#EAECF0] rounded-[32px] p-8 min-h-[700px] relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10 transition-all duration-300">
             {activeTab === "payment" && <PaymentProviders />}
             {activeTab === "notifications" && <NotificationChannels />}
             {activeTab === "security" && <SecurityPolicies />}

             {(activeTab === "general") && (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center space-y-4 max-w-sm mx-auto">
                  <div className="w-20 h-20 rounded-[24px] bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 rotate-3">
                    <Lock size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#101828]">
                      Under Construction
                    </h3>
                    <p className="text-sm text-[#667085] font-medium leading-relaxed">
                      The {tabs.find((t) => t.id === activeTab)?.label} module is
                      currently being finalized for production release.
                    </p>
                  </div>
                </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};


export default Settings;

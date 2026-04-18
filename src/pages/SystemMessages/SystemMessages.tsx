import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import BulkNotificationForm from '../../components/Modules/Settings/BulkNotificationForm';
import SystemMessagesHistory from '../../components/Modules/Settings/SystemMessagesHistory';
import { Megaphone, History, Send } from 'lucide-react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SystemMessages: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 'broadcast', label: 'Broadcast Message', icon: Send },
    { id: 'history', label: 'Message History', icon: History },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="w-8 h-[2px] bg-primary rounded-full" />
            Platform Communication
          </div>
          <h1 className="text-4xl font-black text-[#101828] tracking-tight">
            System Messages
          </h1>
          <p className="text-[#667085] font-medium text-lg max-w-2xl">
            Publish platform-wide announcements and audit sent notifications.
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
           <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
             <Megaphone size={24} />
           </div>
           <div>
             <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Broadcast Status</span>
             <div className="flex items-center gap-2 group cursor-help">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-black text-[#101828]">System Active</span>
             </div>
           </div>
        </div>
      </div>

      <Tab.Group onChange={setActiveTab}>
        <div className="flex flex-col gap-6">
          {/* Tab Navigation */}
          <Tab.List className="flex space-x-1 rounded-2xl bg-gray-100/50 p-1.5 border border-gray-200/50 w-full sm:w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    classNames(
                      'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all outline-none',
                      selected
                        ? 'bg-white text-primary shadow-sm shadow-primary/5 ring-1 ring-gray-200'
                        : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                    )
                  }
                >
                  <Icon size={18} />
                  {tab.label}
                </Tab>
              );
            })}
          </Tab.List>

          {/* Tab Content */}
          <Tab.Panels className="mt-2">
            <Tab.Panel className="animate-in fade-in slide-in-from-left-4 duration-500 focus:outline-none">
              <section className="relative group max-w-2xl">
                 <div className="absolute -inset-1 bg-linear-to-r from-primary/10 to-blue-500/10 rounded-[32px] blur-xl opacity-25 group-hover:opacity-40 transition-opacity" />
                 <div className="relative">
                   <BulkNotificationForm />
                 </div>
              </section>
            </Tab.Panel>
            
            <Tab.Panel className="animate-in fade-in slide-in-from-right-4 duration-500 focus:outline-none">
              <section className="space-y-4">
                 <SystemMessagesHistory />
              </section>
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};


export default SystemMessages;

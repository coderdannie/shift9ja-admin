import React from 'react';
import { useParams } from 'react-router-dom';
import { Headphones, MessageCircle } from 'lucide-react';
import SupportSessionList from '../../components/Modules/SupportSessions/SupportSessionList';
import SupportSessionInterface from '../../components/Modules/SupportSessions/SupportSessionInterface';

const SupportSessions: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex bg-[#F2F4F7] h-[calc(100vh-100px)] -m-6 overflow-hidden relative">
      {/* Sidebar — Session List */}
      <div
        className={`${id ? 'hidden md:block' : 'block'} w-full md:w-[340px] h-full flex-shrink-0`}
      >
        <SupportSessionList activeId={id} />
      </div>

      {/* Main — Session Interface */}
      <div
        className={`${id ? 'block' : 'hidden md:flex'} flex-1 h-full flex flex-col min-w-0`}
      >
        {id ? (
          <SupportSessionInterface sessionUuid={id} />
        ) : (
          <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
              <Headphones size={36} />
            </div>
            <h2 className="text-xl font-bold text-[#101828] mb-2">
              Support Session Manager
            </h2>
            <p className="text-sm text-[#475467] max-w-sm mx-auto leading-relaxed">
              Select a session from the list to view the conversation, monitor
              AI responses, or take over and assist the user directly.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-xs">
              {[
                { label: 'AI Active', color: 'bg-blue-50 text-blue-700' },
                { label: 'Escalated', color: 'bg-red-50 text-red-700' },
                { label: 'Closed', color: 'bg-gray-50 text-gray-500' },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.color} rounded-xl py-2 px-3 text-xs font-bold text-center border border-current/10`}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportSessions;

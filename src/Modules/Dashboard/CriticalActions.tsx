import React from 'react';
import { AlertCircle } from 'lucide-react';

const CriticalActions: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <h2 className="text-xl font-bold text-[#101828]">Critical Actions</h2>
      
      <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <AlertCircle className="text-green-500" size={20} />
          </div>
          <p className="text-[#475467] text-lg font-medium">Resolve open disputes (2 disputes)</p>
        </div>
      </div>
    </div>
  );
};

export default CriticalActions;

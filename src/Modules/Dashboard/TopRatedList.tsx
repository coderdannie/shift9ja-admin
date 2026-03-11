import React from 'react';
import { Star } from 'lucide-react';

interface Entry {
  id: string;
  name: string;
  avatar: string;
  count: number;
  rating: number;
  isVerified?: boolean;
}

interface TopRatedListProps {
  title: string;
  items: Entry[];
  countLabel: string;
  showVerified?: boolean;
}

const TopRatedList: React.FC<TopRatedListProps> = ({ 
  title, 
  items, 
  countLabel,
  showVerified = false 
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#101828]">{title}</h2>
      
      <div className="bg-white rounded-2xl border border-[#F2F4F7] overflow-hidden shadow-sm">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={`p-4 flex items-center justify-between ${index !== items.length - 1 ? 'border-b border-[#F2F4F7]' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <h4 className="text-[#101828] font-bold text-sm">{item.name}</h4>
                   {showVerified && item.isVerified && (
                     <div className="px-1.5 py-0.5 rounded-full border border-green-200 bg-green-50 flex items-center gap-1">
                        <Star className="text-green-500 fill-green-500" size={8} />
                        <span className="text-[8px] font-bold text-green-600 uppercase">Verified</span>
                     </div>
                   )}
                </div>
                <p className="text-[#667085] text-[10px] font-medium">
                  {item.count} {countLabel} | {item.rating} ratings
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedList;

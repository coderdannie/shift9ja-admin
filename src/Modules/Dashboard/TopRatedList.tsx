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
  isLoading?: boolean;
}

const TopRatedList: React.FC<TopRatedListProps> = ({ 
  title, 
  items, 
  countLabel,
  showVerified = false,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#101828]">{title}</h2>
      
      <div className="bg-white rounded-2xl border border-[#F2F4F7] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex flex-col">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-3 animate-pulse border-b border-[#F2F4F7]">
                <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-4 flex items-center justify-between ${index !== items.length - 1 ? 'border-b border-[#F2F4F7]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 text-xs flex items-center justify-center font-bold text-gray-400">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.name[0]
                  )}
                </div>
                <div className="flex flex-col text-nowrap">
                  <div className="flex items-center gap-2">
                     <h4 className="text-[#101828] font-bold text-sm truncate max-w-[120px]">{item.name}</h4>
                     {showVerified && item.isVerified && (
                       <div className="px-1.5 py-0.5 rounded-full border border-green-200 bg-green-50 flex items-center gap-1 shrink-0">
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
          ))
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
};

export default TopRatedList;

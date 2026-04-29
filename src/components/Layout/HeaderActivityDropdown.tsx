import React, { useMemo } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Bell, Activity, Clock, ChevronRight, RefreshCcw } from 'lucide-react';
import { useGetPlatformActivity } from '../../services/query/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';

const HeaderActivityDropdown = () => {
  const navigate = useNavigate();
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isFetching 
  } = useGetPlatformActivity({ limit: 10 });

  const activities = useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);

  return (
    <Menu as="div" className="relative">
      <MenuButton className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-all active:scale-95">
        <Bell size={20} />
        {activities.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse"></span>
        )}
      </MenuButton>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <MenuItems className="absolute right-0 mt-3 w-80 md:w-96 origin-top-right rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 focus:outline-none overflow-hidden z-50">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
            <h3 className="text-lg font-bold text-[#101828] flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Platform Activity
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Recent
            </span>
          </div>

          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-10 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-gray-400 font-medium tracking-wide">Fetching latest events...</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {activities.map((activity) => (
                  <MenuItem key={activity.uuid}>
                    {({ active }) => (
                      <div
                        className={`p-4 flex gap-4 transition-colors cursor-pointer ${
                          active ? 'bg-gray-50' : 'bg-white'
                        }`}
                        onClick={() => {
                           if (activity.metadata?.taskId) {
                             navigate(`${PRIVATE_PATHS.TASK_MANAGEMENT}/${activity.metadata.taskId}`);
                           }
                        }}
                      >
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                           <Activity size={18} className="text-gray-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-semibold leading-snug transition-colors ${active ? 'text-primary' : 'text-[#344054]'}`}>
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                             <Clock size={12} />
                             {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    )}
                  </MenuItem>
                ))}
                
                {hasNextPage && (
                  <div className="p-4 bg-white border-t border-gray-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchNextPage();
                      }}
                      disabled={isFetchingNextPage}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isFetchingNextPage ? (
                        <RefreshCcw size={14} className="animate-spin" />
                      ) : (
                        <Activity size={14} />
                      )}
                      {isFetchingNextPage ? 'Loading more...' : 'Load older activities'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                   <Activity size={24} />
                </div>
                <p className="text-sm font-medium text-gray-400">No recent activity found</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button 
              onClick={() => navigate(PRIVATE_PATHS.DASHBOARD)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#475467] bg-white border border-gray-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group"
            >
              View Dashboard Summary
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default HeaderActivityDropdown;

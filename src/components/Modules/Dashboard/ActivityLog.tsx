import React, { useMemo } from "react";
import { useGetPlatformActivity } from "../../../services/query/dashboard";
import { formatDistanceToNow } from "date-fns";
import { RefreshCcw, Activity } from "lucide-react";

const statusColorMap: Record<string, string> = {
  TASK_COMPLETED: "bg-green-500",
  USER_SUSPENDED: "bg-red-500",
  DISPUTE_OPENED: "bg-[#FFC107]",
  DISPUTE_RESOLVED: "bg-[#FFC107]",
  HELPER_VERIFIED: "bg-green-500",
};

const ActivityLog: React.FC = () => {
  const { 
    data: activityData, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetPlatformActivity({
    limit: 10,
  });

  const activities = useMemo(() => {
    return activityData?.pages.flatMap((page) => page.data || []) || [];
  }, [activityData]);

  const formatActivityType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "just now";
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-[#F2F4F7] flex flex-col gap-6 shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#101828] flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Recent Platform Activity
        </h2>
        {hasNextPage && (
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isFetchingNextPage ? <RefreshCcw size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
            Load More
          </button>
        )}
      </div>

      <div className="flex flex-col relative max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 py-4 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full mt-2 bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-50 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-20 text-center text-[#667085]">
            No recent activity found.
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {activities.map((activity, index) => (
                <div
                  key={activity.uuid}
                  className={`flex items-start justify-between py-4 ${index !== activities.length - 1 ? "border-b border-[#F2F4F7]" : ""}`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${statusColorMap[activity.type] || "bg-blue-500"}`}
                    />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[#101828] font-semibold text-lg">
                        {formatActivityType(activity.type)}
                      </h4>
                      <p className="text-[#667085] text-sm">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#98A2B3] text-sm whitespace-nowrap ml-4 mt-1 font-medium">
                    {getTimeAgo(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
            
            {hasNextPage && (
               <div className="py-6 flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all bg-white disabled:opacity-50"
                  >
                    {isFetchingNextPage ? <RefreshCcw size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                    {isFetchingNextPage ? 'Loading...' : 'Load more activity'}
                  </button>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;

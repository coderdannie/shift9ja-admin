import React from "react";
import { useGetPlatformActivity } from "../../../services/query/dashboard";
import { formatDistanceToNow } from "date-fns";

const statusColorMap: Record<string, string> = {
  TASK_COMPLETED: "bg-green-500",
  USER_SUSPENDED: "bg-red-500",
  DISPUTE_OPENED: "bg-[#FFC107]",
  DISPUTE_RESOLVED: "bg-[#FFC107]",
  HELPER_VERIFIED: "bg-green-500",
};

const ActivityLog: React.FC = () => {
  const { data: activityData, isPending: isLoading } = useGetPlatformActivity({
    limit: 5,
  });
  const activities = activityData?.data || [];

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
    <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] flex flex-col gap-6 shadow-sm min-h-[400px]">
      <h2 className="text-xl font-bold text-[#101828]">
        Recent Platform Activity
      </h2>

      <div className="flex flex-col relative">
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
          activities.map((activity, index) => (
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
              <span className="text-[#98A2B3] text-sm whitespace-nowrap ml-4">
                {getTimeAgo(activity.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;

import React from "react";
import {
  Users,
  ClipboardList,
  Wallet,
  Banknote,
  CheckCircle,
} from "lucide-react";
import DashboardHeader from "../../components/Modules/Dashboard/DashboardHeader";
import StatCard from "../../components/Modules/Dashboard/StatCard";
import ActivityLog from "../../components/Modules/Dashboard/ActivityLog";
import CriticalActions from "../../components/Modules/Dashboard/CriticalActions";
import TopRatedList from "../../components/Modules/Dashboard/TopRatedList";
import {
  useGetDashboardSummary,
  useGetTopUsers,
  useGetDashboardAlerts,
  useGetPlatformActivity,
} from "../../services/query/dashboard";

const Dashboard = () => {
  const { data: summaryData, isPending: isLoadingSummary } =
    useGetDashboardSummary();
  const { data: topUsersData, isPending: isLoadingTopUsers } = useGetTopUsers();
  const { data: alertsData, isPending: isLoadingAlerts } =
    useGetDashboardAlerts();

  const statsResponse = summaryData?.data;
  const topClients = topUsersData?.data?.topRatedClients || [];
  const topHelpers = topUsersData?.data?.topRatedHelpers || [];
  const criticalActions = alertsData?.data || { openDisputes: 0 };

  const isLoading = isLoadingSummary || isLoadingTopUsers || isLoadingAlerts;

  const formattedStats = [
    {
      title: "Total Users",
      value: statsResponse?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Tasks",
      value: statsResponse?.activeTasks?.toLocaleString() || "0",
      icon: ClipboardList,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Escrow Balance",
      value: `₦${statsResponse?.totalEscrowBalance?.toLocaleString() || "0"}`,
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Revenue (Platform Fees)",
      value: `₦${statsResponse?.revenue?.toLocaleString() || "0"}`,
      icon: Banknote,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed Tasks",
      value: statsResponse?.totalTasksCompleted?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const mapUserToRatedItem = (user: any) => ({
    id: user.uuid || user.id?.toString(),
    name: `${user.firstName} ${user.lastName}`,
    count: user.tasksPostedCount || user.tasksCompletedCount || 0,
    rating: parseFloat(user.profile?.rating || "0"),
    avatar:
      user.avatarUrl ||
      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
    isVerified:
      user.kycVerification?.status === "approved" ||
      user.profile?.verificationStatus === "verified",
  });

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <StatCard key={i} loading />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.color}
              iconBgColor={stat.bgColor}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-0">
          <ActivityLog />
          <CriticalActions disputes={criticalActions?.openDisputes || 0} />
        </div>

        <div className="flex flex-col gap-8">
          <TopRatedList
            title="Top Rated Clients"
            items={topClients.map(mapUserToRatedItem)}
            countLabel="tasks posted"
            isLoading={isLoading}
          />
          <TopRatedList
            title="Top Rated Helpers"
            items={topHelpers.map(mapUserToRatedItem)}
            countLabel="tasks completed"
            showVerified
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useMemo } from "react";
import { Users, UserCheck, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Filter, Download, ChevronDown } from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Portal,
} from "@headlessui/react";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import UserStatsBar from "../../components/Modules/UserManagement/UserStatsBar";
import UserSearchBar from "../../components/Modules/UserManagement/UserSearchBar";
import UserTabs from "../../components/Modules/UserManagement/UserTabs";
import type { TabType } from "../../components/Modules/UserManagement/UserTabs";
import UserTable from "../../components/Modules/UserManagement/UserTable";
import type { User } from "../../components/Modules/UserManagement/UserTable";
import { toast, Toaster } from "react-hot-toast";

const USERS_PER_PAGE = 20;

type ActionType = "suspend" | "unsuspend" | "ban" | null;

import { useGetUsers, useGetUserStats } from "../../services/query/userMgt";

const UserManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("client");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userData, isPending: isLoadingUsers } = useGetUsers(
    currentPage,
    USERS_PER_PAGE,
    search,
    activeTab,
    status.toUpperCase(),
    city,
  );

  const { data: statsData, isPending: isLoadingStats } = useGetUserStats();

  const userStats = useMemo(() => {
    const s = statsData?.data;
    return [
      {
        title: "Total Users",
        value: s?.totalUsers?.toLocaleString() || "0",
        icon: Users,
      },
      {
        title: "Active Users",
        value: s?.activeUsers?.toLocaleString() || "0",
        icon: Users,
      },
      {
        title: "Verified Users",
        value: s?.totalVerifiedUsers?.toLocaleString() || "0",
        icon: UserCheck,
      },
      {
        title: "Flagged Accounts",
        value: s?.flaggedAccounts?.toLocaleString() || "0",
        icon: Flag,
      },
    ];
  }, [statsData]);

  const usersList: User[] = useMemo(() => {
    return (userData?.data?.items || []).map((item: any) => ({
      id: item.uuid,
      fullName: `${item.firstName} ${item.lastName}`,
      email: item.email,
      phone: item.phoneNumber,
      city: item.location?.city || item.profile?.address || "N/A",
      taskPosted: item.profile?.tasksPostedCount || 0,
      tasksCompleted: item.profile?.tasksCompletedCount || 0,
      disputeCount: item.profile?.tasksDisputedCount || 0,
      status:
        item.isSuspended || item.status === "SUSPENDED"
          ? "suspended"
          : item.kycVerification?.status === "approved"
            ? "verified"
            : item.kycVerification?.status || "not_verified",
    }));
  }, [userData]);

  const totalPages = userData?.data?.meta?.totalPages || 1;

  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionType>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch("");
    setStatus("");
    setCity("");
  };

  const openModal = (user: User, action: ActionType) => {
    setSelectedUser(user);
    setPendingAction(action);
  };

  const closeModal = () => {
    if (actionLoading) return;
    setSelectedUser(null);
    setPendingAction(null);
  };

  const handleSuspend = (u: User) => {
    openModal(u, u.status === "suspended" ? "unsuspend" : "suspend");
  };

  const handleBan = (u: User) => openModal(u, "ban");

  const handleConfirm = () => {
    if (!selectedUser || !pendingAction) return;
    setActionLoading(true);
    // TODO: Implement actual mutation
    setTimeout(() => {
      toast.success("Action successful (Mocked)");
      setActionLoading(false);
      closeModal();
    }, 1000);
  };

  const modalConfig = {
    suspend: {
      title: "Suspend User",
      description: `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`,
      confirmLabel: "Suspend",
      variant: "warning" as const,
    },
    unsuspend: {
      title: "Unsuspend User",
      description: `Are you sure you want to restore access for ${selectedUser?.fullName}?`,
      confirmLabel: "Unsuspend",
      variant: "info" as const,
    },
    ban: {
      title: "Ban User",
      description: `Are you sure you want to permanently ban ${selectedUser?.fullName}? This action is irreversible.`,
      confirmLabel: "Ban User",
      variant: "danger" as const,
    },
  };

  const modal = pendingAction ? modalConfig[pendingAction] : null;

  return (
    <div className="flex flex-col gap-6">
      <Toaster position="top-right" />

      {modal && (
        <ConfirmModal
          isOpen={!!selectedUser && !!pendingAction}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={modal.title}
          description={modal.description}
          confirmLabel={modal.confirmLabel}
          variant={modal.variant}
          isLoading={actionLoading}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828]">
            User Management
          </h1>
          <p className="text-[#475467] text-sm mt-1">
            Manage all clients and helpers on Shift9ja
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            label="Filter"
            variant="outline"
            fullWidth={false}
            className="!h-10 border-[#F2F4F7]"
            icon={<Filter size={18} />}
          />
          <Button
            label="Export Data"
            variant="primary"
            fullWidth={false}
            className="!h-10 px-6"
            icon={<Download size={18} />}
          />
        </div>
      </div>

      <UserStatsBar stats={userStats} isLoading={isLoadingStats} />

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <UserSearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full lg:w-48">
          <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
            Status
          </label>
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center justify-between w-full h-12 px-5 rounded-full border border-[#F2F4F7] bg-white text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition hover:border-[#D0D5DD]">
              <span className="capitalize">
                {status === "" ? "All Status" : status}
              </span>
              <ChevronDown size={16} className="text-[#667085]" />
            </MenuButton>
            <Portal>
              <MenuItems
                anchor="bottom start"
                className="z-50 w-48 origin-top-right rounded-2xl bg-white p-1 shadow-2xl focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                {[
                  { label: "All Status", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Suspended", value: "suspended" },
                  { label: "Flagged", value: "flagged" },
                  { label: "Unverified", value: "unverified" },
                ].map((opt) => (
                  <MenuItem key={opt.label}>
                    <button
                      onClick={() => {
                        setStatus(opt.value);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center w-full px-4 py-2.5 text-sm rounded-xl transition-colors ${
                        status === opt.value
                          ? "bg-[#F9FAFB] text-primary font-bold"
                          : "text-[#475467] hover:bg-[#F9FAFB] hover:text-[#101828]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            </Portal>
          </Menu>
        </div>
        <div className="w-full lg:w-48">
          <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
            City
          </label>
          <input
            type="text"
            placeholder="Filter by city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-12 px-4 rounded-full border border-[#F2F4F7] bg-white text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
      </div>

      <UserTabs activeTab={activeTab} onChange={handleTabChange} />

      <UserTable
        users={usersList}
        type={activeTab}
        isLoading={isLoadingUsers}
        onView={(u) => navigate(`/user-management/${u.id}`)}
        onEdit={(u) => navigate(`/user-management/${u.id}/edit`)}
        onSuspend={handleSuspend}
        onBan={handleBan}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserManagement;

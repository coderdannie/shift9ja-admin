import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Star,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Wallet,
  TrendingUp,
  TrendingDown,
  Lock,
  Wallet2,
  ChevronLeft,
  ChevronRight,
  X,
  Briefcase,
  DollarSign,
  Send,
  Ban,
} from "lucide-react";
import { PRIVATE_PATHS } from "../../routes/constants";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import { toast, Toaster } from "react-hot-toast";
import {
  useGetUser,
  useUpdateUser,
  useUpdateUserKycStatus,
} from "../../services/query/userMgt";
import KycRejectModal from "../../components/Modals/KycRejectModal";
import GalleryLightboxModal from "../../components/Modals/GalleryLightboxModal";
import TaskStatRow from "../../components/Modules/UserManagement/UserDetails/TaskStatRow";
import WalletCard from "../../components/Modules/UserManagement/UserDetails/WalletCard";
import RoleBadge from "../../components/Modules/UserManagement/UserDetails/RoleBadge";
import UserKycSection from "../../components/Modules/UserManagement/UserDetails/UserKycSection";
import UserProfileSection from "../../components/Modules/UserManagement/UserDetails/UserProfileSection";
import EditUserForm from "../../components/Modules/UserManagement/UserDetails/EditUserForm";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = window.location.pathname.endsWith("/edit");

  const {
    data: userData,
    isPending: isLoading,
    isError,
  } = useGetUser(id || "");
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(id || "");
  const { mutate: updateKycStatus, isPending: isUpdatingKyc } =
    useUpdateUserKycStatus(id || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [activeStatsTab, setActiveStatsTab] = useState<"client" | "helper">(
    "client",
  );

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const adminUserJson = sessionStorage.getItem("user");
  const loggedInAdmin = adminUserJson ? JSON.parse(adminUserJson) : null;

  // Add this debug log so you can inspect your exact admin role format in Chrome DevTools Console:
  useEffect(() => {
    console.log("🔒 Logged-in admin roles:", loggedInAdmin?.roles);
  }, [loggedInAdmin]);

  const isKycReviewer =
    loggedInAdmin?.roles?.some((role: any) => {
      // Normalize 'Super Admin', 'SUPER_ADMIN', 'super admin' all to 'SUPERADMIN'
      const normalized = (role.name || "").replace(/[\s_-]/g, "").toUpperCase();
      return normalized === "SUPERADMIN" || normalized === "MANAGER";
    }) || false;

  const handleApprove = () => {
    updateKycStatus(
      { status: "verified" },
      {
        onSuccess: () => {
          setIsApproveOpen(false);
        },
      },
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    updateKycStatus(
      { status: "rejected", reason: rejectionReason.trim() },
      {
        onSuccess: () => {
          setIsRejectOpen(false);
          setRejectionReason("");
        },
      },
    );
  };

  const apiData = userData?.data;

  useEffect(() => {
    if (apiData?.activeRole === "helper") {
      setActiveStatsTab("helper");
    } else if (apiData?.activeRole === "client") {
      setActiveStatsTab("client");
    }
  }, [apiData?.activeRole]);

  const user = useMemo(() => {
    if (!apiData) return null;
    return {
      id: apiData.uuid,
      fullName: `${apiData.firstName} ${apiData.middleName ?? ""} ${apiData.lastName}`,
      email: apiData.email,
      phone: apiData.phoneNumber || "N/A",
      city: apiData.location?.city || apiData.profile?.address || "N/A",
      status:
        apiData.isSuspended || apiData.status === "SUSPENDED"
          ? "suspended"
          : apiData.kycVerification?.status === "approved"
            ? "verified"
            : apiData.kycVerification?.status || "not_verified",
      activeRole: apiData.activeRole || "User",
      roles: apiData.roles || [],
      bio: apiData.profile?.bio || "No bio available.",
      skills: apiData.profile?.skills || [],
      experienceLevel: apiData.profile?.experienceLevel || "N/A",
      yearsOfExperience: apiData.profile?.yearsOfExperience || 0,
      galleryUrls: apiData.profile?.galleryUrls || [],
      hasInsurance: apiData.profile?.hasInsurance || false,
      hasServiceGuarantee: apiData.profile?.hasServiceGuarantee || false,
      languagesSpoken: apiData.profile?.languagesSpoken || [],
      minimumTaskFee: apiData.profile?.minimumTaskFee || 0,
      offersEmergencyServices:
        apiData.profile?.offersEmergencyServices || false,
      ratingCount: apiData.profile?.ratingCount || 0,
      wallet: {
        balance: apiData.wallet?.balance || 0,
        currency:
          apiData.wallet?.currency === "NGN"
            ? "₦"
            : apiData.wallet?.currency || "₦",
        totalFunding: apiData.financialSummary?.totalFunding || 0,
        totalWithdrawal: apiData.financialSummary?.totalWithdrawal || 0,
        escrowBalance: apiData.wallet?.escrowBalance || 0,
      },
      taskStats: {
        asClient: {
          open: apiData.taskStats?.asClient?.open || 0,
          assigned: apiData.taskStats?.asClient?.assigned || 0,
          completed: apiData.taskStats?.asClient?.completed || 0,
          cancelled: apiData.taskStats?.asClient?.cancelled || 0,
          disputed: apiData.taskStats?.asClient?.disputed || 0,
          paid: apiData.taskStats?.asClient?.paid || 0,
          offered: apiData.taskStats?.asClient?.offered || 0,
          rejected: apiData.taskStats?.asClient?.rejected || 0,
        },
        asHelper: {
          open: apiData.taskStats?.asHelper?.open || 0,
          assigned: apiData.taskStats?.asHelper?.assigned || 0,
          completed: apiData.taskStats?.asHelper?.completed || 0,
          cancelled: apiData.taskStats?.asHelper?.cancelled || 0,
          disputed: apiData.taskStats?.asHelper?.disputed || 0,
          paid: apiData.taskStats?.asHelper?.paid || 0,
          offered: apiData.taskStats?.asHelper?.offered || 0,
          rejected: apiData.taskStats?.asHelper?.rejected || 0,
        },
      },
      kycVerification: apiData.kycVerification
        ? {
            uuid: apiData.kycVerification.uuid,
            type: apiData.kycVerification.type,
            status: apiData.kycVerification.status,
            idNumber: apiData.kycVerification.idNumber,
            failureReason: apiData.kycVerification.failureReason,
            otpAttempts: apiData.kycVerification.otpAttempts,
            otpExpiresAt: apiData.kycVerification.otpExpiresAt,
            providerResponse: apiData.kycVerification.providerResponse
              ? {
                  gender: apiData.kycVerification.providerResponse.gender,
                  last_name: apiData.kycVerification.providerResponse.last_name,
                  first_name:
                    apiData.kycVerification.providerResponse.first_name,
                  middle_name:
                    apiData.kycVerification.providerResponse.middle_name,
                  phone_number:
                    apiData.kycVerification.providerResponse.phone_number,
                  date_of_birth:
                    apiData.kycVerification.providerResponse.date_of_birth,
                  photo: apiData.kycVerification.providerResponse.photo,
                }
              : null,
          }
        : null,
      recentReviews: apiData.recentReviews || [],
      averageRating: apiData.profile?.averageRating || 0,
      beneficiaries: apiData.beneficiaries || [],
    };
  }, [apiData]);

  const currentStats = useMemo(() => {
    if (!user)
      return {
        open: 0,
        assigned: 0,
        completed: 0,
        cancelled: 0,
        disputed: 0,
        paid: 0,
        offered: 0,
        rejected: 0,
      };
    return activeStatsTab === "helper"
      ? user.taskStats.asHelper
      : user.taskStats.asClient;
  }, [user, activeStatsTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[#475467] font-medium">Loading user details...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#475467]">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-lg font-semibold">
          User not found or an error occurred.
        </p>
        <Button
          label="Back to Users"
          fullWidth={false}
          onClick={() => navigate(PRIVATE_PATHS.USER_MANAGEMENT)}
        />
      </div>
    );
  }

  const handleCopyId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusToggle = () => {
    if (!user) return;
    setIsSuspending(true);
    // TODO: Implement actual mutation
    setTimeout(() => {
      toast.success(
        user.status === "suspended"
          ? "User unsuspended successfully"
          : "User suspended successfully",
      );
      setIsSuspending(false);
      setIsModalOpen(false);
    }, 1000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4 px-1 sm:px-4">
      <Toaster position="top-right" />

      {/* Header Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <button
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-green-700 cursor-pointer"
          onClick={handleGoBack}
        >
          <ArrowLeft size={18} />
          Back to User Management
        </button>

        {!isEdit && (
          <div className="flex items-center gap-3">
            <Button
              label={
                user.status === "suspended" ? "Unsuspend User" : "Suspend User"
              }
              icon={
                user.status === "suspended" ? (
                  <ShieldCheck size={16} />
                ) : (
                  <ShieldAlert size={16} />
                )
              }
              fullWidth={false}
              variant="outline"
              className={`py-2 px-5 w-fit font-bold border-2 transition-all ${
                user.status === "suspended"
                  ? "border-green-600 text-green-600 hover:bg-green-50"
                  : "border-amber-600 text-amber-600 hover:bg-amber-50"
              }`}
              onClick={() => setIsModalOpen(true)}
            />
            <Button
              label="Edit User"
              icon={<Edit2 size={16} />}
              fullWidth={false}
              className="py-2 px-5 w-fit"
              onClick={() => navigate(`/user-management/${id}/edit`)}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[800px]">
        {/* Profile Header & Stats */}
        <div className="p-4 sm:p-8 border-b border-[#F2F4F7] bg-white">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              <div className="w-24 h-24 rounded-full bg-[#0D8ABC] flex items-center justify-center text-white font-bold text-3xl shrink-0 border-2 border-white shadow-sm">
                {(user.fullName || "")
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#101828] break-words">
                  {user.fullName}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[#475467] text-sm sm:text-base">
                  <span className="truncate">{user.email}</span>
                  <span className="hidden sm:inline text-[#D0D5DD]">•</span>
                  <div
                    className="flex items-center gap-1.5 bg-[#F9FAFB] px-2 py-0.5 rounded-md border border-[#F2F4F7] group cursor-pointer"
                    onClick={handleCopyId}
                    title="Click to copy full ID"
                  >
                    <span className="text-[#667085] text-xs font-mono truncate max-w-[120px] sm:max-w-none">
                      ID: {user.id}
                    </span>
                    {copied ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <Copy
                        size={12}
                        className="text-[#98A2B3] group-hover:text-primary transition-colors"
                      />
                    )}
                  </div>
                  <span className="hidden sm:inline text-[#D0D5DD]">•</span>
                  <RoleBadge role={user.activeRole} />
                </div>
              </div>
            </div>

            {/* Task Statistics Bar - Responsive Tabs & Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
                <span className="text-xs font-bold text-[#344054] uppercase tracking-wider">
                  Task Statistics
                </span>
                {user.roles.length > 1 && (
                  <div className="flex bg-[#F2F4F7] p-1 rounded-xl border border-[#EAECF0]">
                    <button
                      onClick={() => setActiveStatsTab("client")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        activeStatsTab === "client"
                          ? "bg-white text-[#101828] shadow-sm"
                          : "text-[#667085] hover:text-[#344054]"
                      }`}
                    >
                      As Client
                    </button>
                    <button
                      onClick={() => setActiveStatsTab("helper")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        activeStatsTab === "helper"
                          ? "bg-white text-[#101828] shadow-sm"
                          : "text-[#667085] hover:text-[#344054]"
                      }`}
                    >
                      As Helper
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <TaskStatRow
                  icon={<PlusCircle />}
                  label="Open Tasks"
                  count={currentStats.open}
                  variant="blue"
                />
                <TaskStatRow
                  icon={<Briefcase />}
                  label="Assigned"
                  count={currentStats.assigned}
                  variant="indigo"
                />
                <TaskStatRow
                  icon={<CheckCircle2 />}
                  label="Completed"
                  count={currentStats.completed}
                  variant="green"
                />
                <TaskStatRow
                  icon={<AlertCircle />}
                  label="Disputed"
                  count={currentStats.disputed}
                  variant="amber"
                />
                <TaskStatRow
                  icon={<XCircle />}
                  label="Cancelled"
                  count={currentStats.cancelled}
                  variant="red"
                />
                <TaskStatRow
                  icon={<DollarSign />}
                  label="Paid Tasks"
                  count={currentStats.paid}
                  variant="green"
                />
                <TaskStatRow
                  icon={<Send />}
                  label="Offered"
                  count={currentStats.offered}
                  variant="purple"
                />
                <TaskStatRow
                  icon={<Ban />}
                  label="Rejected"
                  count={currentStats.rejected}
                  variant="gray"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isEdit ? (
          <EditUserForm
            apiData={apiData}
            user={user}
            updateUser={updateUser}
            isUpdating={isUpdating}
            id={id}
          />
        ) : (
          <div className="p-4 sm:p-8 pt-10">
            {/* Wallet Statistics Section */}
            <div className="mb-12 bg-white rounded-3xl border border-[#F2F4F7] p-4 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Wallet2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#101828]">
                  Wallet Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <WalletCard
                  label="Available Balance"
                  value={`${user.wallet.currency}${user.wallet.balance.toLocaleString()}`}
                  icon={Wallet}
                  color="bg-green-600"
                />
                <WalletCard
                  label="Escrow Balance"
                  value={`${user.wallet.currency}${user.wallet.escrowBalance.toLocaleString()}`}
                  icon={Lock}
                  color="bg-amber-600"
                />
                <WalletCard
                  label="Total Funding"
                  value={`${user.wallet.currency}${user.wallet.totalFunding.toLocaleString()}`}
                  icon={TrendingUp}
                  color="bg-blue-600"
                />
                <WalletCard
                  label="Total Withdrawal"
                  value={`${user.wallet.currency}${user.wallet.totalWithdrawal.toLocaleString()}`}
                  icon={TrendingDown}
                  color="bg-rose-600"
                />
              </div>

              {/* Saved Beneficiary Accounts */}
              <div className="border-t border-[#F2F4F7] pt-8">
                <h3 className="text-sm font-bold text-[#344054] mb-4 uppercase tracking-wider">
                  Saved Beneficiary Accounts
                </h3>
                {!user.beneficiaries || user.beneficiaries.length === 0 ? (
                  <div className="py-6 text-center text-[#98A2B3] italic text-sm border border-dashed border-[#EAECF0] rounded-2xl bg-[#F9FAFB]">
                    No saved beneficiary bank accounts found for this user.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.beneficiaries.map((b: any) => (
                      <div
                        key={b.uuid}
                        className="bg-[#F9FAFB] rounded-2xl border border-[#EAECF0] p-5 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/10">
                            {b.currency || "NGN"}
                          </span>
                          <span className="text-[10px] text-[#667085] font-semibold">
                            Code: {b.bankCode}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-[#101828] uppercase tracking-wide truncate">
                            {b.accountName}
                          </h4>
                          <p className="text-sm font-mono text-[#475467] font-semibold">
                            {b.accountNumber}
                          </p>
                          <p className="text-xs text-[#667085] font-medium">
                            {b.bankName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* KYC Verification Details Section */}
            <UserKycSection
              user={user}
              isKycReviewer={isKycReviewer}
              setIsApproveOpen={setIsApproveOpen}
              setIsRejectOpen={setIsRejectOpen}
            />

            <UserProfileSection
              user={user}
              setSelectedImageIndex={setSelectedImageIndex}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStatusToggle}
        title={
          user.status === "suspended"
            ? "Unsuspend User Account"
            : "Suspend User Account"
        }
        description={
          user.status === "suspended"
            ? `Are you sure you want to unsuspend ${user.fullName}'s account? This will restore their access to all platform features.`
            : `Are you sure you want to suspend ${user.fullName}'s account? They will lose access to their profile and all active tasks until unsuspended.`
        }
        confirmLabel={
          user.status === "suspended" ? "Unsuspend User" : "Suspend User"
        }
        variant={user.status === "suspended" ? "info" : "warning"}
        isLoading={isSuspending}
      />

      {/* KYC Manual Review: Approve Confirmation Modal */}
      {user && (
        <ConfirmModal
          isOpen={isApproveOpen}
          onClose={() => setIsApproveOpen(false)}
          onConfirm={handleApprove}
          title="Approve User KYC"
          description={`Are you sure you want to manually approve KYC verification for ${user.fullName}? This will automatically change their overall account status to ACTIVE.`}
          confirmLabel={isUpdatingKyc ? "Approving..." : "Approve KYC"}
          variant="info"
          isLoading={isUpdatingKyc}
        />
      )}

      {/* KYC Manual Review: Rejection Reason Modal */}
      {user && (
        <KycRejectModal
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          userFullName={user.fullName}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          isUpdatingKyc={isUpdatingKyc}
          handleReject={handleReject}
        />
      )}

      {/* Lightbox / Gallery Carousel */}
      <GalleryLightboxModal
        selectedImageIndex={selectedImageIndex}
        galleryUrls={user?.galleryUrls || []}
        setSelectedImageIndex={setSelectedImageIndex}
      />
    </div>
  );
};

export default UserDetail;

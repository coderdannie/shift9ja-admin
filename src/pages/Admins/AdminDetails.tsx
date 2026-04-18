import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  User,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Plus,
  ArrowRight,
} from "lucide-react";
import { PRIVATE_PATHS } from "../../routes/constants";
import Button from "../../components/common/Button";
import {
  useGetAdminDetails,
  useDeleteAdmin,
  useUpdateAdmin,
  useToggleAdminStatus,
} from "../../services/query/adminMgt";
import { toast, Toaster } from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import EditAdminDrawer from "../../components/Modules/Admins/EditAdminDrawer";
import { format } from "date-fns";

const InfoCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}> = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#F2F4F7] shadow-sm hover:shadow-md transition-all duration-300 group">
    <div
      className={`p-3 rounded-xl ${color} text-white shadow-sm ring-4 ring-opacity-10 ring-current transition-transform group-hover:scale-110`}
    >
      <Icon size={20} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-0.5">
        {label}
      </span>
      <span className="text-sm font-bold text-[#101828] truncate">{value}</span>
    </div>
  </div>
);

const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}> = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-4 border-b border-[#F2F4F7] last:border-0 hover:bg-gray-50/20 transition-colors px-3 rounded-xl gap-2 sm:gap-6 group">
    <div className="flex items-center gap-3 shrink-0 sm:mt-0.5">
      {Icon && (
        <Icon
          size={18}
          className="text-[#98A2B3] group-hover:text-primary transition-colors shrink-0"
        />
      )}
      <span className="text-[#667085] font-bold text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    </div>
    <div className="text-[#101828] font-black text-sm sm:text-right break-all sm:break-words sm:max-w-[70%] leading-relaxed">
      {value}
    </div>
  </div>
);

const AdminDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    data: adminData,
    isPending: isLoading,
    isError,
  } = useGetAdminDetails(id || "");
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const { mutate: toggleStatus, isPending: isToggling } =
    useToggleAdminStatus();

  const admin = adminData?.data;

  const handleCopyId = () => {
    if (!admin) return;
    navigator.clipboard.writeText(admin.uuid);
    setCopied(true);
    toast.success("Admin ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (!admin) return;
    deleteAdmin(admin.uuid, {
      onSuccess: () => {
        toast.success("Admin deleted successfully");
        navigate(PRIVATE_PATHS.ADMINS);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete admin");
      },
    });
  };

  const handleToggleStatus = () => {
    setIsToggleModalOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!admin) return;
    toggleStatus(admin.uuid, {
      onSuccess: () => {
        toast.success(
          `Admin ${admin.isActive ? "deactivated" : "activated"} successfully`,
        );
        setIsToggleModalOpen(false);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to toggle status",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[#475467] font-bold text-sm animate-pulse">
          Fetching admin details...
        </p>
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner">
          <ShieldAlert size={40} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#101828] mb-2">
            Admin Not Found
          </h2>
          <p className="text-[#667085] max-w-xs mx-auto">
            The administrative user you are looking for does not exist or has
            been removed.
          </p>
        </div>
        <Button
          label="Back to Admins"
          variant="outline"
          onClick={() => navigate(PRIVATE_PATHS.ADMINS)}
          className="w-full max-w-[200px]"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full py-4 px-2 sm:px-6">
      <Toaster position="top-right" />

      {/* Breadcrumb & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={PRIVATE_PATHS.ADMINS}
          className="group inline-flex items-center gap-2 text-sm font-bold text-[#667085] transition-all hover:text-primary"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Admin Administration
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <Button
            label={admin.isActive ? "Deactivate" : "Activate"}
            variant="outline"
            className={`${admin.isActive ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"} font-bold px-6 py-2.5 !w-full sm:!w-auto`}
            onClick={handleToggleStatus}
            isLoading={isToggling}
          />
          <Button
            label="Delete Admin"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 font-bold px-6 py-2.5 !w-full sm:!w-auto"
            onClick={() => setIsDeleteModalOpen(true)}
          />
          <Button
            label="Edit Admin"
            className="px-8 py-2.5 font-bold shadow-lg shadow-primary/20 !w-full sm:!w-auto"
            onClick={() => setIsEditDrawerOpen(true)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[32px] border border-[#F2F4F7] shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Profile Banner-like Header */}
        <div className="relative p-5 sm:p-10 border-b border-[#F2F4F7] bg-gradient-to-br from-white to-[#F9FAFB]">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-[2rem] bg-primary flex items-center justify-center text-white font-black text-4xl shadow-2xl ring-8 ring-primary/5 transition-transform duration-300 group-hover:scale-105">
                {admin.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt={admin.firstName}
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                ) : (
                  <span>
                    {admin.firstName[0]}
                    {admin.lastName[0]}
                  </span>
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center shadow-md ${admin.isActive ? "bg-green-500" : "bg-red-500"}`}
              >
                {admin.isActive ? (
                  <ShieldCheck size={14} className="text-white" />
                ) : (
                  <ShieldAlert size={14} className="text-white" />
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex flex-col gap-3 text-center lg:text-left min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-3xl font-black text-[#101828] tracking-tight">
                  {admin.firstName} {admin.lastName}
                </h1>
                <span
                  className={`px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                    admin.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {admin.isActive ? "Active Member" : "Inactive"}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[#667085] text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-1.5 transition-colors hover:text-primary break-all">
                  <Mail size={16} className="shrink-0" />
                  {admin.email}
                </div>
                <span className="hidden sm:block text-[#D0D5DD]">•</span>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAECF0] rounded-xl cursor-pointer hover:bg-gray-50 transition-all group shadow-sm"
                  onClick={handleCopyId}
                >
                  <span className="font-mono text-[10px] sm:text-xs text-[#98A2B3]">
                    UUID: {admin.uuid.slice(0, 8)}...
                  </span>
                  {copied ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <Copy
                      size={12}
                      className="group-hover:text-primary transition-colors"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-5 sm:p-10 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <InfoCard
              icon={Calendar}
              label="Joined Date"
              value={format(new Date(admin.createdAt), "MMM dd, yyyy")}
              color="bg-blue-600"
            />
            <InfoCard
              icon={Clock}
              label="Last Activity"
              value={
                admin.lastLogin
                  ? format(new Date(admin.lastLogin), "hh:mm a")
                  : "Never"
              }
              color="bg-amber-600"
            />
            <InfoCard
              icon={Activity}
              label="Status"
              value={admin.isActive ? "Healthy" : "Restricted"}
              color={admin.isActive ? "bg-green-600" : "bg-red-600"}
            />
            <InfoCard
              icon={Shield}
              label="Primary Role"
              value={admin.roles[0]?.name || "Staff"}
              color="bg-primary"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* Left Column - System Information */}
            <div className="xl:col-span-4 flex flex-col gap-10">
              <section>
                <h2 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-primary rounded-full" />
                  Profile Details
                </h2>
                <div className="bg-[#F9FAFB]/50 rounded-2xl border border-[#F2F4F7] p-2">
                  <DetailRow
                    label="First Name"
                    value={admin.firstName}
                    icon={User}
                  />
                  <DetailRow
                    label="Last Name"
                    value={admin.lastName}
                    icon={User}
                  />
                  <DetailRow
                    label="Contact Email"
                    value={admin.email}
                    icon={Mail}
                  />
                  <DetailRow
                    label="Phone Number"
                    value={admin.phoneNumber || "Not provided"}
                    icon={Phone}
                  />
                  <DetailRow
                    label="Role Type"
                    value={admin.roles[0]?.name || "N/A"}
                    icon={Shield}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-[11px] font-black text-[#B42318] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-[#B42318] rounded-full" />
                  Administrative Audit
                </h2>
                <div className="bg-[#FEF3F2]/30 rounded-2xl border border-[#FECDCA] p-2">
                  <DetailRow
                    label="Account Created"
                    value={format(new Date(admin.createdAt), "MMMM dd, yyyy")}
                    icon={Calendar}
                  />
                  <DetailRow
                    label="Last Security Update"
                    value={format(new Date(admin.updatedAt), "MMMM dd, yyyy")}
                    icon={Clock}
                  />
                  <DetailRow
                    label="Access Level"
                    value={
                      <span className="text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">
                        Level {admin.roles.length} Access
                      </span>
                    }
                  />
                </div>
              </section>
            </div>

            {/* Right Column - Roles & Permissions Mapping */}
            <div className="xl:col-span-8 flex flex-col gap-10">
              <section className="bg-white rounded-2xl sm:rounded-[2rem] border-2 border-[#EAECF0] p-4 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-black text-[#101828] tracking-tight mb-1 flex items-center gap-3">
                      Assigned Roles & Context
                    </h2>
                    <p className="text-sm text-[#667085] font-medium">
                      Detailed overview of administrative capabilities and
                      scope.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0 hidden sm:flex">
                    <Shield size={22} />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {admin.roles.map((role) => (
                    <div
                      key={role.uuid}
                      className="bg-white rounded-2xl border border-[#EAECF0] p-4 sm:p-6 shadow-sm hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-50 rounded-xl text-[#344054] shrink-0">
                            <Shield size={20} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[#101828] text-lg truncate">
                              {role.name}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-[#667085] font-bold mt-1 uppercase tracking-wider">
                              {role.description}
                            </p>
                          </div>
                        </div>
                        <span className="w-fit bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-green-200">
                          Active Role
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-[#98A2B3] uppercase tracking-[0.2em] mb-4">
                          Granted Permissions ({role.permissions.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-[10px] sm:text-[11px] font-bold text-[#344054] transition-all hover:bg-white hover:border-primary/30 hover:shadow-md cursor-default flex items-center gap-2 group"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                              {perm.replace(".", " • ").replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-[#F9FAFB] rounded-[2rem] p-8 border border-[#EAECF0] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-[#F2F4F7] shrink-0">
                  <Activity size={32} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-black text-[#101828] mb-1">
                    Administrative Action Log
                  </h3>
                  <p className="text-sm text-[#667085] font-medium leading-relaxed">
                    View all historical actions, changes, and system
                    interactions performed by this administrator.
                  </p>
                </div>
                <Button
                  label="View Activity"
                  variant="outline"
                  fullWidth={false}
                  className="px-6 font-bold border-[#D0D5DD]"
                  icon={<ArrowRight size={18} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Revoke Admin Access"
        description={`You are about to permanently delete ${admin.firstName} ${admin.lastName}. This action will revoke all access to the administrative dashboard immediately.`}
        confirmLabel={isDeleting ? "Revoking..." : "Confirm Deletion"}
        variant="danger"
        isLoading={isDeleting}
      />

      <ConfirmModal
        isOpen={isToggleModalOpen}
        onClose={() => setIsToggleModalOpen(false)}
        onConfirm={confirmToggleStatus}
        title={`${admin.isActive ? "Deactivate" : "Activate"} Admin Account`}
        description={`Are you sure you want to ${admin.isActive ? "deactivate" : "activate"} ${admin.firstName} ${admin.lastName}? ${admin.isActive ? "The user will no longer be able to access the dashboard." : "Access will be restored immediately."}`}
        confirmLabel={
          isToggling
            ? "Processing..."
            : admin.isActive
              ? "Confirm Deactivation"
              : "Confirm Activation"
        }
        variant={admin.isActive ? "warning" : "info"}
        isLoading={isToggling}
      />

      <EditAdminDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        admin={admin}
      />
    </div>
  );
};

export default AdminDetails;

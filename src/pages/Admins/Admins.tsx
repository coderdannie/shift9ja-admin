import React, { useState, useMemo } from "react";
import { Search, UserPlus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminTable from "../../components/Modules/Admins/AdminTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import InviteAdminDrawer from "../../components/Modules/Admins/InviteAdminDrawer";
import EditAdminDrawer from "../../components/Modules/Admins/EditAdminDrawer";
import { PRIVATE_PATHS } from "../../routes/constants";
import {
  useGetAdmins,
  useDeleteAdmin,
  useToggleAdminStatus,
} from "../../services/query/adminMgt";
import { toast, Toaster } from "react-hot-toast";
import type { AdminUser } from "../../types/admin";

const AdminsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: adminsData, isPending: isLoading, refetch } = useGetAdmins();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const { mutate: toggleStatus, isPending: isToggling } =
    useToggleAdminStatus();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<any | null>(null);
  const [adminToToggle, setAdminToToggle] = useState<any | null>(null);

  const admins = useMemo(() => {
    return (adminsData?.data || []).map((admin: AdminUser) => ({
      id: admin.uuid,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role:
        admin.roles && admin.roles.length > 0 ? admin.roles[0].name : "No Role",
      status: (admin.isActive ? "active" : "inactive") as "active" | "inactive",
      avatar: admin.avatarUrl,
    }));
  }, [adminsData]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
      const email = admin.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [searchQuery, admins]);

  const handleViewClick = (admin: any) => {
    navigate(`/admins/${admin.id}`);
  };

  const handleEditClick = (admin: any) => {
    setSelectedAdmin(admin);
    setIsEditDrawerOpen(true);
  };

  const handleDeleteClick = (admin: any) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!adminToDelete) return;

    deleteAdmin(adminToDelete.id, {
      onSuccess: () => {
        toast.success("Admin deleted successfully");
        setIsDeleteModalOpen(false);
        setAdminToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete admin");
      },
    });
  };

  const handleToggleStatus = (admin: any) => {
    setAdminToToggle(admin);
    setIsToggleModalOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!adminToToggle) return;

    toggleStatus(adminToToggle.id, {
      onSuccess: () => {
        toast.success(
          `Admin ${adminToToggle.status === "active" ? "deactivated" : "activated"} successfully`,
        );
        setIsToggleModalOpen(false);
        setAdminToToggle(null);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to toggle status",
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      <Toaster position="top-right" />
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">Admins</h1>
          <p className="text-[#667085] text-sm mt-1">
            Manage all administrative users and their permissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center gap-2 bg-white text-[#344054] border border-[#D0D5DD] px-5 py-3 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            onClick={() => navigate(PRIVATE_PATHS.ROLES_MANAGEMENT)}
          >
            <Shield size={20} className="text-primary" />
            Manage Roles
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 font-semibold"
            onClick={() => setIsInviteDrawerOpen(true)}
          >
            <UserPlus size={20} />
            Invite Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[600px]">
        {/* Search Bar Container */}
        <div className="p-6 border-b border-[#F2F4F7]">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
            />
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Admins Table */}
        <div className="p-6">
          <AdminTable
            admins={filteredAdmins}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Invite Admin Drawer */}
      <InviteAdminDrawer
        isOpen={isInviteDrawerOpen}
        onClose={() => setIsInviteDrawerOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Edit Admin Drawer */}
      <EditAdminDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        description={`Are you sure you want to delete ${adminToDelete?.firstName} ${adminToDelete?.lastName}? This action cannot be undone and they will lose all administrative access.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Toggle Status Confirmation Modal */}
      <ConfirmModal
        isOpen={isToggleModalOpen}
        onClose={() => setIsToggleModalOpen(false)}
        onConfirm={confirmToggleStatus}
        title={`${adminToToggle?.status === "active" ? "Deactivate" : "Activate"} Admin Account`}
        description={`Are you sure you want to ${adminToToggle?.status === "active" ? "deactivate" : "activate"} ${adminToToggle?.firstName} ${adminToToggle?.lastName}? ${adminToToggle?.status === "active" ? "The user will no longer be able to access the dashboard." : "Access will be restored immediately."}`}
        confirmLabel={
          isToggling
            ? "Processing..."
            : adminToToggle?.status === "active"
              ? "Confirm Deactivation"
              : "Confirm Activation"
        }
        variant={adminToToggle?.status === "active" ? "warning" : "info"}
        isLoading={isToggling}
      />
    </div>
  );
};

export default AdminsPage;

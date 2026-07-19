import React, { useState } from "react";
import { Plus, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleTable from "../../components/Modules/Admins/RoleTable";
import { PRIVATE_PATHS } from "../../routes/constants";
import ConfirmModal from "../../components/Modals/ConfirmModal";

import { useGetRoles, useDeleteRole } from "../../services/query/adminMgt";
import { toast, Toaster } from "react-hot-toast";

const ManageRoles: React.FC = () => {
  const navigate = useNavigate();
  const { data: rolesData, isPending: isLoading, refetch } = useGetRoles();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any | null>(null);

  const roles = rolesData?.data || [];

  const handleDeleteClick = (role: any) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!roleToDelete) return;
    deleteRole(roleToDelete.uuid, {
      onSuccess: () => {
        toast.success("Role deleted successfully");
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete role");
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      <Toaster position="top-right" />
      {/* Breadcrumbs/Back Navigation */}
      <button
        onClick={() => navigate(PRIVATE_PATHS.ADMINS)}
        className="flex items-center gap-2 text-[#667085] hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-semibold">Back to Admins</span>
      </button>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              Role Management
            </h1>
            <p className="text-[#667085] text-sm mt-1">
              Define and manage administrative permissions and accessibility.
            </p>
          </div>
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 font-semibold"
          onClick={() => navigate(PRIVATE_PATHS.CREATE_ROLE)}
        >
          <Plus size={20} />
          Create New Role
        </button>
      </div>

      {/* Roles Table Container */}
      <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[500px] p-6">
        <RoleTable
          roles={roles}
          onEdit={(role) =>
            navigate(PRIVATE_PATHS.EDIT_ROLE.replace(":id", role.uuid))
          }
          onDelete={handleDeleteClick}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Role"
        description={`Are you sure you want to delete the "${roleToDelete?.name}" role? This might affect ${roleToDelete?.adminsCount || 0} admins assigned to this role.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete Role"}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageRoles;

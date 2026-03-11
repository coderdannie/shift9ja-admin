import React, { useState } from 'react';
import { Plus, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleTable from '../../Modules/Admins/RoleTable';
import type { Role } from '../../Modules/Admins/RoleTable';
import { PRIVATE_PATHS } from '../../routes/constants';
import ConfirmModal from '../../components/common/ConfirmModal';

const MOCK_ROLES: Role[] = [
  { id: '1', name: 'Super Admin', adminCount: 2, permissions: ['all'] },
  { id: '2', name: 'Admin', adminCount: 5, permissions: ['view_users', 'edit_users', 'view_tasks'] },
  { id: '3', name: 'Moderator', adminCount: 3, permissions: ['view_tasks', 'edit_tasks'] },
  { id: '4', name: 'Support', adminCount: 8, permissions: ['view_users', 'view_notifications'] },
];

const ManageRoles: React.FC = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting role:', roleToDelete?.name);
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
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
            <h1 className="text-2xl font-bold text-[#101828]">Role Management</h1>
            <p className="text-[#667085] text-sm mt-1">Define and manage administrative permissions and accessibility.</p>
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
          roles={MOCK_ROLES} 
          onEdit={(role) => navigate(`/admins/roles/${role.id}`)}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Role"
        description={`Are you sure you want to delete the "${roleToDelete?.name}" role? This might affect ${roleToDelete?.adminCount} admins assigned to this role.`}
        confirmLabel="Delete Role"
        variant="danger"
      />
    </div>
  );
};

export default ManageRoles;

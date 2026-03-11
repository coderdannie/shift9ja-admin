import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminTable from '../../Modules/Admins/AdminTable';
import type { Admin } from '../../Modules/Admins/AdminTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import InviteAdminDrawer from '../../Modules/Admins/InviteAdminDrawer';
import EditAdminDrawer from '../../Modules/Admins/EditAdminDrawer';
import { PRIVATE_PATHS } from '../../routes/constants';

const MOCK_ADMINS: Admin[] = [
// ... existing mock data
];

const AdminsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
// ...
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  const filteredAdmins = useMemo(() => {
    return MOCK_ADMINS.filter((admin) => {
      const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
      const email = admin.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [searchQuery]);

  const handleEditClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditDrawerOpen(true);
  };

  const handleDeleteClick = (admin: Admin) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const handleInviteAdmin = (data: any) => {
    console.log('Inviting Admin:', data);
    setIsInviteDrawerOpen(false);
  };

  const handleUpdateAdmin = (data: any) => {
    console.log('Updating Admin:', data);
    setIsEditDrawerOpen(false);
    setSelectedAdmin(null);
  };

  const confirmDelete = () => {
    // In a real app, we'd call the delete API here
    console.log(`Deleting admin: ${adminToDelete?.firstName} ${adminToDelete?.lastName}`);
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">Admins</h1>
          <p className="text-[#667085] text-sm mt-1">Manage all administrative users and their permissions.</p>
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
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Invite Admin Drawer */}
      <InviteAdminDrawer 
        isOpen={isInviteDrawerOpen}
        onClose={() => setIsInviteDrawerOpen(false)}
        onInvite={handleInviteAdmin}
      />

      {/* Edit Admin Drawer */}
      <EditAdminDrawer 
        isOpen={isEditDrawerOpen}
        onClose={() => {
            setIsEditDrawerOpen(false);
            setSelectedAdmin(null);
        }}
        onUpdate={handleUpdateAdmin}
        admin={selectedAdmin}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        description={`Are you sure you want to delete ${adminToDelete?.firstName} ${adminToDelete?.lastName}? This action cannot be undone and they will lose all administrative access.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

export default AdminsPage;

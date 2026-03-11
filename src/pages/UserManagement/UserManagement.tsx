import React, { useState, useMemo } from 'react';
import { Users, UserCheck, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Filter, Download } from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import UserStatsBar from '../../Modules/UserManagement/UserStatsBar';
import UserSearchBar from '../../Modules/UserManagement/UserSearchBar';
import UserTabs from '../../Modules/UserManagement/UserTabs';
import type { TabType } from '../../Modules/UserManagement/UserTabs';
import UserTable from '../../Modules/UserManagement/UserTable';
import type { User } from '../../Modules/UserManagement/UserTable';
import { toast, Toaster } from 'react-hot-toast';

const USERS_PER_PAGE = 5;

const MOCK_CLIENTS: User[] = [
  { id: '1', fullName: 'Seun Adedayo', email: 'sadebayo@gmail.com', phone: '08097654321', city: 'Ibadan', taskPosted: 5, disputeCount: 5, status: 'verified' },
  { id: '2', fullName: 'Seun Adedayo', email: 'sadebayo@gmail.com', phone: '08097654321', city: 'Ibadan', taskPosted: 5, disputeCount: 5, status: 'verified' },
  { id: '3', fullName: 'Seun Adedayo', email: 'sadebayo@gmail.com', phone: '08097654321', city: 'Ibadan', taskPosted: 4, disputeCount: 4, status: 'verified' },
  { id: '4', fullName: 'Seun Adedayo', email: 'sadebayo@gmail.com', phone: '08097654321', city: 'Ibadan', taskPosted: 5, disputeCount: 5, status: 'verified' },
  { id: '5', fullName: 'Seun Adedayo', email: 'sadebayo@gmail.com', phone: '08097654321', city: 'Ibadan', taskPosted: 3, disputeCount: 3, status: 'not_verified' },
  { id: '6', fullName: 'Amara Okonkwo', email: 'amara@gmail.com', phone: '08012345678', city: 'Lagos', taskPosted: 8, disputeCount: 1, status: 'verified' },
  { id: '7', fullName: 'Emeka Nwosu', email: 'emeka@gmail.com', phone: '08023456789', city: 'Abuja', taskPosted: 2, disputeCount: 2, status: 'suspended' },
  { id: '8', fullName: 'Fatima Bello', email: 'fatima@gmail.com', phone: '08034567890', city: 'Kano', taskPosted: 6, disputeCount: 0, status: 'verified' },
];

const MOCK_HELPERS: User[] = [
  { id: 'h1', fullName: 'Chioma James', email: 'chioma@gmail.com', phone: '08011223344', city: 'Lagos', tasksCompleted: 14, disputeCount: 1, status: 'verified' },
  { id: 'h2', fullName: 'Biodun Adeleke', email: 'biodun@gmail.com', phone: '08022334455', city: 'Ibadan', tasksCompleted: 9, disputeCount: 2, status: 'verified' },
  { id: 'h3', fullName: 'Kola Abiodun', email: 'kola@gmail.com', phone: '08033445566', city: 'Abuja', tasksCompleted: 3, disputeCount: 4, status: 'not_verified' },
  { id: 'h4', fullName: 'Ngozi Eze', email: 'ngozi@gmail.com', phone: '08044556677', city: 'Enugu', tasksCompleted: 21, disputeCount: 0, status: 'verified' },
  { id: 'h5', fullName: 'Yusuf Garba', email: 'yusuf@gmail.com', phone: '08055667788', city: 'Kano', tasksCompleted: 7, disputeCount: 3, status: 'suspended' },
];

const stats = [
  { title: 'Total Users', value: '12,842', icon: Users },
  { title: 'Active Users', value: '9,306', icon: Users },
  { title: 'Verified Helpers', value: '8,621', icon: UserCheck },
  { title: 'Flagged Accounts', value: '3', icon: Flag },
];

type ActionType = 'suspend' | 'unsuspend' | 'ban' | null;

const UserManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('client');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState({ client: MOCK_CLIENTS, helper: MOCK_HELPERS });

  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionType>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const allUsers = activeTab === 'client' ? users.client : users.helper;

  const filtered = useMemo(() =>
    allUsers.filter((u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
    ), [allUsers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch('');
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
    openModal(u, u.status === 'suspended' ? 'unsuspend' : 'suspend');
  };

  const handleBan = (u: User) => openModal(u, 'ban');

  const handleConfirm = () => {
    if (!selectedUser || !pendingAction) return;
    setActionLoading(true);
    setTimeout(() => {
      const newStatus: User['status'] =
        pendingAction === 'suspend' ? 'suspended' :
        pendingAction === 'unsuspend' ? 'verified' :
        'not_verified';

      const updateList = (list: User[]) =>
        list.map((u) => u.id === selectedUser.id ? { ...u, status: newStatus } : u);

      setUsers((prev) => ({
        client: updateList(prev.client),
        helper: updateList(prev.helper),
      }));

      const messages: Record<NonNullable<ActionType>, string> = {
        suspend: `${selectedUser.fullName} has been suspended.`,
        unsuspend: `${selectedUser.fullName} has been unsuspended.`,
        ban: `${selectedUser.fullName} has been banned.`,
      };

      toast.success(messages[pendingAction]);
      setActionLoading(false);
      closeModal();
    }, 1000);
  };

  const modalConfig = {
    suspend: {
      title: 'Suspend User',
      description: `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`,
      confirmLabel: 'Suspend',
      variant: 'warning' as const,
    },
    unsuspend: {
      title: 'Unsuspend User',
      description: `Are you sure you want to restore access for ${selectedUser?.fullName}?`,
      confirmLabel: 'Unsuspend',
      variant: 'info' as const,
    },
    ban: {
      title: 'Ban User',
      description: `Are you sure you want to permanently ban ${selectedUser?.fullName}? This action is irreversible.`,
      confirmLabel: 'Ban User',
      variant: 'danger' as const,
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
          <h1 className="text-[28px] font-bold text-[#101828]">User Management</h1>
          <p className="text-[#475467] text-sm mt-1">Manage all clients and helpers on Shift9ja</p>
        </div>
        <div className="flex items-center gap-3">
          <Button label="Filter" variant="outline" fullWidth={false} className="!h-10 border-[#F2F4F7]" icon={<Filter size={18} />} />
          <Button label="Export Data" variant="primary" fullWidth={false} className="!h-10 px-6" icon={<Download size={18} />} />
        </div>
      </div>

      <UserStatsBar stats={stats} />
      <UserSearchBar value={search} onChange={(v) => { setSearch(v); setCurrentPage(1); }} />
      <UserTabs activeTab={activeTab} onChange={handleTabChange} />

      <UserTable
        users={paginated}
        type={activeTab}
        onView={(u) => navigate(`/user-management/${u.id}`)}
        onEdit={(u) => navigate(`/user-management/${u.id}/edit`)}
        onSuspend={handleSuspend}
        onBan={handleBan}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default UserManagement;

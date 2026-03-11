import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Check, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';

interface PermissionGroup {
  category: string;
  permissions: {
    id: string;
    name: string;
    description: string;
  }[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'User Management',
    permissions: [
      { id: 'view_users', name: 'View Users', description: 'Can view the list of all users and their details.' },
      { id: 'edit_users', name: 'Edit Users', description: 'Can update user profiles and account status.' },
      { id: 'suspend_users', name: 'Suspend Users', description: 'Can temporarily or permanently suspend user accounts.' },
    ],
  },
  {
    category: 'Task Management',
    permissions: [
      { id: 'view_tasks', name: 'View Tasks', description: 'Can view all tasks and their progress.' },
      { id: 'edit_tasks', name: 'Edit Tasks', description: 'Can update task details and assignments.' },
      { id: 'resolve_disputes', name: 'Resolve Disputes', description: 'Can arbitrate and resolve task disputes.' },
    ],
  },
  {
    category: 'Finance & Escrow',
    permissions: [
      { id: 'view_escrow', name: 'View Escrow', description: 'Can view escrow transactions and balances.' },
      { id: 'release_funds', name: 'Release Funds', description: 'Can manually release funds from escrow.' },
      { id: 'process_refunds', name: 'Process Refunds', description: 'Can process payment refunds for tasks.' },
    ],
  },
  {
    category: 'Admin Management',
    permissions: [
      { id: 'manage_admins', name: 'Manage Admins', description: 'Can invite, edit, and delete other admins.' },
      { id: 'manage_roles', name: 'Manage Roles', description: 'Can create and define system roles and permissions.' },
    ],
  },
];

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // In a real app, fetch role data here
      setRoleName('Admin');
      setSelectedPermissions(['view_users', 'view_tasks', 'view_escrow']);
    }
  }, [isEdit, id]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId) 
        : [...prev, permId]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Saving Role:', { roleName, selectedPermissions });
      setIsLoading(false);
      navigate(PRIVATE_PATHS.ROLES_MANAGEMENT);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(PRIVATE_PATHS.ROLES_MANAGEMENT)}
        className="flex items-center gap-2 text-[#667085] hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-semibold">Back to Roles</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              {isEdit ? 'Edit Role' : 'Create New Role'}
            </h1>
            <p className="text-[#667085] text-sm mt-1">
              Define a role and assign specific permissions to it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm p-8 h-fit sticky top-8">
            <h3 className="text-lg font-bold text-[#101828] mb-6">General Information</h3>
            <FormInput 
              label="Role Name"
              name="roleName"
              type="text"
              placeholder="e.g. Content Moderator"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              onBlur={() => {}}
            />
            <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed font-semibold">
                By creating this role, you define a set of actions that any admin assigned to it can perform. Choose wisely.
              </p>
            </div>
            
            <div className="mt-12 space-y-3">
               <Button 
                label={isEdit ? "Update Role" : "Create Role"}
                variant="primary"
                fullWidth
                onClick={handleSave}
                isLoading={isLoading}
                className="!h-12 font-bold shadow-md shadow-primary/20"
                disabled={!roleName || selectedPermissions.length === 0}
               />
               <Button 
                label="Cancel"
                variant="outline"
                fullWidth
                onClick={() => navigate(PRIVATE_PATHS.ROLES_MANAGEMENT)}
                className="!h-12 font-bold border-[#D0D5DD]"
                disabled={isLoading}
               />
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="lg:col-span-2 space-y-6 pb-12">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.category} className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#F2F4F7]">
                <h4 className="text-sm font-bold text-[#344054] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {group.category}
                </h4>
              </div>
              <div className="divide-y divide-[#F2F4F7]">
                {group.permissions.map((perm) => {
                  const isSelected = selectedPermissions.includes(perm.id);
                  return (
                    <div 
                      key={perm.id} 
                      className={`px-6 py-5 flex items-start justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/[0.02]' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => togglePermission(perm.id)}
                    >
                      <div className="flex-1 pr-6">
                        <p className={`text-sm font-bold transition-colors ${isSelected ? 'text-primary' : 'text-[#101828]'}`}>
                          {perm.name}
                        </p>
                        <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                          {perm.description}
                        </p>
                      </div>
                      <div className={`
                        w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected ? 'bg-primary border-primary' : 'border-[#D0D5DD] bg-white'}
                      `}>
                        {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateRole;

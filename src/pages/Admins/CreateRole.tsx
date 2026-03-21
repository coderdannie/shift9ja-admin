import React, { useState, useEffect, useMemo } from 'react';
import { Shield, ArrowLeft, Check, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import { useGetPermissions, useGetRoleDetails, useCreateRole, useUpdateRole } from '../../services/query/adminMgt';
import { toast, Toaster } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data: permissionsData, isPending: isLoadingPermissions } = useGetPermissions();
  const { data: roleDetailData, isPending: isLoadingRole } = useGetRoleDetails(id || '', { enabled: isEdit });
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  const permissionGroups = useMemo(() => {
    if (!permissionsData?.data) return [];
    return permissionsData.data.map((group) => ({
      category: group.name,
      permissions: group.permissions.map((perm: any) => {
        const permId = typeof perm === 'string' ? perm : (perm.key || perm.id || JSON.stringify(perm));
        const permName = typeof perm === 'string' 
          ? (perm.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || perm)
          : (perm.label || perm.name || permId);
        const permDesc = typeof perm === 'string'
          ? `Can perform ${perm.split('.').pop()?.replace(/_/g, ' ')} actions in ${group.name.toLowerCase()}.`
          : (perm.description || `Can perform actions in ${group.name.toLowerCase()}.`);
          
        return {
          id: permId,
          name: permName,
          description: permDesc,
        };
      }),
    }));
  }, [permissionsData]);

  useEffect(() => {
    if (isEdit && roleDetailData?.data) {
      const role = roleDetailData.data;
      setRoleName(role.name);
      setRoleDescription(role.description || '');
      setSelectedPermissions(role.permissions || []);
    }
  }, [isEdit, roleDetailData]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId) 
        : [...prev, permId]
    );
  };

  const handleSave = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmSave = async () => {
    const payload = {
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
    };

    if (isEdit && id) {
      updateRole({ uuid: id, payload }, {
        onSuccess: () => {
          toast.success('Role updated successfully');
          setIsConfirmModalOpen(false);
          navigate(PRIVATE_PATHS.ROLES_MANAGEMENT);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update role');
        }
      });
    } else {
      createRole(payload, {
        onSuccess: () => {
          toast.success('Role created successfully');
          setIsConfirmModalOpen(false);
          navigate(PRIVATE_PATHS.ROLES_MANAGEMENT);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to create role');
        }
      });
    }
  };

  const isSaving = isCreating || isUpdating;
  const isLoading = isLoadingPermissions || (isEdit && isLoadingRole);

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      <Toaster position="top-right" />
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
            <div className="space-y-6">
              <FormInput 
                label="Role Name"
                name="roleName"
                type="text"
                placeholder="e.g. Content Moderator"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                onBlur={() => {}}
              />
              <FormInput 
                label="Description"
                name="description"
                type="text"
                placeholder="e.g. Manages platform content"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                onBlur={() => {}}
              />
            </div>
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
                isLoading={isSaving}
                className="!h-12 font-bold shadow-md shadow-primary/20"
                disabled={!roleName || selectedPermissions.length === 0 || isLoading}
               />
               <Button 
                label="Cancel"
                variant="outline"
                fullWidth
                onClick={() => navigate(PRIVATE_PATHS.ROLES_MANAGEMENT)}
                className="!h-12 font-bold border-[#D0D5DD]"
                disabled={isSaving}
               />
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="lg:col-span-2 space-y-6 pb-12">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-[#F2F4F7] min-h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            permissionGroups.map((group) => (
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
            ))
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmSave}
        title={isEdit ? "Update Administrative Role" : "Create New Administrative Role"}
        description={`Are you sure you want to ${isEdit ? 'update' : 'create'} the "${roleName}" role? This will immediately affect all administrators assigned to this role.`}
        confirmLabel={isSaving ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Confirm Update" : "Confirm Creation")}
        variant="info"
        isLoading={isSaving}
      />
    </div>
  );
};

export default CreateRole;

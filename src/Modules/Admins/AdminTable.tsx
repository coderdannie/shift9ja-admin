import React from 'react';
import { MoreVertical, Edit2, Trash2, Mail, Shield } from 'lucide-react';
import CustomTable from '../../components/common/CustomTable';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

interface AdminTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  isLoading?: boolean;
}

const AdminTable: React.FC<AdminTableProps> = ({ admins, onEdit, onDelete, isLoading }) => {
  const headers = ['Team Name', 'Email', 'Role', 'Status', 'Actions'];

  return (
    <CustomTable headers={headers} isLoading={isLoading}>
      {admins.map((admin) => (
        <tr key={admin.id} className="hover:bg-[#F9FAFB] transition-colors group">
          {/* Team Name with Avatar */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden border border-[#EAECF0]">
                {admin.avatar ? (
                  <img src={admin.avatar} alt={admin.firstName} className="w-full h-full object-cover" />
                ) : (
                  <span className="uppercase">{admin.firstName[0]}{admin.lastName[0]}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#101828]">
                  {admin.firstName} {admin.lastName}
                </div>
                <div className="text-xs text-[#667085]">@{admin.firstName.toLowerCase()}_{admin.lastName.toLowerCase()}</div>
              </div>
            </div>
          </td>

          {/* Email */}
          <td className="px-6 py-4 text-sm text-[#475467]">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#98A2B3]" />
              {admin.email}
            </div>
          </td>

          {/* Role */}
          <td className="px-6 py-4 text-sm text-[#475467]">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F2F4F7] border border-[#EAECF0] w-fit">
              <Shield size={12} className="text-primary" />
              <span className="text-xs font-medium">{admin.role}</span>
            </div>
          </td>

          {/* Status */}
          <td className="px-6 py-4">
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
              admin.status === 'active' 
                ? 'bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]' 
                : 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                admin.status === 'active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
              }`} />
              {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
            </div>
          </td>

          {/* Actions */}
          <td className="px-6 py-4 text-right">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="p-2 hover:bg-[#F2F4F7] rounded-lg transition-colors text-[#98A2B3] group-hover:text-primary">
                  <MoreVertical size={18} />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-[#F2F4F7] rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-20">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onEdit(admin)}
                          className={`${
                            active ? 'bg-[#F9FAFB] text-primary' : 'text-[#344054]'
                          } group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors`}
                        >
                          <Edit2 size={16} />
                          Edit Admin
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDelete(admin)}
                          className={`${
                            active ? 'bg-[#FEF3F2] text-[#B42318]' : 'text-[#B42318]'
                          } group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors`}
                        >
                          <Trash2 size={16} />
                          Delete Admin
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </td>
        </tr>
      ))}
    </CustomTable>
  );
};

export default AdminTable;

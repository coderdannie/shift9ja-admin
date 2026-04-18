import React from "react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Mail,
  Shield,
  Eye,
  Power,
} from "lucide-react";
import CustomTable from "../../common/CustomTable";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar?: string | null;
}

interface AdminTableProps {
  admins: Admin[];
  onView: (admin: Admin) => void;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onToggleStatus: (admin: Admin) => void;
  isLoading?: boolean;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}) => {
  const headers = ["Team Name", "Email", "Role", "Status", "Actions"];

  return (
    <CustomTable headers={headers} isLoading={isLoading}>
      {admins.map((admin) => (
        <tr
          key={admin.id}
          className="hover:bg-[#F9FAFB] transition-colors group"
        >
          {/* Team Name with Avatar */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden border border-[#EAECF0]">
                {admin.avatar ? (
                  <img
                    src={admin.avatar}
                    alt={admin.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="uppercase">
                    {admin.firstName[0]}
                    {admin.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#101828]">
                  {admin.firstName} {admin.lastName}
                </div>
                <div className="text-xs text-[#667085]">
                  @{admin.firstName.toLowerCase()}_
                  {admin.lastName.toLowerCase()}
                </div>
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
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${
                admin.status === "active"
                  ? "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]"
                  : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  admin.status === "active" ? "bg-[#12B76A]" : "bg-[#F04438]"
                }`}
              />
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
                <Menu.Items
                  anchor="bottom end"
                  className="w-48 origin-top-right divide-y divide-[#F2F4F7] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-[100] p-1.5 [--anchor-gap:8px]"
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onView(admin)}
                          className={`${
                            active
                              ? "bg-[#F9FAFB] text-primary"
                              : "text-[#344054]"
                          } group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200`}
                        >
                          <Eye
                            size={18}
                            className={`${active ? "text-primary" : "text-[#667085]"}`}
                          />
                          View Details
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onEdit(admin)}
                          className={`${
                            active
                              ? "bg-[#F9FAFB] text-primary"
                              : "text-[#344054]"
                          } group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200`}
                        >
                          <Edit2
                            size={18}
                            className={`${active ? "text-primary" : "text-[#667085]"}`}
                          />
                          Edit Admin
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onToggleStatus(admin)}
                          className={`${
                            active
                              ? "bg-[#F9FAFB] text-primary"
                              : "text-[#344054]"
                          } group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200`}
                        >
                          <Power
                            size={18}
                            className={`${active ? "text-primary" : admin.status === "active" ? "text-amber-500" : "text-green-500"}`}
                          />
                          {admin.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDelete(admin)}
                          className={`${
                            active
                              ? "bg-[#FEF3F2] text-[#B42318]"
                              : "text-[#B42318]"
                          } group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200`}
                        >
                          <Trash2 size={18} className="text-[#B42318]" />
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

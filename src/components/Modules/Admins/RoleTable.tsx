import React from "react";
import { MoreVertical, Edit2, Trash2, Users } from "lucide-react";
import CustomTable from "../../common/CustomTable.tsx";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import type { Role } from "../../../types/index.ts";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  isLoading?: boolean;
}

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const headers = [
    "Role Name",
    "Admins Assigned",
    "Permissions Count",
    "Actions",
  ];

  return (
    <CustomTable headers={headers} isLoading={isLoading}>
      {roles.map((role) => (
        <tr
          key={role.uuid}
          className="hover:bg-[#F9FAFB] transition-colors group"
        >
          {/* Role Name */}
          <td className="px-6 py-4">
            <div className="text-sm font-bold text-[#101828]">{role.name}</div>
            <div className="text-xs text-[#667085] mt-0.5">
              {role.description || "Custom Security Role"}
            </div>
          </td>

          {/* Admin Count */}
          <td className="px-6 py-4 text-sm text-[#475467]">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#98A2B3]" />
              <span className="font-semibold">{role.adminsCount || 0}</span>
              <span className="text-[#667085]">Admins</span>
            </div>
          </td>

          {/* Permissions Count */}
          <td className="px-6 py-4 text-sm text-[#475467]">
            <div className="px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 w-fit text-xs font-bold">
              {role.permissions?.length || 0} Permissions
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
                          onClick={() => onEdit(role)}
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
                          Edit Role
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDelete(role)}
                          className={`${
                            active
                              ? "bg-[#FEF3F2] text-[#B42318]"
                              : "text-[#B42318]"
                          } group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200`}
                        >
                          <Trash2 size={18} className="text-[#B42318]" />
                          Delete Role
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

export default RoleTable;

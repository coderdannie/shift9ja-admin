import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import CustomTable from "../../common/CustomTable";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  taskPosted?: number;
  tasksCompleted?: number;
  disputeCount: number;
  status: "verified" | "not_verified" | "suspended" | "pending" | "rejected" | "awaiting_otp";
}

interface UserTableProps {
  users: User[];
  type: "client" | "helper";
  isLoading?: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onSuspend: (user: User) => void;
  onBan: (user: User) => void;
}

const statusMap = {
  verified: {
    label: "Verified",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  not_verified: {
    label: "Not verified",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  suspended: {
    label: "Suspended",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  pending: {
    label: "Pending",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  awaiting_otp: {
    label: "Awaiting OTP",
    dot: "bg-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

const StatusBadge: React.FC<{ status: User["status"] | string }> = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() as keyof typeof statusMap;
  const s = statusMap[normalizedStatus] || {
    label: status || "Unknown",
    dot: "bg-gray-500",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

interface ActionMenuProps {
  user: User;
  onView: (u: User) => void;
  onEdit: (u: User) => void;
  onSuspend: (u: User) => void;
  onBan: (u: User) => void;
}

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Portal,
} from "@headlessui/react";

const ActionMenu: React.FC<ActionMenuProps> = ({
  user,
  onView,
  onEdit,
  onSuspend,
  onBan,
}) => {
  const actions = [
    { label: "View", fn: onView, color: "text-[#344054]" },
    { label: "Edit", fn: onEdit, color: "text-primary" },
    {
      label: user.status === "suspended" ? "Unsuspend" : "Suspend",
      fn: onSuspend,
      color: "text-amber-600",
    },
    { label: "Ban", fn: onBan, color: "text-red-600" },
  ];

  return (
    <div className="flex justify-center">
      <Menu
        as="div"
        className="relative inline-block text-left"
        aria-label="User actions"
      >
        <MenuButton className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none">
          <MoreVertical size={18} className="text-[#667085]" />
        </MenuButton>

        <Portal>
          <MenuItems
            anchor="bottom end"
            className="z-[9999] mt-1 w-36 origin-top-right rounded-xl border border-[#F2F4F7] bg-white py-1 shadow-lg  focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {actions.map(({ label, fn, color }) => (
              <MenuItem key={label}>
                {({ focus }) => (
                  <button
                    onClick={() => fn(user)}
                    className={`${
                      focus ? "bg-gray-50" : ""
                    } flex w-full items-center px-4 py-2.5 text-sm font-medium transition-colors ${color}`}
                  >
                    {label}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Portal>
      </Menu>
    </div>
  );
};

const CLIENT_HEADERS = [
  "Full Name",
  "Email",
  "Phone number",
  "City",
  "KYC status",
  "Actions",
];
const HELPER_HEADERS = [
  "Full Name",
  "Email",
  "Phone number",
  "City",
  "Tasks completed",
  "KYC status",
  "Actions",
];

const UserTable: React.FC<UserTableProps> = ({
  users,
  type,
  isLoading = false,
  onView,
  onEdit,
  onSuspend,
  onBan,
}) => {
  const isClient = type === "client";
  const headers = isClient ? CLIENT_HEADERS : HELPER_HEADERS;

  return (
    <CustomTable headers={headers} isLoading={isLoading}>
      {users.length === 0 && !isLoading ? (
        <tr>
          <td
            colSpan={headers.length}
            className="px-6 py-16 text-center text-[#98A2B3] text-sm font-medium"
          >
            No users found.
          </td>
        </tr>
      ) : (
        users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-[#101828] font-semibold whitespace-nowrap">
              <Link
                to={`/user-management/${user.id}`}
                className="hover:text-primary hover:underline focus:outline-none transition-colors text-left"
              >
                {user.fullName}
              </Link>
            </td>
            <td className="px-6 py-4 text-[#475467] whitespace-nowrap">
              {user.email}
            </td>
            <td className="px-6 py-4 text-[#475467] whitespace-nowrap">
              {user.phone}
            </td>
            <td className="px-6 py-4 text-[#475467]">{user.city}</td>
            {!isClient && (
              <td className="px-6 py-4 text-[#475467] text-center">
                {user.tasksCompleted}
              </td>
            )}
            <td className="px-6 py-4">
              <StatusBadge status={user.status} />
            </td>
            <td className="px-6 py-4">
              <ActionMenu
                user={user}
                onView={onView}
                onEdit={onEdit}
                onSuspend={onSuspend}
                onBan={onBan}
              />
            </td>
          </tr>
        ))
      )}
    </CustomTable>
  );
};

export default UserTable;

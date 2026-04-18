import React, { useState, Fragment } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import FormInput from "../../common/FormInput";
import Button from "../../common/Button";
import { UserPlus, Mail, Shield, User, ChevronDown, Check } from "lucide-react";
import { useGetRoles, useInviteAdmin } from "../../../services/query/adminMgt";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form } from "formik";
import {
  inviteAdminInitValues,
  inviteAdminValidateSchema,
} from "../../../utils/validation";

interface InviteAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

const InviteAdminDrawer: React.FC<InviteAdminDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRoles();
  const roles = rolesData?.data || [];

  const { mutate: invite, isPending: isInviting } = useInviteAdmin();

  const handleInvite = (payload: any) => {
    invite(payload, {
      onSuccess: (response: any) => {
        if (response.success) {
          toast.success(response.message || "Admin invited successfully!");
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || "Failed to invite admin");
        }
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Something went wrong";
        toast.error(message);
      },
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Toaster position="top-right" />
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#0C111D]/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                      <div className="flex items-start justify-between mb-8">
                        <Dialog.Title className="text-xl font-bold text-[#101828]">
                          Invite New Admin
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md text-[#667085] hover:text-[#101828] focus:outline-none transition-colors"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <UserPlus size={24} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-primary italic uppercase tracking-wider mb-1">
                            Step 1: Admin Details
                          </h3>
                          <p className="text-xs text-[#475467] font-medium leading-relaxed">
                            Fill in the information below to send an invitation.
                            New admins will receive an email to set up their
                            account.
                          </p>
                        </div>
                      </div>

                      <Formik
                        initialValues={{
                          ...inviteAdminInitValues,
                          roleId: roles.length > 0 ? roles[0].uuid : "",
                        }}
                        validationSchema={inviteAdminValidateSchema}
                        onSubmit={(values) => {
                          const { roleId, ...rest } = values;
                          const payload = {
                            ...rest,
                            roleIds: [roleId],
                          };
                          handleInvite(payload);
                        }}
                        enableReinitialize
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          setFieldValue,
                          isValid,
                          dirty,
                        }) => {
                          const selectedRole =
                            roles.find((r: any) => r.uuid === values.roleId) ||
                            null;

                          return (
                            <Form className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                  label="First Name"
                                  name="firstName"
                                  type="text"
                                  placeholder="e.g. John"
                                  value={values.firstName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.firstName && errors.firstName}
                                  icon={<User size={18} />}
                                />
                                <FormInput
                                  label="Last Name"
                                  name="lastName"
                                  type="text"
                                  placeholder="e.g. Doe"
                                  value={values.lastName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.lastName && errors.lastName}
                                />
                              </div>

                              <FormInput
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="e.g. john@shift9ja.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email}
                                icon={<Mail size={18} />}
                              />

                              <div className="flex flex-col w-full text-left">
                                <label className="text-[15px] font-medium text-[#344054] mb-1.5 flex items-center gap-2">
                                  <Shield size={16} className="text-primary" />
                                  Assign Role
                                </label>
                                <Listbox
                                  value={selectedRole}
                                  onChange={(role: any) =>
                                    setFieldValue("roleId", role.uuid)
                                  }
                                  disabled={isLoadingRoles}
                                >
                                  <div className="relative">
                                    <Listbox.Button
                                      className={`relative w-full h-[52px] cursor-default rounded-xl bg-white px-4 text-left border ${touched.roleId && errors.roleId ? "border-red-500" : "border-[#D0D5DD]"} shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none sm:text-sm font-semibold`}
                                    >
                                      <span className="block truncate text-[#101828]">
                                        {isLoadingRoles
                                          ? "Loading roles..."
                                          : selectedRole?.name ||
                                            "Select a role"}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                        <ChevronDown
                                          className="h-5 w-5 text-[#667085]"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options
                                        anchor="bottom start"
                                        className="w-[var(--button-width)] mt-1 max-h-60 overflow-auto rounded-2xl bg-white py-1.5 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm transition-all duration-200 z-[110] [--anchor-gap:4px]"
                                      >
                                        {roles.map((role: any) => (
                                          <Listbox.Option
                                            key={role.uuid}
                                            className={({ active }) =>
                                              `relative cursor-default select-none py-3 pl-10 pr-4 transition-colors rounded-xl mx-1.5 ${
                                                active
                                                  ? "bg-primary/5 text-primary"
                                                  : "text-[#101828]"
                                              }`
                                            }
                                            value={role}
                                          >
                                            {({ selected, active }) => (
                                              <>
                                                <div className="flex flex-col gap-0.5">
                                                  <span
                                                    className={`block truncate ${selected ? "font-bold" : "font-semibold"}`}
                                                  >
                                                    {role.name}
                                                  </span>
                                                  <span
                                                    className={`block truncate text-[11px] font-medium ${active ? "text-primary/70" : "text-[#667085]"}`}
                                                  >
                                                    {role.description}
                                                  </span>
                                                </div>
                                                {selected ? (
                                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                    <Check
                                                      className="h-4 w-4"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </Listbox>
                                {touched.roleId && errors.roleId && (
                                  <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                    {String(errors.roleId)}
                                  </span>
                                )}
                              </div>

                              <div className="pt-8 flex items-center gap-4">
                                <Button
                                  label="Cancel"
                                  variant="outline"
                                  onClick={onClose}
                                  className="flex-1 !h-12 border-[#D0D5DD] font-semibold"
                                  disabled={isInviting}
                                />
                                <Button
                                  label="Send Invitation"
                                  variant="primary"
                                  type="submit"
                                  className="flex-1 !h-12 font-semibold shadow-md shadow-primary/20"
                                  isLoading={isInviting}
                                  disabled={
                                    !isValid || !dirty || isLoadingRoles
                                  }
                                />
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

// Helper for Close icon
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InviteAdminDrawer;

import React, { Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { Mail, Shield, User, ChevronDown, Check, Settings, X } from 'lucide-react';
import { useGetRoles, useUpdateAdmin } from '../../services/query/adminMgt';
import { toast, Toaster } from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { AdminUser } from '../../types/index.ts';

interface EditAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  admin: AdminUser | null;
}

const editAdminValidateSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  roleId: Yup.string().required('At least one role must be assigned'),
  isActive: Yup.boolean()
});

const EditAdminDrawer: React.FC<EditAdminDrawerProps> = ({ isOpen, onClose, onSuccess, admin }) => {
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRoles();
  const roles = rolesData?.data || [];

  const { mutate: update, isPending: isUpdating } = useUpdateAdmin();
  
  const handleUpdate = (values: any) => {
    if (!admin) return;
    
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleIds: [values.roleId],
      isActive: values.isActive
    };

    update({ uuid: admin.uuid, payload }, {
      onSuccess: (response: any) => {
        if (response.success) {
          toast.success(response.message || 'Admin updated successfully!');
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || 'Failed to update admin');
        }
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Something went wrong';
        toast.error(message);
      }
    });
  };

  if (!admin) return null;

  const currentRoleId = admin.roles?.[0]?.uuid || '';

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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl font-sans">
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <Dialog.Title className="text-xl font-black text-[#101828] tracking-tight">Edit administrator</Dialog.Title>
                          <p className="text-xs text-[#667085] font-bold mt-1 uppercase tracking-wider">Update profile and permissions</p>
                        </div>
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#667085] hover:bg-gray-50 hover:text-[#101828] focus:outline-none transition-all border border-[#F2F4F7]"
                          onClick={onClose}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="mb-8 p-5 bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl border border-[#F2F4F7] flex items-center gap-4 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-primary/5 shrink-0 uppercase">
                          {admin.firstName[0]}{admin.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-[#101828] truncate">{admin.firstName} {admin.lastName}</h3>
                          <p className="text-[11px] text-[#667085] font-bold uppercase tracking-wide truncate">{admin.email}</p>
                        </div>
                      </div>

                      <Formik
                        initialValues={{
                          firstName: admin.firstName,
                          lastName: admin.lastName,
                          email: admin.email,
                          roleId: currentRoleId,
                          isActive: admin.isActive
                        }}
                        validationSchema={editAdminValidateSchema}
                        onSubmit={handleUpdate}
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
                          dirty
                        }) => {
                          const selectedRole = roles.find((r: any) => r.uuid === values.roleId) || (admin.roles?.[0] || null);

                          return (
                            <Form className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput 
                                  label="First Name"
                                  name="firstName"
                                  type="text"
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
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email}
                                icon={<Mail size={18} />}
                              />

                              <div className="flex flex-col w-full text-left">
                                <label className="text-[13px] font-black text-[#344054] mb-2 uppercase tracking-wider flex items-center gap-2">
                                  <Shield size={14} className="text-primary" />
                                  Administrative Role
                                </label>
                                <Listbox 
                                  value={selectedRole} 
                                  onChange={(role: any) => setFieldValue('roleId', role.uuid)} 
                                  disabled={isLoadingRoles}
                                >
                                  <div className="relative">
                                    <Listbox.Button className={`relative w-full h-[52px] cursor-default rounded-xl bg-white px-4 text-left border ${touched.roleId && errors.roleId ? 'border-red-500' : 'border-[#D0D5DD]'} shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none sm:text-sm font-bold`}>
                                      <span className="block truncate text-[#101828]">
                                        {isLoadingRoles ? 'Loading roles...' : (selectedRole?.name || 'Select a role')}
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
                                        className="w-[var(--button-width)] mt-2 max-h-60 overflow-auto rounded-2xl bg-white py-2 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm transition-all duration-200 z-[110] [--anchor-gap:8px]"
                                      >
                                        {roles.map((role: any) => (
                                          <Listbox.Option
                                            key={role.uuid}
                                            className={({ active }) =>
                                              `relative cursor-default select-none py-3.5 pl-11 pr-4 transition-colors rounded-xl mx-2 ${
                                                active ? 'bg-primary/5 text-primary' : 'text-[#101828]'
                                              }`
                                            }
                                            value={role}
                                          >
                                            {({ selected, active }) => (
                                              <>
                                                <div className="flex flex-col gap-0.5">
                                                  <span className={`block truncate ${selected ? 'font-black' : 'font-bold'}`}>
                                                    {role.name}
                                                  </span>
                                                  <span className={`block truncate text-[10px] font-bold uppercase tracking-tight ${active ? 'text-primary/70' : 'text-[#667085]'}`}>
                                                    {role.description}
                                                  </span>
                                                </div>
                                                {selected ? (
                                                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary">
                                                    <Check className="h-4 w-4" aria-hidden="true" />
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
                                  <span className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-tight">{String(errors.roleId)}</span>
                                )}
                              </div>

                              <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#F2F4F7]">
                                <label className="text-[13px] font-black text-[#344054] mb-4 uppercase tracking-wider flex items-center gap-2">
                                  <Settings size={14} className="text-primary" />
                                  Account Status
                                </label>
                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#EAECF0] shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-[#101828] uppercase tracking-wide">Active Membership</span>
                                    <span className="text-[10px] items-center text-[#667085] font-bold">Allows user to log in and manage tasks</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('isActive', !values.isActive)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-2 ring-primary/10 ${values.isActive ? 'bg-primary' : 'bg-gray-200'}`}
                                  >
                                    <span
                                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${values.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                  </button>
                                </div>
                              </div>

                              <div className="pt-8 flex items-center gap-4">
                                <Button 
                                  label="Cancel"
                                  variant="outline"
                                  onClick={onClose}
                                  className="flex-1 !h-12 border-[#D0D5DD] font-black uppercase text-[11px] tracking-widest"
                                  disabled={isUpdating}
                                />
                                <Button 
                                  label="Update Profile"
                                  variant="primary"
                                  type="submit"
                                  className="flex-1 !h-12 font-black uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20"
                                  isLoading={isUpdating}
                                  disabled={!isValid || !dirty || isLoadingRoles}
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

export default EditAdminDrawer;

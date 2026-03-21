import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  Clock, 
  AlertTriangle, 
  Info, 
  Send, 
  Users,
  Eye,
  Settings,
  Smartphone
} from 'lucide-react';
import { Switch, Tab } from '@headlessui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import { useGetNotificationSettings, useUpdateNotificationSettings, useSendBulkNotification } from '../../services/query/notifications';
import type { BulkNotificationPayload } from '../../types/notifications';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white p-8 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-bold text-[#101828]">{title}</h3>
      <p className="text-sm text-[#475467] leading-relaxed">{description}</p>
    </div>
    <div className="flex flex-col gap-5 pt-4 border-t border-[#F2F4F7]">
      {children}
    </div>
  </div>
);

const ToggleRow: React.FC<{ 
  label: string; 
  description: string; 
  enabled: boolean; 
  onChange: (val: boolean) => void;
  icon?: React.ReactNode;
}> = ({ label, description, enabled, onChange, icon }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-bold text-[#101828]">{label}</p>
        <p className="text-xs text-[#667085] leading-relaxed max-w-sm">{description}</p>
      </div>
    </div>
    <Switch
      checked={enabled}
      onChange={onChange}
      className={classNames(
        enabled ? 'bg-primary' : 'bg-[#EAECF0]',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/10'
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  </div>
);

const Notifications: React.FC = () => {
  const { data: settingsData, isPending: isLoading } = useGetNotificationSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateNotificationSettings();
  const { mutate: sendBulk, isPending: isSendingBulk } = useSendBulkNotification();

  const settings = settingsData?.data;

  const bulkSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').min(5, 'Too short'),
    message: Yup.string().required('Message content is required').min(20, 'Please provide more detail'),
    targetAudience: Yup.string().oneOf(['all', 'clients', 'helpers']).required('Required')
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-[#101828] tracking-tight">Notification & Security Settings</h1>
          <p className="text-[#475467] text-sm font-medium">Manage global platform communications and security policies.</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100 italic uppercase tracking-wider">
               <ShieldCheck size={14} /> System Managed
            </span>
        </div>
      </div>

      <Tab.Group>
        <div className="border-b border-gray-200">
          <Tab.List className="flex gap-10">
            {['Communication', 'Security Policies', 'Bulk Send'].map((item) => (
              <Tab
                key={item}
                className={({ selected }) =>
                  classNames(
                    'pb-4 text-sm font-bold border-b-2 transition-all outline-none',
                    selected
                      ? 'border-primary text-primary'
                      : 'border-transparent text-[#667085] hover:text-[#101828] hover:border-gray-300'
                  )
                }
              >
                {item}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="focus:outline-none">
          {/* Tab 1: Communication Settings */}
          <Tab.Panel className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SettingsSection 
                title="Global Delivery Channels" 
                description="Determine which channels the platform uses to communicate with all users."
              >
                <ToggleRow 
                  label="Email System" 
                  description="Enable or disable automated emails for task updates, passwords, and alerts."
                  enabled={settings?.emailNotificationsEnabled || false}
                  onChange={(val) => updateSettings({ emailNotificationsEnabled: val })}
                  icon={<Mail size={18} />}
                />
                <ToggleRow 
                  label="SMS Notifications" 
                  description="Enable global SMS delivery for critical alerts. (Carrier rates apply)"
                  enabled={settings?.smsNotificationsEnabled || false}
                  onChange={(val) => updateSettings({ smsNotificationsEnabled: val })}
                  icon={<Smartphone size={18} />}
                />
                <ToggleRow 
                  label="In-App Push" 
                  description="Deliver real-time notifications directly within the mobile and web apps."
                  enabled={settings?.inAppNotificationsEnabled || false}
                  onChange={(val) => updateSettings({ inAppNotificationsEnabled: val })}
                  icon={<Bell size={18} />}
                />
              </SettingsSection>

              <SettingsSection 
                title="Messaging Permissions" 
                description="Configure how users interact through our native messaging system."
              >
                <ToggleRow 
                  label="Helper to Client" 
                  description="Allow service providers to initiate chats with task requesters."
                  enabled={settings?.helperToClientMessagingEnabled || false}
                  onChange={(val) => updateSettings({ helperToClientMessagingEnabled: val })}
                  icon={<MessageSquare size={18} />}
                />
                <ToggleRow 
                  label="Client to Helper" 
                  description="Allow task owners to message active helpers for updates."
                  enabled={settings?.clientToHelperMessagingEnabled || false}
                  onChange={(val) => updateSettings({ clientToHelperMessagingEnabled: val })}
                  icon={<MessageSquare size={18} />}
                />
                <ToggleRow 
                  label="System Announcements" 
                  description="Allow administrators to publish broadcast messages to all segments."
                  enabled={settings?.platformMessagesEnabled || false}
                  onChange={(val) => updateSettings({ platformMessagesEnabled: val })}
                  icon={<Info size={18} />}
                />
              </SettingsSection>
            </div>
          </Tab.Panel>

          {/* Tab 2: Security Policies */}
          <Tab.Panel className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <SettingsSection 
                  title="Authentication Rules" 
                  description="Enforce multi-factor auth and define password complexity requirements."
               >
                 <ToggleRow 
                    label="Mandatory MFA" 
                    description="Require all users to verify their identity via Email or SMS during login."
                    enabled={settings?.mfaEnforced || false}
                    onChange={(val) => updateSettings({ mfaEnforced: val })}
                    icon={<Lock size={18} />}
                 />
                 <div className="flex flex-col gap-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-bold text-[#98A2B3] uppercase">Min Password length</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-bold text-[#101828]">{settings?.minPasswordLength}</span>
                                <span className="text-xs text-[#475467] font-medium">chars</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-bold text-[#98A2B3] uppercase">Expiry Period</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-bold text-[#101828]">{settings?.passwordExpiryDays}</span>
                                <span className="text-xs text-[#475467] font-medium">days</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {settings?.requireNumbers && <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100">Numeric Check</span>}
                        {settings?.requireUppercase && <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100">Uppercase check</span>}
                        {settings?.requireSpecialCharacters && <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100">Symbols required</span>}
                        {settings?.blockCommonPasswords && <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100">Prohibit weak passwords</span>}
                    </div>
                 </div>
               </SettingsSection>

               <SettingsSection 
                  title="Session & Account Security" 
                  description="Control account lockout duration and session expiration behaviors."
               >
                 <ToggleRow 
                    label="Limit Concurrent Sessions" 
                    description="Prevent users from being logged in on multiple devices simultaneously."
                    enabled={settings?.limitConcurrentSessions || false}
                    onChange={(val) => updateSettings({ limitConcurrentSessions: val })}
                    icon={<Users size={18} />}
                 />
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
                       <span className="text-xs font-bold text-[#101828]">Lockout Duration</span>
                       <span className="text-xs font-medium text-[#475467] bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">{settings?.lockoutDurationMinutes} mins</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
                       <span className="text-xs font-bold text-[#101828]">Session Idle Timeout</span>
                       <span className="text-xs font-medium text-[#475467] bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">{settings?.sessionTimeoutMinutes} mins</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
                       <span className="text-xs font-bold text-[#101828]">Max Login Attempts</span>
                       <span className="text-xs font-medium text-[#475467] bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">{settings?.maxLoginAttempts} times</span>
                    </div>
                 </div>
               </SettingsSection>
            </div>
          </Tab.Panel>

          {/* Tab 3: Bulk Notifications */}
          <Tab.Panel className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="max-w-2xl mx-auto">
                <SettingsSection 
                    title="Bulk Message Center" 
                    description="Broadcast important announcements to specific segments of the user base."
                >
                    <Formik
                        initialValues={{ title: '', message: '', targetAudience: 'all' as any }}
                        validationSchema={bulkSchema}
                        onSubmit={(values, { resetForm }) => {
                            sendBulk(values as BulkNotificationPayload, {
                                onSuccess: () => resetForm()
                            });
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                     <FormInput 
                                        name="title"
                                        label="Notification Title"
                                        type="text"
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Important System Update..."
                                        error={touched.title && errors.title ? errors.title : undefined}
                                     />

                                     <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-[#101828]">Target Audience</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['all', 'clients', 'helpers'].map((target) => (
                                                <label 
                                                    key={target} 
                                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-2 has-[:checked]:ring-primary/10"
                                                >
                                                    <Field type="radio" name="targetAudience" value={target} className="hidden" />
                                                    <span className="text-xs font-bold capitalize">{target}</span>
                                                </label>
                                            ))}
                                        </div>
                                     </div>

                                     <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-[#101828]">Message Content</label>
                                        <Field 
                                            as="textarea" 
                                            name="message" 
                                            rows={5} 
                                            placeholder="Write your message here..."
                                            className={classNames(
                                                "w-full h-auto p-4 rounded-xl border outline-none transition-all text-sm leading-relaxed",
                                                touched.message && errors.message ? "border-red-300 focus:border-red-500" : "border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10"
                                            )}
                                        />
                                        {touched.message && errors.message && <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.message}</p>}
                                     </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <Button 
                                        label="Preview" 
                                        type="button"
                                        variant="secondary"
                                        className="gap-2"
                                        icon={<Eye size={18} />}
                                        fullWidth={false}
                                    />
                                    <Button 
                                        label="Send Notification" 
                                        type="submit"
                                        className="gap-2"
                                        isLoading={isSendingBulk}
                                        icon={<Send size={18} />}
                                        fullWidth={false}
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </SettingsSection>
             </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Notifications;

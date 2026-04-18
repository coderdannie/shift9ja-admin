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
    content: Yup.string().required('Message content is required').min(20, 'Please provide more detail'),
    targetGroup: Yup.string().oneOf(['all', 'clients', 'helpers']).required('Required')
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
            <Formik
              initialValues={{
                mfaEnforced: settings?.mfaEnforced || false,
                mfaGracePeriodDays: settings?.mfaGracePeriodDays || 7,
                minPasswordLength: settings?.minPasswordLength || 8,
                passwordExpiryDays: settings?.passwordExpiryDays || 90,
                passwordHistoryCount: settings?.passwordHistoryCount || 5,

                requireUppercase: settings?.requireUppercase || false,
                requireNumbers: settings?.requireNumbers || false,
                requireSpecialCharacters: settings?.requireSpecialCharacters || false,
                blockCommonPasswords: settings?.blockCommonPasswords || false,
                limitConcurrentSessions: settings?.limitConcurrentSessions || false,
                lockoutDurationMinutes: settings?.lockoutDurationMinutes || 15,
                sessionTimeoutMinutes: settings?.sessionTimeoutMinutes || 30,
                maxLoginAttempts: settings?.maxLoginAttempts || 5,
                maxConcurrentSessions: settings?.maxConcurrentSessions || 1,
              }}
              enableReinitialize
              onSubmit={(values) => {
                updateSettings(values);
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="flex flex-col gap-8">

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SettingsSection 
                      title="Authentication Rules" 
                      description="Enforce multi-factor auth and define password complexity requirements."
                    >
                      <ToggleRow 
                        label="Mandatory MFA" 
                        description="Require all users to verify their identity via Email or SMS during login."
                        enabled={values.mfaEnforced}
                        onChange={(val) => setFieldValue('mfaEnforced', val)}
                        icon={<Lock size={18} />}
                      />
                      {values.mfaEnforced && (
                        <div className="mt-4">
                          <FormInput
                            name="mfaGracePeriodDays"
                            label="MFA Grace Period (Days)"
                            type="number"
                            value={values.mfaGracePeriodDays}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="7"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-6 mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            name="minPasswordLength"
                            label="Min Password Length"
                            type="number"
                            value={values.minPasswordLength}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="8"
                          />
                          <FormInput
                            name="passwordExpiryDays"
                            label="Password Expiry (Days)"
                            type="number"
                            value={values.passwordExpiryDays}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="90"
                          />
                        </div>
                        <FormInput
                          name="passwordHistoryCount"
                          label="Password History Count"
                          type="number"
                          value={values.passwordHistoryCount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="5"
                        />
                        <div className="grid grid-cols-1 gap-3">
                          <ToggleRow 
                            label="Require Uppercase" 
                            description="Passwords must contain at least one uppercase letter."
                            enabled={values.requireUppercase}
                            onChange={(val) => setFieldValue('requireUppercase', val)}
                          />
                          <ToggleRow 
                            label="Require Numbers" 
                            description="Passwords must contain at least one numeric digit."
                            enabled={values.requireNumbers}
                            onChange={(val) => setFieldValue('requireNumbers', val)}
                          />
                          <ToggleRow 
                            label="Require Symbols" 
                            description="Passwords must contain at least one special character."
                            enabled={values.requireSpecialCharacters}
                            onChange={(val) => setFieldValue('requireSpecialCharacters', val)}
                          />
                          <ToggleRow 
                            label="Block Common Passwords" 
                            description="Prevent users from using easily guessable or leaked passwords."
                            enabled={values.blockCommonPasswords}
                            onChange={(val) => setFieldValue('blockCommonPasswords', val)}
                          />
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
                        enabled={values.limitConcurrentSessions}
                        onChange={(val) => setFieldValue('limitConcurrentSessions', val)}
                        icon={<Users size={18} />}
                      />
                      <div className="flex flex-col gap-6 mt-4 pt-4 border-t border-gray-100">
                        {values.limitConcurrentSessions && (
                          <FormInput
                            name="maxConcurrentSessions"
                            label="Max Concurrent Sessions"
                            type="number"
                            value={values.maxConcurrentSessions}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="1"
                          />
                        )}
                        <div className="grid grid-cols-1 gap-4">
                          <FormInput
                            name="lockoutDurationMinutes"
                            label="Lockout Duration (Minutes)"
                            type="number"
                            value={values.lockoutDurationMinutes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="15"
                          />
                          <FormInput
                            name="sessionTimeoutMinutes"
                            label="Session Idle Timeout (Minutes)"
                            type="number"
                            value={values.sessionTimeoutMinutes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="30"
                          />
                          <FormInput
                            name="maxLoginAttempts"
                            label="Max Login Attempts"
                            type="number"
                            value={values.maxLoginAttempts}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="5"
                          />
                        </div>
                      </div>
                    </SettingsSection>
                  </div>
                  <div className="flex justify-end p-6 bg-gray-50 rounded-2xl border border-gray-100 italic">
                     <Button
                       label="Save Security Policies"
                       type="submit"
                       isLoading={isUpdating}
                       className="px-8 shadow-lg shadow-primary/20"
                       fullWidth={false}
                     />
                  </div>
                </Form>
              )}
            </Formik>
          </Tab.Panel>


          {/* Tab 3: Bulk Notifications */}
          <Tab.Panel className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="max-w-2xl mx-auto">
                <SettingsSection 
                    title="Bulk Message Center" 
                    description="Broadcast important announcements to specific segments of the user base."
                >
                    <Formik
                        initialValues={{ title: '', content: '', targetGroup: 'all' as any }}
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
                                                    <Field type="radio" name="targetGroup" value={target} className="hidden" />
                                                    <span className="text-xs font-bold capitalize">{target}</span>
                                                </label>
                                            ))}
                                        </div>
                                     </div>

                                     <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-[#101828]">Message Content</label>
                                        <Field 
                                            as="textarea" 
                                            name="content" 
                                            rows={5} 
                                            placeholder="Write your message here..."
                                            className={classNames(
                                                "w-full h-auto p-4 rounded-xl border outline-none transition-all text-sm leading-relaxed",
                                                touched.content && errors.content ? "border-red-300 focus:border-red-500" : "border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10"
                                            )}
                                        />
                                        {touched.content && errors.content && <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.content}</p>}
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

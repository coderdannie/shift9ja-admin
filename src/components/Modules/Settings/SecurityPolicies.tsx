import React from 'react';
import { Lock, Users } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { Formik, Form } from 'formik';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import { useGetNotificationSettings, useUpdateNotificationSettings } from '../../../services/query/notifications';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-6">
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
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/10'
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

const SecurityPolicies: React.FC = () => {
  const { data: settingsData, isPending: isLoading } = useGetNotificationSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateNotificationSettings();

  const settings = settingsData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
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
    </div>
  );
};

export default SecurityPolicies;

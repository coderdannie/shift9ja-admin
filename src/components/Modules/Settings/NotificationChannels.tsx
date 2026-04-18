import React from 'react';
import { Mail, Smartphone, Bell, MessageSquare, Info } from 'lucide-react';
import { Switch } from '@headlessui/react';
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

const NotificationChannels: React.FC = () => {
  const { data: settingsData, isPending: isLoading } = useGetNotificationSettings();
  const { mutate: updateSettings } = useUpdateNotificationSettings();

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

      </div>
    </div>
  );
};


export default NotificationChannels;

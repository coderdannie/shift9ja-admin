import React, { useState } from 'react';
import Drawer from '../../components/common/Drawer';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { UserPlus, Mail, Shield, User } from 'lucide-react';

interface InviteAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (adminData: any) => void;
  isLoading?: boolean;
}

const InviteAdminDrawer: React.FC<InviteAdminDrawerProps> = ({ isOpen, onClose, onInvite, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Admin',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Invite New Admin"
      size="md"
    >
      <div className="flex flex-col h-full">
        {/* Intro Section */}
        <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary italic uppercase tracking-wider mb-1">Step 1: Admin Details</h3>
            <p className="text-xs text-[#475467] font-medium leading-relaxed">
              Fill in the information below to send an invitation. New admins will receive an email to set up their account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="First Name"
                name="firstName"
                type="text"
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => {}}
                icon={<User size={18} />}
              />
              <FormInput 
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => {}}
              />
            </div>

            <FormInput 
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. john@shift9ja.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => {}}
              icon={<Mail size={18} />}
            />

            <div className="flex flex-col mb-5 w-full text-left">
              <label htmlFor="role" className="text-[15px] font-medium text-[#344054] mb-1.5 flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Assign Role
              </label>
              <div className="relative group">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-[52px] px-4 rounded-xl border border-[#D0D5DD] shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none text-[#101828] bg-white appearance-none pr-10 font-medium"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Support">Support</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <Button 
                label="Cancel"
                variant="outline"
                onClick={onClose}
                className="flex-1 !h-12 border-[#D0D5DD] font-semibold"
                disabled={isLoading}
            />
            <Button 
                label="Send Invitation"
                variant="primary"
                type="submit"
                className="flex-1 !h-12 font-semibold shadow-md shadow-primary/20"
                isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default InviteAdminDrawer;

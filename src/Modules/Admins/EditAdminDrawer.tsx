import React, { useState, useEffect } from 'react';
import Drawer from '../../components/common/Drawer';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { User, Mail, Shield, Settings } from 'lucide-react';
import type { Admin } from './AdminTable';

interface EditAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (adminData: any) => void;
  admin: Admin | null;
  isLoading?: boolean;
}

const EditAdminDrawer: React.FC<EditAdminDrawerProps> = ({ isOpen, onClose, onUpdate, admin, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Admin',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      });
    }
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...admin, ...formData });
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Admin Details"
      size="md"
    >
      <div className="flex flex-col h-full">
        {/* Profile Summary */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101828]">{admin?.firstName} {admin?.lastName}</h3>
            <p className="text-sm text-[#667085] font-medium">{admin?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => {}}
                icon={<User size={18} />}
              />
              <FormInput 
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => {}}
              />
            </div>

            <FormInput 
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => {}}
              icon={<Mail size={18} />}
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-5 w-full text-left">
                    <label htmlFor="role" className="text-[15px] font-medium text-[#344054] mb-1.5 flex items-center gap-2">
                        <Shield size={16} className="text-primary" />
                        Role
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

                <div className="flex flex-col mb-5 w-full text-left">
                    <label htmlFor="status" className="text-[15px] font-medium text-[#344054] mb-1.5 flex items-center gap-2">
                        <Settings size={16} className="text-primary" />
                        Status
                    </label>
                    <div className="relative group">
                        <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full h-[52px] px-4 rounded-xl border border-[#D0D5DD] shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none text-[#101828] bg-white appearance-none pr-10 font-medium"
                        >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </div>
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
                label="Update Admin"
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

export default EditAdminDrawer;

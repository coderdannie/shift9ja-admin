import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import authBg from '../../assets/auth-bg.png';

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="lg:pl-[280px] pt-[80px]">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export const NonAuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:block relative overflow-hidden bg-primary">
        <img 
          src={authBg} 
          alt="Shift9ja Auth Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        
        {/* Branding Overlay */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <img src="/assets/shift-logo-2.svg" alt="Shift9ja Logo" className="h-12 w-auto object-contain mb-6 brightness-0 invert" />
          <h2 className="text-4xl font-extrabold leading-tight">
            Your Premium Service <br /> Admin Dashboard
          </h2>
          <p className="mt-4 text-primary-50/90 text-lg max-w-md">
            Manage everything with ease and precision. Secure, reliable, and powerful dashboard for the Shift9ja ecosystem.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white overflow-y-auto">
        <div className="w-full max-w-[480px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <img src="/assets/shift-logo-2.svg" alt="Shift9ja Logo" className="h-10 w-auto object-contain" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

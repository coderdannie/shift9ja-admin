import React from 'react';
import { Search } from 'lucide-react';

interface UserSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]" size={18} />
    <input
      type="text"
      placeholder="Search user"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 pl-12 pr-4 rounded-full border border-[#F2F4F7] bg-white text-[#101828] placeholder:text-[#98A2B3] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
    />
  </div>
);

export default UserSearchBar;

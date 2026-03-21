import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: any) => void;
  error?: any;
  size?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  pattern?: string;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  size,
  disabled,
  readOnly,
  placeholder,
  inputMode,
  pattern,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === 'password';

  return (
    <div className="flex flex-col mb-5 w-full text-left">
      <label htmlFor={name} className="text-[15px] font-medium text-[#344054] mb-1.5">
        {label}
      </label>

      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors">
            {icon}
          </div>
        )}
        
        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          id={name}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          inputMode={inputMode}
          pattern={pattern}
          className={`
            w-full h-[52px] px-4 rounded-xl border transition-all duration-200 outline-none
            text-[#101828] placeholder:text-[#667085] text-base
            bg-white
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${error 
              ? 'border-red-300 ring-4 ring-red-50' 
              : 'border-[#D0D5DD] shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10'}
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${size || ''}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828] transition-colors p-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

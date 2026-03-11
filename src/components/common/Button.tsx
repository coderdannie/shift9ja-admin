import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  isLoading,
  variant = 'primary',
  fullWidth = true,
  className = '',
  disabled,
  icon,
  ...props
}) => {
  const baseStyles = 'h-12 rounded-lg font-bold text-base transition-all flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-green-700 active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed',
    outline: 'border border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50 active:scale-[0.99] disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed',
  };

  const widthStyle = fullWidth ? 'w-full' : 'px-6';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce" />
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && icon}
          {label}
        </div>
      )}
    </button>
  );
};

export default Button;

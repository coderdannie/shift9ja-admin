import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  rightElement 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-[28px] font-bold text-[#101828] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[#475467] text-sm mt-1 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {rightElement && (
        <div className="flex items-center gap-3">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

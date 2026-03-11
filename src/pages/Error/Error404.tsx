import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../../routes/constants';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary animate-bounce">404</h1>
      <h2 className="text-3xl font-bold text-[#101828] mt-4">Page Not Found</h2>
      <p className="text-lg text-[#666666] mt-2 mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate(PUBLIC_PATHS.LOGIN)}
        className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all active:scale-95"
      >
        Back to Login
      </button>
    </div>
  );
};

export default Error404;

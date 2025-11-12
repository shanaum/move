import React from 'react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, className = '', icon, ...props }) => {
  return (
    <button
      className={`relative inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#9333EA] to-[#7C3AED] rounded-full group focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 font-inter ${className}`}
      {...props}
    >
      <div className="relative flex items-center space-x-2">
        {children}
        {icon && <span>{icon}</span>}
      </div>
    </button>
  );
};

export default GradientButton;
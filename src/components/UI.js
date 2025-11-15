import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition flex items-center justify-center space-x-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${
    disabled || loading ? 'cursor-not-allowed opacity-60' : ''
  }`;

  return (
    <button {...props} className={classes} disabled={disabled || loading}>
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
};

export const Card = ({ children, className = '', clickable = false }) => {
  const baseStyles = 'bg-white rounded-xl shadow-lg p-6';
  const clickableStyles = clickable ? 'hover:shadow-xl cursor-pointer transition' : '';

  return <div className={`${baseStyles} ${clickableStyles} ${className}`}>{children}</div>;
};

export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`rounded-full font-semibold ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};

export default { Button, Card, Badge };

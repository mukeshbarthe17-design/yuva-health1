import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose, title }) => {
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="text-green-600" size={20} />,
      text: 'text-green-800',
      heading: 'text-green-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="text-red-600" size={20} />,
      text: 'text-red-800',
      heading: 'text-red-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertCircle className="text-yellow-600" size={20} />,
      text: 'text-yellow-800',
      heading: 'text-yellow-900',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="text-blue-600" size={20} />,
      text: 'text-blue-800',
      heading: 'text-blue-900',
    },
  };

  const style = typeStyles[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${style.heading}`}>{title}</h3>}
          <p className={`text-sm ${style.text}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 text-sm font-medium ${style.text} hover:opacity-75`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

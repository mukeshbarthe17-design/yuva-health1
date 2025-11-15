import React from 'react';

export const FormField = ({ label, error, required, children }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const TextInput = ({ label, error, required, ...props }) => {
  return (
    <FormField label={label} error={error} required={required}>
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </FormField>
  );
};

export const TextArea = ({ label, error, required, ...props }) => {
  return (
    <FormField label={label} error={error} required={required}>
      <textarea
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </FormField>
  );
};

export const SelectInput = ({ label, error, required, options, ...props }) => {
  return (
    <FormField label={label} error={error} required={required}>
      <select
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

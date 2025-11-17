import React from 'react';

export const FormField = ({ label, error, required, children, htmlFor }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const TextInput = ({ label, error, required, value = '', onChange, id, ...props }) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormField label={label} error={error} required={required} htmlFor={inputId}>
      <input
        id={inputId}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </FormField>
  );
};

export const TextArea = ({ label, error, required, value = '', onChange, id, ...props }) => {
  const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormField label={label} error={error} required={required} htmlFor={textareaId}>
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </FormField>
  );
};

export const SelectInput = ({ label, error, required, options = [], value = '', onChange, id, ...props }) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormField label={label} error={error} required={required} htmlFor={selectId}>
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  id,
  disabled = false,
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="flex items-center">
      <div className="relative inline-block w-10 mr-2 align-middle">
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`block h-6 w-10 rounded-full ${
            disabled ? 'bg-gray-300 cursor-not-allowed' : checked ? 'bg-blue-600' : 'bg-gray-400'
          } transition-colors duration-200`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
            checked ? 'transform translate-x-4' : ''
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        ></div>
      </div>
      <label
        htmlFor={toggleId}
        className={`text-sm font-medium ${
          disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Toggle;
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full bg-surface-dark dark:bg-surface-light ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer cursor-pointer"
      />
      <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4 peer-checked:bg-primary-light"></div>
    </div>
  );
}

import React from 'react';

export interface DebugSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  showBorder?: boolean;
}

export function DebugSection({
  title,
  children,
  className = '',
  showBorder = true,
}: DebugSectionProps) {
  return (
    <div
      className={`space-y-2 mb-6 ${showBorder ? 'pb-6 border-b border-surface-dark dark:border-surface-light' : ''} ${className}`}
    >
      <h4 className="text-base font-medium text-secondary mb-2">{title}</h4>
      {children}
    </div>
  );
}

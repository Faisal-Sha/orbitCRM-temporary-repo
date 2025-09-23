import React from 'react';
import { getStatusLabelConfig } from '@/utils/statusLabels';

interface StatusLabelProps {
  status?: string;
  className?: string;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status, className }) => {
  const displayStatus = status || 'Not Set';
  const config = getStatusLabelConfig(displayStatus);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className || ''}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        fontWeight: config.fontWeight,
      }}
    >
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  );
};
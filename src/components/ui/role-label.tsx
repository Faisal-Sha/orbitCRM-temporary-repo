import React from 'react';

interface RoleLabelProps {
  roleName: string;
  labelColor?: string;
  textColor?: string;
  fontWeight?: string;
  className?: string;
}

export const RoleLabel: React.FC<RoleLabelProps> = ({
  roleName,
  labelColor,
  textColor,
  fontWeight,
  className = ''
}) => {
  // Default styling if no label is applied
  const defaultStyle = {
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    fontWeight: 'normal'
  };

  // Custom styling if label is applied
  const customStyle = labelColor ? {
    backgroundColor: labelColor,
    color: textColor || 'white',
    fontWeight: fontWeight || 'normal'
  } : defaultStyle;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-sm capitalize ${className}`}
      style={customStyle}
    >
      {roleName}
    </span>
  );
};
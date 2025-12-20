import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'gray' | 'orange' | 'red' | 'yellow';
  color?: 'blue' | 'green' | 'gray' | 'red' | 'yellow';
  className?: string;
}

const variantStyles = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  color,
  className = ''
}) => {
  const finalVariant = color || variant || 'blue';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantStyles[finalVariant]} ${className}`}>
      {children}
    </span>
  );
};

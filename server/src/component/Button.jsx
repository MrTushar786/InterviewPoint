import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button', 
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClass = 'btn';
  const variantClass = variant ? `btn-${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'btn-full' : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
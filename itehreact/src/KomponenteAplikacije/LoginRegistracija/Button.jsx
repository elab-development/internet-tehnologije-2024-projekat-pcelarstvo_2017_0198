import React from 'react';
 

const Button = ({ label, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      className={`custom-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;

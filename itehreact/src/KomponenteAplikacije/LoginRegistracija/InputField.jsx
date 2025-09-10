import React from 'react';
 

const InputField = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  required = false,
  showToggle = false,
  onToggle,
  isTextVisible = false,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className={`input-container ${showToggle ? 'with-toggle' : ''}`}>
        <input
          type={showToggle && isTextVisible ? 'text' : type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {showToggle && (
          <button
            type="button"
            className="toggle-password"
            onClick={onToggle}
          >
            {isTextVisible ? 'Sakrij' : 'Prikaži'}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;

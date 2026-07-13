import React from "react";

import {
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const AuthInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  icon: Icon,
  error,
  hint,
  disabled = false,
  onChange,
  showPassword = false,
  onTogglePassword,
  labelAction = null,
}) => {
  const isPasswordField = type === "password";
  const inputType =
    isPasswordField && showPassword ? "text" : type;

  return (
    <div className="auth-form-group">
      <div className="auth-label-row">
        <label htmlFor={id || name}>
          {label}
        </label>

        {labelAction}
      </div>

      <div
        className={`auth-input-wrapper ${
          error ? "auth-input-error" : ""
        }`}
      >
        {Icon && <Icon className="auth-input-icon" />}

        <input
          id={id || name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />

        {isPasswordField && onTogglePassword && (
          <button
            type="button"
            className="auth-password-toggle"
            onClick={onTogglePassword}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            disabled={disabled}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {error ? (
        <span className="auth-error-message">
          {error}
        </span>
      ) : (
        hint && (
          <span className="register-password-hint">
            {hint}
          </span>
        )
      )}
    </div>
  );
};

export default AuthInput;
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

// PUBLIC_INTERFACE
/**
 * RegisterModal component for user registration
 * Provides a modal interface for users to create new accounts with email and password
 * Features form validation, password confirmation, and clean, minimalistic design
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} [props.onSwitchToLogin] - Function to switch to login modal
 * @param {Function} [props.onSuccess] - Callback function called on successful registration
 * @returns {React.ReactNode} Register modal component
 */
const RegisterModal = ({ 
  isOpen, 
  onClose, 
  onSwitchToLogin, 
  onSuccess 
}) => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage('Please fix the errors below');
      setMessageType('error');
      return;
    }
    
    setFieldErrors({});
    
    const { error } = await signUp(formData.email, formData.password);
    
    if (error) {
      setMessage(`Registration failed: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Registration successful! Please check your email for verification.');
      setMessageType('success');
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 2000);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setMessage('');
    setMessageType('');
    setFieldErrors({});
    onClose();
  };

  // Get input style with error state
  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px',
    border: `1px solid ${fieldErrors[fieldName] ? '#ef4444' : 'var(--border-color)'}`,
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease'
  });

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        color: 'var(--text-primary)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '4px',
            borderRadius: '4px',
            lineHeight: 1
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Modal header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Create Account
          </h2>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: 'var(--text-secondary)', 
            fontSize: '14px' 
          }}>
            Join us today! Create your account to get started.
          </p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={getInputStyle('email')}
              onFocus={(e) => {
                if (!fieldErrors.email) {
                  e.target.style.borderColor = 'var(--text-secondary)';
                }
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                if (!fieldErrors.email) {
                  e.target.style.borderColor = 'var(--border-color)';
                }
              }}
              placeholder="Enter your email address"
            />
            {fieldErrors.email && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#ef4444'
              }}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={getInputStyle('password')}
              onFocus={(e) => {
                if (!fieldErrors.password) {
                  e.target.style.borderColor = 'var(--text-secondary)';
                }
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                if (!fieldErrors.password) {
                  e.target.style.borderColor = 'var(--border-color)';
                }
              }}
              placeholder="Choose a secure password"
            />
            {fieldErrors.password && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#ef4444'
              }}>
                {fieldErrors.password}
              </p>
            )}
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm password field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Confirm Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              style={getInputStyle('confirmPassword')}
              onFocus={(e) => {
                if (!fieldErrors.confirmPassword) {
                  e.target.style.borderColor = 'var(--text-secondary)';
                }
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                if (!fieldErrors.confirmPassword) {
                  e.target.style.borderColor = 'var(--border-color)';
                }
              }}
              placeholder="Confirm your password"
            />
            {fieldErrors.confirmPassword && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#ef4444'
              }}>
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Message display */}
          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '16px',
              backgroundColor: messageType === 'error' 
                ? 'rgba(239, 68, 68, 0.1)' 
                : messageType === 'success'
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              color: messageType === 'error' 
                ? '#ef4444' 
                : messageType === 'success'
                ? '#22c55e'
                : '#3b82f6',
              border: `1px solid ${messageType === 'error' 
                ? 'rgba(239, 68, 68, 0.3)' 
                : messageType === 'success'
                ? 'rgba(34, 197, 94, 0.3)'
                : 'rgba(59, 130, 246, 0.3)'}`
            }}>
              {message}
            </div>
          )}

          {/* Terms notice */}
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '16px'
          }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>

          {/* Switch to login */}
          {onSwitchToLogin && (
            <div style={{ 
              textAlign: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: 'var(--text-secondary)' 
              }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: '600'
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;

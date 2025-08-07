import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

// PUBLIC_INTERFACE
/**
 * LoginModal component for user authentication
 * Provides a modal interface for users to sign in with email and password
 * Features forgot password functionality and clean, minimalistic design
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} [props.onSwitchToRegister] - Function to switch to register modal
 * @param {Function} [props.onSuccess] - Callback function called on successful login
 * @returns {React.ReactNode} Login modal component
 */
const LoginModal = ({ 
  isOpen, 
  onClose, 
  onSwitchToRegister, 
  onSuccess 
}) => {
  const { signIn, resetPassword, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!formData.email || !formData.password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setMessage(`Sign in failed: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Sign in successful!');
      setMessageType('success');
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1000);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }
    
    setIsResettingPassword(true);
    const { error } = await resetPassword(formData.email);
    setIsResettingPassword(false);
    
    if (error) {
      setMessage(`Password reset failed: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Password reset email sent! Check your inbox.');
      setMessageType('success');
      setShowForgotPassword(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setMessage('');
    setMessageType('');
    setShowForgotPassword(false);
    onClose();
  };

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
        color: 'var(--text-primary)'
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
            {showForgotPassword ? 'Reset Password' : 'Sign In'}
          </h2>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: 'var(--text-secondary)', 
            fontSize: '14px' 
          }}>
            {showForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : 'Welcome back! Please sign in to your account.'
            }
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--text-secondary)';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
              }}
              placeholder="Enter your email"
            />
          </div>

          {!showForgotPassword && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--text-secondary)';
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                }}
                placeholder="Enter your password"
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || isResettingPassword}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading || isResettingPassword ? '#ccc' : 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || isResettingPassword ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => {
              if (!loading && !isResettingPassword) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading || isResettingPassword 
              ? 'Processing...' 
              : (showForgotPassword ? 'Send Reset Link' : 'Sign In')
            }
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

          {/* Forgot password toggle */}
          {!showForgotPassword ? (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Forgot your password?
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setMessage('');
                  setMessageType('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                ← Back to sign in
              </button>
            </div>
          )}

          {/* Switch to register */}
          {!showForgotPassword && onSwitchToRegister && (
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
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
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
                  Sign up
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

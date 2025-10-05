import React, { useState } from 'react';
import styles from './Register.module.css';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterProps {
  onRegister: (userData: RegisterFormData) => void;
  onShowLogin: () => void;
  onReturnHome?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onShowLogin, onReturnHome }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('http://localhost:5146/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      if (!res.ok) {
        let message = 'An error occurred during registration. Please try again.';
        try {
          const data = await res.json();
          if (data?.message) message = data.message;
        } catch {}
        setErrors({ general: message });
        return;
      }

      // Optionally use returned data here
      // const data = await res.json();

      onRegister(formData);
    } catch (error) {
      setErrors({ general: 'An error occurred during registration. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        {onReturnHome && (
          <button
            onClick={onReturnHome}
            className={styles.homeButton}
            type="button"
          >
            Return to Home
          </button>
        )}

        <div className={styles.registerHeader}>
          <h1 className={styles.title}>Join MF-App</h1>
          <p className={styles.subtitle}>Create your account today</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.general && (
            <div className={styles.errorMessage}>
              {errors.general}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
            {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              placeholder="Enter your last name"
              disabled={isLoading}
            />
            {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.registerFooter}>
          <p className={styles.loginText}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onShowLogin}
              className={styles.loginLink}
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className={styles.infoNote}>
          <p><strong>Note:</strong> Your account will be created as a volunteer. Contact an administrator to request manager privileges.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

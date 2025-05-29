import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    role: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState({
    name: false,
    email: false,
    dob: false,
    role: false,
    gender: false,
    password: false,
    confirmPassword: false,
  });

  const [isButtonActive, setIsButtonActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    validateForm(name, value);
  };

  const validateForm = (name, value) => {
    const newErrors = { ...errors };
    const newFormValid = { ...formValid };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
          newFormValid.name = false;
        } else if (value.trim().length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
          newFormValid.name = false;
        } else {
          delete newErrors.name;
          newFormValid.name = true;
        }
        break;

      case 'email':
        if (!value.match(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)) {
          newErrors.email = 'Enter a valid email';
          newFormValid.email = false;
        } else {
          delete newErrors.email;
          newFormValid.email = true;
        }
        break;

      case 'dob':
        if (!value) {
          newErrors.dob = 'Date of birth is required';
          newFormValid.dob = false;
        } else {
          delete newErrors.dob;
          newFormValid.dob = true;
        }
        break;

      case 'role':
        if (!value) {
          newErrors.role = 'Please select a role';
          newFormValid.role = false;
        } else {
          delete newErrors.role;
          newFormValid.role = true;
        }
        break;

      case 'gender':
        if (!value) {
          newErrors.gender = 'Please select gender';
          newFormValid.gender = false;
        } else {
          delete newErrors.gender;
          newFormValid.gender = true;
        }
        break;

      case 'password':
        if (!value || value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
          newFormValid.password = false;
        } else {
          delete newErrors.password;
          newFormValid.password = true;
        }
        // Also re-validate confirmPassword if it has value
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            newFormValid.confirmPassword = false;
          } else {
            delete newErrors.confirmPassword;
            newFormValid.confirmPassword = true;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
          newFormValid.confirmPassword = false;
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
          newFormValid.confirmPassword = false;
        } else {
          delete newErrors.confirmPassword;
          newFormValid.confirmPassword = true;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    setFormValid(newFormValid);
    setIsButtonActive(Object.values(newFormValid).every(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const dataToSend = { ...formData, password: hashedPassword };
      delete dataToSend.confirmPassword;

      await axios.post('http://localhost:5000/api/users/register', dataToSend);
      setSuccessMessage('User registered Successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset form
      setFormData({
        name: '',
        email: '',
        dob: '',
        role: '',
        gender: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setFormValid({
        name: false,
        email: false,
        dob: false,
        role: false,
        gender: false,
        password: false,
        confirmPassword: false,
      });
      setIsButtonActive(false);
    } catch (error) {
      setErrorMessage('User Registration Failed!!');
      setTimeout(() => setErrorMessage(''), 3000);
      console.error(error);
    }
  };

  return (
    <>
      <style>{`
        /* Hide native browser password toggle */
        input[type="password"]::-webkit-password-toggle-button {
          display: none !important;
        }
        /* Container for inputs with eye icon */
        .input-with-icon {
          position: relative;
        }
        .input-with-icon input {
          padding-right: 2.5rem;
        }
        .eye-icon {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          cursor: pointer;
          user-select: none;
          font-size: 1.2rem;
          color: #555;
        }
        .eye-icon:hover {
          color: #000;
        }
        a.login-link {
          color: #0d6efd;
          cursor: pointer;
          text-decoration: none;
        }
        a.login-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        {successMessage && (
          <div
            className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 rounded shadow"
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              zIndex: 1050,
              animation: 'slideDown 0.5s ease forwards',
            }}
          >
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 rounded shadow"
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              zIndex: 1050,
              animation: 'slideDown 0.5s ease forwards',
            }}
          >
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded bg-light shadow"
          style={{ width: '100%', maxWidth: '480px' }}
          noValidate
        >
          <h3 className="text-center mb-4">Register</h3>

          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="form-group mb-3">
            <label>Email ID</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
          </div>

          <div className="form-group mb-3">
            <label>Role</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={formData.role === 'vendor'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Vendor</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  value="manager"
                  checked={formData.role === 'manager'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Manager</label>
              </div>
            </div>
            {errors.role && <small className="text-danger d-block">{errors.role}</small>}
          </div>

          <div className="form-group mb-3">
            <label>Gender</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Male</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Female</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Other</label>
              </div>
            </div>
            {errors.gender && <small className="text-danger d-block">{errors.gender}</small>}
          </div>

          {/* Password Field */}
          <div className="form-group mb-3 input-with-icon">
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label="Toggle password visibility"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword((prev) => !prev); }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group mb-3 input-with-icon">
            <label>Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label="Toggle confirm password visibility"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowConfirmPassword((prev) => !prev); }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={!isButtonActive}>
            Register
          </button>

          <div className="mt-3 text-center">
            Already has an account?{' '}
            <a href="/login" className="login-link">
              Login
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;

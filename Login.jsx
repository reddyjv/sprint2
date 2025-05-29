import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './login.png';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', role: '' });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [touchedFields, setTouchedFields] = useState({ email: false, role: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        validateForm(updatedFormData);
    };

    const validateForm = (data) => {
        const newErrors = {};
        if (!data.email.match(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)) {
            newErrors.email = 'Enter a valid email';
        }
        if (!data.role) {
            newErrors.role = 'Please select a role';
        }
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouchedFields({ email: true, role: true });
        validateForm(formData);
        if (!isFormValid) return;

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                setSuccessMessage("Login Successful!");
                setTimeout(() => {
                    setSuccessMessage("");
                    navigate("/dashboard1");
                }, 2000);
            } else {
                setErrorMessage("Invalid Credentials!");
                setTimeout(() => setErrorMessage(""), 2000);
            }
        } catch (error) {
            setErrorMessage("Invalid email, password, or role");
            setTimeout(() => setErrorMessage(""), 2000);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            {successMessage && (
                <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 shadow">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3 shadow">
                    {errorMessage}
                </div>
            )}

            <div className="row w-100 shadow-lg rounded overflow-hidden" style={{ maxWidth: '900px', backgroundColor: '#fff' }}>
                {/* IMAGE COLUMN */}
                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0 bg-primary">
                    <img
                        src={logo}
                        alt="Login visual"
                        className="img-fluid w-100 h-100 object-fit-cover"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* FORM COLUMN */}
                <div className="col-md-6 p-5">
                    <h2 className="text-center mb-4">Welcome Back</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Email ID</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
                                required
                            />
                            <div style={{ minHeight: '20px' }}>
                                {touchedFields.email && errors.email && (
                                    <small className="text-danger">{errors.email}</small>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Role</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="role"
                                        value="vendor"
                                        checked={formData.role === 'vendor'}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setTouchedFields(prev => ({ ...prev, role: true }));
                                        }}
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
                                        onChange={(e) => {
                                            handleChange(e);
                                            setTouchedFields(prev => ({ ...prev, role: true }));
                                        }}
                                    />
                                    <label className="form-check-label">Manager</label>
                                </div>
                            </div>
                            <div style={{ minHeight: '20px' }}>
                                {touchedFields.role && errors.role && (
                                    <small className="text-danger d-block">{errors.role}</small>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={!isFormValid}>
                            Login
                        </button>

                        <div className="text-center mt-3">
                            <small>
                                Don't have an account?{' '}
                                <span
                                    className="text-primary"
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => navigate('/register')}
                                >
                                    Sign Up
                                </span>
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

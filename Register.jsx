import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        age: '',
        gender: '',
        role: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [formValid, setFormValid] = useState({
        name: false,
        email: false,
        dob: false,
        age: false,
        gender: false,
        role: false,
        password: false
    });

    const [isButtonActive, setIsButtonActive] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        // Auto-calculate age on DOB change
        if (name === "dob") {
            const calculatedAge = calculateAge(value);
            updatedFormData.age = calculatedAge;
        }

        setFormData(updatedFormData);
        validateForm(name, value, updatedFormData);
    };

    const validateForm = (name, value, updatedFormData = formData) => {
        const newErrors = { ...errors };
        const newFormValid = { ...formValid };

        switch (name) {
            case 'name':
                newFormValid.name = !!value.trim();
                newErrors.name = newFormValid.name ? '' : 'Name is required';
                break;

            case 'email':
                newFormValid.email = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value);
                newErrors.email = newFormValid.email ? '' : 'Enter a valid email';
                break;

            case 'dob':
                const age = calculateAge(value);
                newFormValid.dob = !!value;
                newFormValid.age = age > 0;
                newErrors.dob = newFormValid.dob ? '' : 'Date of birth is required';
                newErrors.age = newFormValid.age ? '' : 'Age must be valid';
                break;

            case 'gender':
                newFormValid.gender = !!value;
                newErrors.gender = newFormValid.gender ? '' : 'Gender is required';
                break;

            case 'role':
                newFormValid.role = !!value;
                newErrors.role = newFormValid.role ? '' : 'Please select a role';
                break;

            case 'password':
                newFormValid.password = value.length >= 6;
                newErrors.password = newFormValid.password ? '' : 'Password must be at least 6 characters';
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

            await axios.post('http://localhost:5000/api/users/register', dataToSend);
            setSuccessMessage("User registered Successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            const resetForm = {
                name: '',
                email: '',
                dob: '',
                age: '',
                gender: '',
                role: '',
                password: ''
            };
            setFormData(resetForm);
            setErrors({});
            setFormValid({
                name: false,
                email: false,
                dob: false,
                age: false,
                gender: false,
                role: false,
                password: false
            });
            setIsButtonActive(false);
        } catch (error) {
            setErrorMessage("User Registration Failed!!");
            setTimeout(() => setErrorMessage(""), 3000);
            console.error(error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            {successMessage && (
                <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow" style={{ width: '100%', maxWidth: '450px' }}>
                <h3 className="text-center mb-4">Register</h3>

                <div className="form-group mb-3">
                    <label>Name</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>

                <div className="form-group mb-3">
                    <label>Email ID</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>

                <div className="form-group mb-3">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
                    {errors.dob && <small className="text-danger">{errors.dob}</small>}
                </div>

                <div className="form-group mb-3">
                    <label>Age</label>
                    <input type="number" name="age" className="form-control" value={formData.age} readOnly />
                    {errors.age && <small className="text-danger">{errors.age}</small>}
                </div>

                <div className="form-group mb-3">
                    <label>Gender</label>
                    <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <small className="text-danger">{errors.gender}</small>}
                </div>

                <div className="form-group mb-3">
                    <label>Role</label>
                    <div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="role" value="vendor" checked={formData.role === 'vendor'} onChange={handleChange} />
                            <label className="form-check-label">Vendor</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="role" value="manager" checked={formData.role === 'manager'} onChange={handleChange} />
                            <label className="form-check-label">Manager</label>
                        </div>
                    </div>
                    {errors.role && <small className="text-danger d-block">{errors.role}</small>}
                </div>

                <div className="form-group mb-3">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                    {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={!isButtonActive}>
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
------------------------------------------------------------------------user----------------------------------------------
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // assuming Mongoose model
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const { name, email, dob, age, gender, role, password } = req.body;

        if (!name || !email || !dob || !age || !gender || !role || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({
            name,
            email,
            dob,
            age,
            gender,
            role,
            password // already hashed by frontend
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
---------------------------------------------schema------------------------------
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    dob: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 1
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    role: {
        type: String,
        enum: ['vendor', 'manager'],
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

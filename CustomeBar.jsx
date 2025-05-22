import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styling.css'; // Includes updated animation

function App() {
    const navigate = useNavigate();

    return (
        <div className="landing-page-container">
            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow fixed-top">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="#">
                        Auto<span style={{ color: '#00bfa6' }}>Bill</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <div className="d-flex gap-2">
                            <button onClick={() => navigate('/register')} className="btn btn-outline-primary">Sign Up</button>
                            <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="hero-section d-flex align-items-center justify-content-center text-center  fade-in">
                <div className="container py-5">
                    <h1 className="display-3 fw-bold text-dark mb-4">
                        Simplify Billing with <span className="text-primary">AutoBill</span>
                    </h1>
                    <p className="lead text-secondary mb-5">Automate your invoices in seconds with powerful AI.</p>
                    <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg me-3">Get Started</button>
                    <button onClick={() => navigate('/login')} className="btn btn-outline-secondary btn-lg">Login</button>
                </div>
            </header>

            {/* FOOTER */}
            <footer className="text-center py-3  text-muted border-top">
                <div className="container">
                    &copy; 2025 AutoBill. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default App;

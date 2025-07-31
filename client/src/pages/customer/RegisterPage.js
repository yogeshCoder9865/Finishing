// client/src/pages/customer/RegisterPage.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// --- Simple UI Color Palette (consistent with other simple UIs) ---
const colors = {
    background: '#F8F8F8',        // Very light grey page background
    cardBackground: '#FFFFFF',     // White for main content and cards
    primaryText: '#333333',        // Dark grey for main text
    secondaryText: '#666666',      // Medium grey for secondary text
    border: '#EEEEEE',             // Light grey for borders and separators
    accentBlue: '#007BFF',         // Standard blue for links and actions
    successGreen: '#28A745',       // Green for success messages/buttons
    errorRed: '#DC3545',           // Red for error messages/buttons
};

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = { firstName, lastName, email, password };
            const res = await register(userData);
            if (res) {
                navigate('/');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration submission error:', err);
            setError(err.response?.data?.message || 'Registration failed. User might already exist or invalid data.');
        }
    };

    // --- Inline Styles for Simple UI ---
    const pageContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: colors.background, // Light grey background
        fontFamily: 'Inter, sans-serif',
        color: colors.primaryText,
    };

    const formCardStyle = {
        padding: '30px', // Reduced padding
        backgroundColor: colors.cardBackground, // White card background
        borderRadius: '5px', // Simple rounded corners
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Simple, subtle shadow
        width: '90%',
        maxWidth: '400px', // Slightly narrower card
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
    };

    const formTitleStyle = {
        color: colors.primaryText,
        fontSize: '1.8em', // Reduced font size
        marginBottom: '20px', // Reduced margin
        fontWeight: 'bold',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        backgroundColor: `${colors.errorRed}1A`, // Light tint of red
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontSize: '0.9em',
        fontWeight: 'normal',
        border: `1px solid ${colors.errorRed}`,
    };

    const formGroupStyle = {
        marginBottom: '15px', // Reduced margin
        textAlign: 'left',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: colors.primaryText,
        fontSize: '0.9em',
    };

    const inputStyle = {
        width: 'calc(100% - 20px)', // Account for padding
        padding: '10px', // Reduced padding
        border: `1px solid ${colors.border}`, // Light grey border
        borderRadius: '4px', // Simple rounded input fields
        fontSize: '0.9em',
        boxSizing: 'border-box',
        backgroundColor: colors.white,
        color: colors.primaryText,
    };

    const registerButtonStyle = {
        width: '100%',
        padding: '12px 15px', // Reduced padding
        backgroundColor: colors.successGreen, // Green for register
        color: colors.white,
        border: 'none',
        borderRadius: '5px', // Simple rounded button
        cursor: 'pointer',
        fontSize: '1em', // Reduced font size
        fontWeight: 'bold',
        marginTop: '15px', // Reduced margin
        // No hover effect for extreme simplicity
    };

    const loginLinkStyle = {
        marginTop: '20px', // Reduced margin
        fontSize: '0.9em',
        color: colors.secondaryText,
    };

    const linkStyle = {
        color: colors.accentBlue, // Blue link
        textDecoration: 'none',
        fontWeight: 'bold',
        // No hover effect for extreme simplicity
    };

    return (
        <div style={pageContainerStyle}>
            <div style={formCardStyle}>
                <h2 style={formTitleStyle}>Create Your Account</h2>
                {error && <p style={errorMessageStyle}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Create a password"
                        />
                    </div>
                    <button
                        type="submit"
                        style={registerButtonStyle}
                    >
                        Register
                    </button>
                </form>
                <p style={loginLinkStyle}>
                    Already have an account? <a href="/login" style={linkStyle}>Login here</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

// client/src/pages/common/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assesets/logo.png'; // Assuming a suitable logo image

// --- Professional UI Color Palette (Muted Teal Theme) ---
const colors = {
    primaryTeal: '#008080',        // Main teal for accents and buttons
    lightTeal: '#E0F2F2',          // Very light teal for subtle backgrounds
    darkText: '#2F4F4F',           // Dark slate gray for main text
    mediumText: '#708090',         // Light slate gray for secondary text
    white: '#FFFFFF',              // Pure white for card backgrounds
    offWhite: '#F8F8F8',           // Off-white for page background
    borderLight: '#B0C4DE',        // Light steel blue for borders
    shadowSubtle: 'rgba(0, 0, 0, 0.1)', // Soft shadow
    buttonHoverTeal: '#006666',    // Darker teal on button hover
    errorRed: '#DC3545',           // Standard error red
    googleBlue: '#4285F4',         // Google brand blue
    facebookBlue: '#1877F2',       // Facebook brand blue
    linkBlue: '#007bff',           // Standard link blue
    linkHoverBlue: '#0056b3',      // Darker link blue on hover
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loggedInUser = await login(email, password);

            if (loggedInUser) {
                if (loggedInUser.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login attempt failed:', err);
            let errorMessage = 'Login failed. Please try again later.';

            if (err.response && err.response.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- Inline Styles for Professional Login Page ---

    const pageContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: colors.offWhite, // Soft off-white background
        fontFamily: 'Inter, sans-serif',
        padding: '20px', // Add some padding around the card
        boxSizing: 'border-box',
    };

    const loginCardStyle = {
        backgroundColor: colors.white,
        padding: '40px',
        borderRadius: '12px',
        boxShadow: `0 8px 30px ${colors.shadowSubtle}`,
        width: '100%',
        maxWidth: '450px', // Max width for the login card
        textAlign: 'center',
        animation: 'fadeInUp 0.6s ease-out',
        border: `1px solid ${colors.borderLight}`,
    };

    const loginHeaderStyle = {
        display: 'flex',
        flexDirection: 'column', // Stack logo and title vertically
        alignItems: 'center',
        marginBottom: '30px',
    };

    const logoImageStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        marginBottom: '15px',
        border: `3px solid ${colors.primaryTeal}`, // Teal accent border
        boxShadow: `0 0 15px ${colors.primaryTeal}33`, // Subtle teal glow
    };

    const websiteNameStyle = {
        fontSize: '2.2em',
        fontWeight: '800',
        color: colors.darkText,
        letterSpacing: '0.5px',
        margin: 0,
    };

    const formTitleStyle = {
        color: colors.darkText,
        fontSize: '2em',
        marginBottom: '10px',
        fontWeight: '700',
    };

    const subTitleStyle = {
        color: colors.mediumText,
        fontSize: '1em',
        marginBottom: '30px',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        backgroundColor: `${colors.errorRed}1A`, // Light tint of red
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '25px',
        fontSize: '0.95em',
        fontWeight: '600',
        border: `1px solid ${colors.errorRed}`,
        animation: 'shake 0.5s ease-in-out',
        width: 'calc(100% - 24px)', // Adjust for padding
        margin: '0 auto 25px auto', // Center and add bottom margin
    };

    const formStyle = {
        width: '100%',
    };

    const formGroupStyle = {
        marginBottom: '20px',
        textAlign: 'left',
        position: 'relative',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: colors.darkText,
        fontSize: '0.9em',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '8px',
        fontSize: '1em',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: colors.lightTeal, // Light teal background for inputs
        color: colors.darkText,
        // Focus effect needs JS state or CSS file for pseudo-classes
    };

    const forgotPasswordLinkStyle = {
        position: 'absolute',
        right: '0',
        top: '0',
        fontSize: '0.85em',
        color: colors.linkBlue,
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease',
        // Hover effect needs JS state or CSS file
    };

    const loginButtonStyle = {
        width: '100%',
        padding: '15px 25px',
        backgroundColor: colors.primaryTeal, // Primary teal button
        color: colors.white,
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: `0 6px 15px ${colors.primaryTeal}33`,
        // Hover/active/disabled effects need JS state or CSS file
    };

    const orDividerStyle = {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '30px 0',
    };

    const orLineStyle = {
        flexGrow: 1,
        height: '1px',
        backgroundColor: colors.borderLight,
    };

    const orTextStyle = {
        margin: '0 15px',
        color: colors.mediumText,
        fontSize: '0.9em',
        fontWeight: '500',
    };

    const socialLoginContainerStyle = {
        display: 'flex',
        gap: '15px',
        width: '100%',
        marginBottom: '30px',
    };

    const socialButtonBaseStyle = {
        flex: 1,
        padding: '12px 15px',
        borderRadius: '8px',
        border: `1px solid ${colors.borderLight}`,
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: colors.white,
        // Hover effects need JS state or CSS file
    };

    const socialButtonGoogleStyle = {
        ...socialButtonBaseStyle,
        color: colors.googleBlue,
    };

    const socialButtonFacebookStyle = {
        ...socialButtonBaseStyle,
        color: colors.facebookBlue,
    };

    const socialIconStyle = {
        marginRight: '8px',
        fontSize: '1.1em',
    };

    const registerLinkStyle = {
        marginTop: '20px',
        fontSize: '0.95em',
        color: colors.mediumText,
    };

    const linkStyle = {
        color: colors.linkBlue,
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
        // Hover effect needs JS state or CSS file
    };

    return (
        <div style={pageContainerStyle}>
            <div style={loginCardStyle}>
                {/* Logo and Website Name */}
                <div style={loginHeaderStyle}>
                    <img
                        src={logo}
                        alt="Yogi Tech Logo"
                        style={logoImageStyle}
                    />
                    <h1 style={websiteNameStyle}>Moni Accessories</h1>
                </div>

                <h2 style={formTitleStyle}>Welcome Back</h2>
                <p style={subTitleStyle}>Please login to your account</p>

                {error && <p key={error} style={errorMessageStyle}>{error}</p>}

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="••••••••"
                        />
                        <Link to="/forgot-password" style={forgotPasswordLinkStyle}>Forgot Password?</Link>
                    </div>
                    <button type="submit" style={loginButtonStyle} disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div style={orDividerStyle}>
                    <span style={orLineStyle}></span>
                    <span style={orTextStyle}>Or Login With</span>
                    <span style={orLineStyle}></span>
                </div>

                <div style={socialLoginContainerStyle}>
                    <button style={socialButtonGoogleStyle}>
                        <i className="fab fa-google" style={socialIconStyle}></i> Google
                    </button>
                    <button style={socialButtonFacebookStyle}>
                        <i className="fab fa-facebook-f" style={socialIconStyle}></i> Facebook
                    </button>
                </div>

                <p style={registerLinkStyle}>
                    Don't have an account? <Link to="/register" style={linkStyle}>Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
// client/src/components/customer/CustomerNav.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assesets/logo.png';

// --- Professional UI Color Palette ---
const colors = {
    primaryBlue: '#007bff',        // Strong blue for primary actions/accents
    secondaryGrey: '#6c757d',      // Muted grey for secondary actions/text
    lightGrey: '#f8f9fa',          // Very light grey for backgrounds
    white: '#ffffff',              // Pure white for nav background
    darkText: '#343a40',           // Dark charcoal for main text
    mediumText: '#6c757d',         // Medium grey for secondary text
    borderLight: '#dee2e6',        // Light grey for subtle borders
    shadowSubtle: 'rgba(0, 0, 0, 0.08)', // Soft shadow
    buttonDanger: '#dc3545',       // Danger button red
    warningOrange: '#ffc107',      // Standard warning orange for impersonation
};

const CustomerNav = () => {
    const { logout, impersonatingUser, exitImpersonation } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleExitImpersonation = async () => {
        const success = await exitImpersonation();
        if (success) {
            navigate('/admin'); // Redirect back to admin portal after exiting
        }
    };

    // --- Inline Styles for Professional Top Navigation ---

    const navContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white, // Clean white background
        padding: '15px 30px',
        boxShadow: `0 2px 10px ${colors.shadowSubtle}`, // Subtle shadow
        fontFamily: 'Inter, sans-serif', // Modern, professional font
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: `1px solid ${colors.borderLight}`,
        minHeight: '70px', // Standard height
    };

    const logoSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        marginRight: 'auto', // Pushes other items to the right
    };

    const logoImageStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '10px',
        border: `2px solid ${colors.primaryBlue}`, // Blue accent border
        boxShadow: `0 0 8px ${colors.primaryBlue}33`, // Subtle blue glow
    };

    const websiteNameStyle = {
        fontSize: '1.6em',
        fontWeight: '700',
        color: colors.darkText,
        letterSpacing: '0.2px',
        margin: 0,
    };

    const navListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1, // Allows the nav items to spread
        justifyContent: 'center', // Centers the navigation links
    };

    const navItemStyle = {
        margin: '0 15px', // Spacing between items
    };

    const navLinkStyle = {
        color: colors.mediumText, // Muted grey for links
        textDecoration: 'none',
        fontSize: '1em',
        padding: '10px 0',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.3s ease, transform 0.2s ease',
        fontWeight: '500', // Standard weight
        position: 'relative',
        // Hover effect for links (standard underscore)
        // Note: Direct inline styles cannot handle pseudo-elements like ::after for animated underlines.
        // For true animated underlines, you'd need a CSS file or a CSS-in-JS library.
        // Here, we'll just change color and add a subtle transform.
        ':hover': {
            color: colors.primaryBlue, // Primary blue on hover
            transform: 'translateY(-1px)', // Slight lift
        },
    };

    const navIconStyle = {
        marginRight: '8px',
        fontSize: '1em',
        color: colors.secondaryGrey, // Subtle icon color
        transition: 'color 0.3s ease',
        // Hover effect for icons (needs to be applied to parent link's hover)
        // This is handled by a conceptual ':hover' on navLinkStyle
    };

    const logoutButtonStyle = {
        // Inherit some base styles for consistency, then override
        padding: '10px 20px',
        backgroundColor: colors.buttonDanger, // Red for logout
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.95em',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 3px 8px ${colors.shadowSubtle}`,
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        marginLeft: '20px', // Spacing from nav links
        fontFamily: 'Inter, sans-serif',
        // Hover/active effects would need JS state or CSS file
    };

    const impersonationBannerStyle = {
        padding: '8px 15px',
        backgroundColor: colors.warningOrange, // Standard warning orange
        color: colors.darkText,
        borderRadius: '5px',
        fontSize: '0.85em',
        fontWeight: '500',
        textAlign: 'center',
        boxShadow: `0 2px 8px ${colors.shadowSubtle}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '20px', // Spacing from logout button
        // Animation would need a CSS file
    };

    const impersonationTextStyle = {
        margin: '0 0 5px 0',
        lineHeight: '1.3',
    };

    const exitImpersonationButtonStyle = {
        backgroundColor: colors.secondaryGrey, // Muted grey for exit
        color: colors.white,
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8em',
        fontWeight: 'bold',
        marginTop: '5px',
        boxShadow: `0 1px 4px ${colors.shadowSubtle}`,
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        fontFamily: 'Inter, sans-serif',
        // Hover effect would need JS state or CSS file
    };

    return (
        <div style={navContainerStyle}>
            {/* Logo and Website Name */}
            <div style={logoSectionStyle}>
                <img
                    src={logo} // Placeholder logo, can be changed
                    alt="Moni Tech Logo"
                    style={logoImageStyle}
                />
                <h1 style={websiteNameStyle}>Moni Accessories</h1>
            </div>

            <ul style={navListStyle}>
                <li style={navItemStyle}>
                    <Link to="/" style={navLinkStyle}>
                        <i style={navIconStyle} className="fas fa-home"></i> Dashboard
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/products" style={navLinkStyle}>
                        <i style={navIconStyle} className="fas fa-box"></i> Browse Products
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/cart" style={navLinkStyle}>
                        <i style={navIconStyle} className="fas fa-shopping-cart"></i> My Cart
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/my-orders" style={navLinkStyle}>
                        <i style={navIconStyle} className="fas fa-clipboard-list"></i> My Orders
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/profile" style={navLinkStyle}>
                        <i style={navIconStyle} className="fas fa-user-circle"></i> My Profile
                    </Link>
                </li>
            </ul>

            {/* Right-aligned items: Impersonation Banner and Logout Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                {impersonatingUser && (
                    <div style={impersonationBannerStyle}>
                        <p style={impersonationTextStyle}>
                            Viewing as: <strong style={{ color: colors.darkText }}>{impersonatingUser.firstName} {impersonatingUser.lastName}</strong>
                        </p>
                        <button onClick={handleExitImpersonation} style={exitImpersonationButtonStyle}>
                            Exit Impersonation
                        </button>
                    </div>
                )}
                <button onClick={handleLogout} style={logoutButtonStyle}>
                    <i style={{ marginRight: '8px', color: colors.white }} className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    );
};

export default CustomerNav;
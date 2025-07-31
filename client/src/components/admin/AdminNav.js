import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assesets/logo.png'; // Assuming a suitable logo image

// --- Professional UI Color Palette ---
const colors = {
    primaryBlue: '#007bff',        // Strong blue for primary actions/accents
    secondaryGrey: '#6c757d',      // Muted grey for secondary actions/text
    lightGrey: '#f8f9fa',          // Very light grey for backgrounds
    white: '#ffffff',              // Pure white for element backgrounds
    darkText: '#343a40',           // Dark charcoal for main text
    mediumText: '#6c757d',         // Medium grey for secondary text
    borderLight: '#dee2e6',        // Light grey for subtle borders
    shadowSubtle: 'rgba(0, 0, 0, 0.08)', // Soft shadow
    shadowMedium: 'rgba(0, 0, 0, 0.15)', // More pronounced shadow
    alertRed: '#dc3545',           // Standard error red
    alertOrange: '#ffc107',        // Standard warning orange
    buttonHoverBlue: '#0056b3',    // Darker blue on hover
    buttonHoverRed: '#c82333',     // Darker red on hover
    linkHoverGrey: '#495057',      // Darker grey for link hover
};

const AdminNav = () => {
    const { logout, impersonatingUser, exitImpersonation } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleExitImpersonation = async () => {
        const success = await exitImpersonation();
        if (success) {
            navigate('/admin'); // Go back to admin dashboard
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

    const brandSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        marginRight: 'auto',
    };

    const brandLogoStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '10px',
        border: `2px solid ${colors.primaryBlue}`, // Blue accent border
        boxShadow: `0 0 8px ${colors.primaryBlue}33`, // Subtle blue glow
    };

    const brandTitleStyle = {
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
        flexGrow: 1,
        justifyContent: 'center', // Center the navigation links
    };

    const navItemStyle = {
        margin: '0 15px', // Spacing between items
        position: 'relative',
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
    };

    // Hover effect for links (standard underscore)
    // Note: Direct inline styles cannot handle pseudo-elements like ::after for animated underlines.
    // For true animated underlines, you'd need a CSS file or a CSS-in-JS library.
    // Here, we'll just change color and add a subtle transform.
    navLinkStyle[':hover'] = {
        color: colors.primaryBlue, // Primary blue on hover
        transform: 'translateY(-1px)', // Slight lift
    };

    const navIconStyle = {
        marginRight: '8px',
        fontSize: '1em',
        color: colors.secondaryGrey, // Subtle icon color
        transition: 'color 0.3s ease',
    };

    navLinkStyle[':hover']['& .fas'] = {
        color: colors.primaryBlue, // Change to primary blue on hover
    };

    const rightSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
    };

    const logoutButtonStyle = {
        backgroundColor: colors.alertRed, // Standard red for logout
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '0.95em',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 3px 8px ${colors.shadowSubtle}`,
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        marginLeft: '20px',
        // Hover/active effects would need JS state
    };

    const impersonationAlertStyle = {
        padding: '8px 15px',
        backgroundColor: colors.alertOrange, // Standard warning orange
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
        position: 'relative',
        animation: 'pulse 1.5s infinite alternate', // Standard pulse animation
    };

    const impersonationTextStyle = {
        margin: '0 0 5px 0',
        lineHeight: '1.3',
    };

    const impersonationIconStyle = {
        marginRight: '5px',
        fontSize: '0.9em',
        color: colors.darkText,
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
        // Hover effect would need JS state
    };

    return (
        <div style={navContainerStyle}>
            <div style={brandSectionStyle}>
                <img src={logo} alt="Admin Logo" style={brandLogoStyle} />
                <h3 style={brandTitleStyle}>Admin Panel</h3>
            </div>

            <ul style={navListStyle}>
                <li style={navItemStyle}>
                    <Link to="/admin" style={navLinkStyle}>
                        <i className="fas fa-tachometer-alt" style={navIconStyle}></i> Dashboard
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/admin/products" style={navLinkStyle}>
                        <i className="fas fa-box-open" style={navIconStyle}></i> Products
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/admin/customers" style={navLinkStyle}>
                        <i className="fas fa-users" style={navIconStyle}></i> Customers
                    </Link>
                </li>
                <li style={navItemStyle}>
                    <Link to="/admin/orders" style={navLinkStyle}>
                        <i className="fas fa-shopping-basket" style={navIconStyle}></i> Orders
                    </Link>
                </li>
               
            </ul>

            <div style={rightSectionStyle}>
                {impersonatingUser && (
                    <div style={impersonationAlertStyle}>
                        <p style={impersonationTextStyle}>
                            <i className="fas fa-user-secret" style={impersonationIconStyle}></i> Impersonating: <br />
                            <strong>{impersonatingUser.firstName} {impersonatingUser.lastName}</strong>
                        </p>
                        <button onClick={handleExitImpersonation} style={exitImpersonationButtonStyle}>
                            Exit Impersonation
                        </button>
                    </div>
                )}

                <button onClick={handleLogout} style={logoutButtonStyle}>
                    <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i> Logout
                </button>
            </div>
        </div>
    );
};

// Keyframes for animations (ensure these are in your client/src/index.css or a global stylesheet)
/*
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 8px rgba(255, 193, 7, 0.4); }
    50% { transform: scale(1.01); box-shadow: 0 0 12px rgba(255, 193, 7, 0.6); }
    100% { transform: scale(1); box-shadow: 0 0 8px rgba(255, 193, 7, 0.4); }
}
*/
export default AdminNav;
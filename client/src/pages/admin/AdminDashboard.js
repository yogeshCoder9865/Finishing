// client/src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
// import logo from '../../assesets/logo.png'; // Logo is now handled by AdminNav, no longer needed here for branding

// --- Professional UI Color Palette ---
const colors = {
    primaryBlue: '#007bff',        // Strong blue for primary actions/accents
    secondaryGrey: '#6c757d',      // Muted grey for secondary actions/text
    lightGrey: '#f8f9fa',          // Very light grey for backgrounds
    white: '#ffffff',              // Pure white for card backgrounds
    darkText: '#343a40',           // Dark charcoal for main text
    mediumText: '#6c757d',         // Medium grey for secondary text
    borderLight: '#dee2e6',        // Light grey for subtle borders
    shadowSubtle: 'rgba(0, 0, 0, 0.08)', // Soft shadow
    shadowMedium: 'rgba(0, 0, 0, 0.15)', // More pronounced shadow
    successGreen: '#28a745',       // Standard success green
    errorRed: '#dc3545',           // Standard error red
    warningOrange: '#ffc107',      // Standard warning orange
    infoBlue: '#17a2b8',           // Standard info blue (teal-ish)
    buttonPrimary: '#007bff',      // Primary button blue
    buttonSecondary: '#6c757d',    // Secondary button grey
    buttonDanger: '#dc3545',       // Danger button red
    buttonWarning: '#ffc107',      // Warning button orange
    buttonInfo: '#17a2b8',         // Info button teal
    buttonSuccess: '#28a745',      // Success button green
};

const AdminDashboard = () => {
    const { user, logout, authAxios } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: '0.00',
        pendingOrders: 0,
        ordersByStatus: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardStatistics = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await authAxios.get('/dashboard/statistics');

                setStats({
                    totalProducts: res.data.totalProducts || 0,
                    totalCustomers: res.data.totalUsers || 0, // Backend calls it totalUsers
                    totalOrders: res.data.totalOrders || 0,
                    totalRevenue: res.data.totalRevenue || '0.00',
                    pendingOrders: res.data.pendingOrders || 0,
                    ordersByStatus: {
                        'Pending': res.data.pendingOrders || 0,
                        'Delivered': (res.data.totalOrders || 0) - (res.data.pendingOrders || 0) // Simple approximation
                    }
                });
            } catch (err) {
                console.error('Failed to fetch dashboard statistics:', err);
                const errorMessage = err.response && err.response.data && err.response.data.message
                                           ? err.response.data.message
                                           : 'Failed to load dashboard statistics. Please try again.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStatistics();
    }, [authAxios]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper for Status Colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return colors.warningOrange;
            case 'Processing': return colors.infoBlue;
            case 'Shipped': return colors.infoBlue; // Using infoBlue for shipped
            case 'Delivered': return colors.successGreen;
            case 'Cancelled': return colors.errorRed;
            default: return colors.mediumText;
        }
    };

    // --- Inline Styles for Professional Dashboard ---

    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column', // AdminNav is a top bar
        minHeight: '100vh',
        backgroundColor: colors.lightGrey, // Light background for the whole page
        fontFamily: 'Inter, sans-serif', // Clean, modern font
        color: colors.darkText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '40px',
        backgroundColor: colors.white, // White background for the main content area
        borderRadius: '0 0 12px 12px', // Rounded bottom corners
        boxShadow: `0 5px 20px ${colors.shadowSubtle}`, // Subtle shadow
        margin: '0 30px 30px 30px', // Adjusted margin for top nav
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeInUp 0.6s ease-out forwards', // Gentle fade in from bottom
        boxSizing: 'border-box',
    };

    const headerContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '50px',
        paddingBottom: '25px',
        borderBottom: `1px solid ${colors.borderLight}`, // Clean separator
    };

    const pageTitleStyle = {
        color: colors.primaryBlue, // Primary blue for title
        fontFamily: 'Inter, sans-serif',
        fontSize: '2.8em',
        fontWeight: '700',
        margin: '0',
        letterSpacing: '0.5px',
        textAlign: 'center',
    };

    const welcomeMessageStyle = {
        fontSize: '1.2em',
        color: colors.mediumText,
        marginTop: '15px',
        textAlign: 'center',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        textAlign: 'center',
        fontSize: '1em',
        fontWeight: '600',
        padding: '12px',
        backgroundColor: `${colors.errorRed}1A`, // Light tint of red
        borderRadius: '8px',
        border: `1px solid ${colors.errorRed}`,
        width: '100%',
        maxWidth: '800px',
        marginBottom: '30px',
        animation: 'shake 0.5s ease-in-out',
        fontFamily: 'Inter, sans-serif',
    };

    const fullPageLoadingContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: colors.lightGrey,
        fontFamily: 'Inter, sans-serif',
        color: colors.mediumText,
    };

    const spinnerStyle = {
        border: `8px solid ${colors.borderLight}`,
        borderTop: `8px solid ${colors.primaryBlue}`, // Blue spinner
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite',
    };

    const accessDeniedContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: colors.lightGrey,
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '30px',
        color: colors.darkText,
    };

    const accessDeniedTitleStyle = {
        fontSize: '3em',
        color: colors.errorRed,
        marginBottom: '20px',
        fontWeight: '700',
        fontFamily: 'Inter, sans-serif',
    };

    const accessDeniedMessageStyle = {
        fontSize: '1.1em',
        color: colors.mediumText,
        marginBottom: '30px',
        maxWidth: '500px',
        lineHeight: '1.5',
    };

    const goHomeButtonStyle = {
        padding: '12px 25px',
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover/active effects would need JS state
    };

    // --- Dashboard Insight Panels Layout ---
    const insightPanelsContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Adjusted for a slightly more compact, professional look
        gap: '25px', // Standard gap
        width: '100%',
        maxWidth: '1200px', // Max width for content
        marginBottom: '50px',
        padding: '20px 0',
        justifyContent: 'center',
    };

    const insightPanelStyle = {
        backgroundColor: colors.white,
        padding: '30px',
        borderRadius: '8px', // Standard professional rounding
        boxShadow: `0 4px 15px ${colors.shadowSubtle}`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        border: `1px solid ${colors.borderLight}`,
        // Hover effects would need JS state
        animation: 'fadeInUp 0.8s ease-out forwards', // Apply animation with delay
        opacity: 0,
        transform: 'translateY(20px)',
    };

    const panelIconContainerStyle = {
        backgroundColor: colors.lightGrey, // Light grey background for icons
        borderRadius: '50%',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 2px 10px ${colors.shadowSubtle}`,
    };

    const panelIconStyle = {
        fontSize: '2.5em',
        color: colors.primaryBlue, // Blue icons
    };

    const panelTitleStyle = {
        color: colors.darkText,
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.8em',
        marginBottom: '10px',
        fontWeight: '600',
        letterSpacing: '0.2px',
    };

    const panelValueStyle = {
        fontSize: '3.2em', // Slightly smaller, still prominent
        fontWeight: '700',
        color: colors.primaryBlue, // Blue value
        marginBottom: '20px',
    };

    const panelActionButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.buttonPrimary, // Primary blue button
        color: colors.white,
        border: 'none',
        borderRadius: '5px', // Standard professional rounding
        cursor: 'pointer',
        fontSize: '0.95em',
        fontWeight: '600',
        marginTop: 'auto',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: `0 3px 8px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effects would need JS state
    };

    const ordersStatusListStyle = {
        width: '100%',
        textAlign: 'left',
        marginBottom: '15px',
        maxHeight: '180px', // Adjusted height
        overflowY: 'auto',
        paddingRight: '10px',
        boxSizing: 'border-box',
    };

    const orderStatusItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: `1px dashed ${colors.borderLight}`, // Light dashed line
        fontSize: '0.95em',
        color: colors.darkText,
    };

    const orderStatusBadgeStyle = {
        padding: '5px 10px',
        borderRadius: '4px', // Standard badge rounding
        color: colors.white,
        fontWeight: 'bold',
        fontSize: '0.85em',
        minWidth: '80px',
        textAlign: 'center',
        textTransform: 'capitalize',
        boxShadow: `0 1px 3px ${colors.shadowSubtle}`,
    };

    const orderStatusCountStyle = {
        fontWeight: 'bold',
        color: colors.darkText,
        fontSize: '1em',
    };

    const logoutButtonContainerStyle = {
        width: '100%',
        maxWidth: '1200px',
        textAlign: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: `1px solid ${colors.borderLight}`,
    };

    const logoutButtonStyle = {
        padding: '12px 25px',
        backgroundColor: colors.buttonDanger, // Red for logout
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        // Hover/active effects would need JS state
    };

    if (loading) {
        return (
            <div style={fullPageLoadingContainerStyle}>
                <div style={spinnerStyle}></div>
                <p style={{ color: colors.mediumText, marginTop: '20px', fontSize: '1.1em', fontFamily: 'Inter, sans-serif' }}>Loading dashboard statistics...</p>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div style={accessDeniedContainerStyle}>
                <h2 style={accessDeniedTitleStyle}>Access Denied</h2>
                <p style={accessDeniedMessageStyle}>You do not have administrative privileges to view this page.</p>
                <button onClick={() => navigate('/')} style={goHomeButtonStyle}>Go to Home</button>
            </div>
        );
    }

    return (
        <div style={pageContainerStyle}>
            <AdminNav />
            <div style={contentAreaStyle}>
                <div style={headerContainerStyle}>
                    <h2 style={pageTitleStyle}>Dashboard Overview</h2>
                    <p style={welcomeMessageStyle}>Welcome, administrator. Here's a summary of your system's performance.</p>
                </div>

                {error && <p style={errorMessageStyle}>{error}</p>}

                <div style={insightPanelsContainerStyle}>
                    {/* Total Products Panel */}
                    <div style={insightPanelStyle}>
                        <div style={panelIconContainerStyle}>
                            <i className="fas fa-box" style={panelIconStyle}></i>
                        </div>
                        <h3 style={panelTitleStyle}>Total Products</h3>
                        <p style={panelValueStyle}>{stats.totalProducts}</p>
                        <button onClick={() => navigate('/admin/products')} style={panelActionButtonStyle}>Manage Products</button>
                    </div>

                    {/* Total Customers Panel */}
                    <div style={insightPanelStyle}>
                        <div style={panelIconContainerStyle}>
                            <i className="fas fa-users" style={panelIconStyle}></i>
                        </div>
                        <h3 style={panelTitleStyle}>Total Customers</h3>
                        <p style={panelValueStyle}>{stats.totalCustomers}</p>
                        <button onClick={() => navigate('/admin/customers')} style={panelActionButtonStyle}>Manage Customers</button>
                    </div>

                    {/* Total Orders Panel */}
                    <div style={insightPanelStyle}>
                        <div style={panelIconContainerStyle}>
                            <i className="fas fa-shopping-cart" style={panelIconStyle}></i>
                        </div>
                        <h3 style={panelTitleStyle}>Total Orders</h3>
                        <p style={panelValueStyle}>{stats.totalOrders}</p>
                        <button onClick={() => navigate('/admin/orders')} style={panelActionButtonStyle}>Manage Orders</button>
                    </div>

                    {/* Total Revenue Panel (Reduced Prominence) */}
                    <div style={insightPanelStyle}>
                        <div style={panelIconContainerStyle}>
                            <i className="fas fa-dollar-sign" style={panelIconStyle}></i>
                        </div>
                        <h3 style={{ ...panelTitleStyle, fontSize: '1.6em', fontWeight: '500' }}>Total Revenue</h3>
                        <p style={{ ...panelValueStyle, fontSize: '2.5em', color: colors.darkText }}>${stats.totalRevenue}</p>
                        <button onClick={() => navigate('/admin/orders')} style={panelActionButtonStyle}>View Sales</button>
                    </div>

                    {/* Pending Orders Panel (Reduced Prominence) */}
                    <div style={insightPanelStyle}>
                        <div style={panelIconContainerStyle}>
                            <i className="fas fa-clock" style={panelIconStyle}></i>
                        </div>
                        <h3 style={{ ...panelTitleStyle, fontSize: '1.6em', fontWeight: '500' }}>Pending Orders</h3>
                        <p style={{ ...panelValueStyle, fontSize: '2.5em', color: colors.darkText }}>{stats.pendingOrders}</p>
                        <button onClick={() => navigate('/admin/orders?status=Pending')} style={panelActionButtonStyle}>Review Pending</button>
                    </div>

                    {/* Order Status Summary Panel */}
                    <div style={insightPanelStyle}>
                        <div style={panelIconContainerStyle}>
                            <i className="fas fa-info-circle" style={panelIconStyle}></i>
                        </div>
                        <h3 style={panelTitleStyle}>Order Status Summary</h3>
                        <div style={ordersStatusListStyle}>
                            {Object.entries(stats.ordersByStatus).length > 0 ? (
                                Object.entries(stats.ordersByStatus).map(([status, count]) => (
                                    <p key={status} style={orderStatusItemStyle}>
                                        <span style={{ ...orderStatusBadgeStyle, backgroundColor: getStatusColor(status) }}>
                                            {status}:
                                        </span>
                                        <span style={orderStatusCountStyle}>{count}</span>
                                    </p>
                                ))
                            ) : (
                                <p style={{ color: colors.mediumText, fontSize: '0.95em', fontFamily: 'Inter, sans-serif' }}>No detailed status breakdown available.</p>
                            )}
                        </div>
                        <button onClick={() => navigate('/admin/orders')} style={panelActionButtonStyle}>View All Orders</button>
                    </div>
                </div>

                <div style={logoutButtonContainerStyle}>
                    <button onClick={handleLogout} style={logoutButtonStyle}>
                        <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i> Logout
                    </button>
                </div>
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
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); }
}
@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
}
*/
export default AdminDashboard;
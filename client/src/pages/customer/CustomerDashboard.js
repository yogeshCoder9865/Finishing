// client/src/pages/customer/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CustomerNav from '../../components/customer/CustomerNav';

// --- Professional UI Color Palette (Soft Greens/Blues Theme) ---
const colors = {
    primaryGreen: '#28a745',       // Main green for accents and positive actions
    lightGreen: '#D4EDDA',         // Very light green for subtle backgrounds
    primaryBlue: '#007bff',        // Secondary blue for links and actions
    lightBlue: '#EBF5FB',          // Very light blue for backgrounds/highlights
    darkText: '#343a40',           // Dark charcoal for main text
    mediumText: '#6c757d',         // Medium grey for secondary text
    white: '#ffffff',              // Pure white for card backgrounds
    offWhite: '#f8f9fa',           // Off-white for page background
    borderLight: '#dee2e6',        // Light grey for subtle borders
    shadowSubtle: 'rgba(0, 0, 0, 0.08)', // Soft shadow
    shadowMedium: 'rgba(0, 0, 0, 0.15)', // More pronounced shadow
    errorRed: '#dc3545',           // Standard error red
    warningOrange: '#ffc107',      // Standard warning orange
    infoBlue: '#17a2b8',           // Standard info blue (teal-ish)
    buttonHoverGreen: '#218838',   // Darker green on button hover
    buttonHoverBlue: '#0056b3',    // Darker blue on button hover
    tableHeaderBg: '#ecf0f1',      // Light grey for table headers
    tableHeaderTxt: '#34495e',     // Dark text for table headers
    tableRowBorder: '#f0f0f0',     // Lighter border for table rows
};

const CustomerDashboard = () => {
    const { user, logout, authAxios } = useAuth();
    const navigate = useNavigate();
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState('');

    // Removed Mock data for featured products

    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (!user) {
                setLoadingOrders(false);
                return;
            }

            setLoadingOrders(true);
            setOrdersError('');
            try {
                // Assuming you have a /api/orders/myorders endpoint for customers
                const res = await authAxios.get('/orders/myorders');
                setRecentOrders(res.data.slice(0, 5)); // Show last 5 orders
            } catch (err) {
                console.error('Failed to fetch recent orders:', err);
                setOrdersError('Failed to load recent orders. Please try again.');
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchRecentOrders();
    }, [user, authAxios]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper for Status Colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return colors.warningOrange;
            case 'Processing': return colors.infoBlue;
            case 'Shipped': return colors.infoBlue;
            case 'Delivered': return colors.primaryGreen;
            case 'Cancelled': return colors.errorRed;
            default: return colors.mediumText;
        }
    };

    if (!user) {
        return (
            <div style={loadingContainerStyle}>
                <div style={spinnerStyle}></div>
                <p style={{ color: colors.mediumText, marginTop: '20px', fontSize: '1.1em' }}>Loading user data...</p>
            </div>
        );
    }

    // --- Inline Styles for Professional Customer Dashboard ---
    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.offWhite, // Soft off-white background
        fontFamily: 'Inter, sans-serif',
        color: colors.darkText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '40px',
        backgroundColor: colors.white, // White background for the main content area
        borderRadius: '0 0 12px 12px',
        boxShadow: `0 5px 20px ${colors.shadowSubtle}`,
        margin: '0 30px 30px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
    };

    const pageTitleStyle = {
        color: colors.darkText,
        fontSize: '2.8em',
        marginBottom: '15px',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: '0.5px',
    };

    const welcomeMessageStyle = {
        fontSize: '1.1em',
        color: colors.mediumText,
        marginBottom: '40px',
        textAlign: 'center',
    };

    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        width: '100%',
        maxWidth: '1000px',
        marginBottom: '50px',
    };

    const dashboardCardStyle = {
        backgroundColor: colors.white,
        padding: '30px',
        borderRadius: '12px',
        boxShadow: `0 6px 20px ${colors.shadowSubtle}`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        cursor: 'pointer',
        border: `1px solid ${colors.borderLight}`,
        // Hover effects would need JS state
    };

    const cardTitleStyle = {
        color: colors.primaryBlue,
        fontSize: '1.6em',
        marginBottom: '15px',
        fontWeight: '600',
    };

    const cardDescriptionStyle = {
        fontSize: '0.95em',
        color: colors.mediumText,
        marginBottom: '20px',
    };

    const cardButtonStyle = {
        padding: '12px 25px',
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        marginTop: '15px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 4px 10px ${colors.primaryBlue}33`,
        fontFamily: 'Inter, sans-serif',
        // Hover effects would need JS state
    };

    const sectionHeaderStyle = {
        color: colors.darkText,
        fontSize: '2em',
        marginBottom: '30px',
        fontWeight: '700',
        borderBottom: `1px solid ${colors.borderLight}`,
        paddingBottom: '10px',
        width: '100%',
        maxWidth: '1000px',
        textAlign: 'left',
    };

    const loadingContainerStyle = {
        textAlign: 'center',
        padding: '50px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
    };

    const loadingOrdersContainerStyle = {
        textAlign: 'center',
        padding: '50px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
    };

    const spinnerStyle = {
        border: `8px solid ${colors.borderLight}`,
        borderTop: `8px solid ${colors.primaryBlue}`,
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        textAlign: 'center',
        fontSize: '1em',
        fontWeight: '600',
        padding: '12px',
        backgroundColor: `${colors.errorRed}1A`,
        borderRadius: '8px',
        border: `1px solid ${colors.errorRed}`,
        width: '100%',
        maxWidth: '800px',
        marginBottom: '30px',
        animation: 'shake 0.5s ease-in-out',
        fontFamily: 'Inter, sans-serif',
    };

    const noOrdersMessageStyle = {
        textAlign: 'center',
        fontSize: '1.1em',
        color: colors.mediumText,
        padding: '30px',
        border: `2px dashed ${colors.borderLight}`,
        borderRadius: '10px',
        backgroundColor: colors.lightGrey,
        width: '100%',
        maxWidth: '800px',
        boxShadow: `0 2px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
    };

    const linkStyle = {
        color: colors.primaryBlue,
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
        // Hover effect would need JS state
    };

    const tableContainerStyle = {
        width: '100%',
        maxWidth: '1000px',
        overflowX: 'auto',
        boxShadow: `0 4px 15px ${colors.shadowSubtle}`,
        borderRadius: '10px',
        backgroundColor: colors.white,
        marginBottom: '40px',
        border: `1px solid ${colors.borderLight}`,
    };

    const ordersTableStyle = {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        borderRadius: '10px',
        overflow: 'hidden',
    };

    const tableHeaderRowStyle = {
        backgroundColor: colors.tableHeaderBg,
        color: colors.tableHeaderTxt,
        fontSize: '0.95em',
        fontWeight: '600',
        textTransform: 'uppercase',
    };

    const tableHeaderCellStyle = {
        padding: '15px 20px',
        textAlign: 'left',
        borderBottom: `1px solid ${colors.borderLight}`,
    };

    const tableRowStyle = {
        borderBottom: `1px solid ${colors.tableRowBorder}`,
        transition: 'background-color 0.2s ease',
        // Hover effect would need JS state
    };

    const tableBodyCellStyle = {
        padding: '12px 20px',
        verticalAlign: 'middle',
        color: colors.darkText,
    };

    const orderStatusStyle = {
        padding: '5px 10px',
        borderRadius: '5px',
        color: colors.white,
        fontWeight: 'bold',
        fontSize: '0.9em',
    };

    const viewDetailsButtonStyle = {
        padding: '8px 15px',
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 2px 8px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effect would need JS state
    };

    const logoutButtonStyle = {
        padding: '15px 30px',
        backgroundColor: colors.errorRed,
        color: colors.white,
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginTop: '50px',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: `0 6px 15px ${colors.errorRed}33`,
        fontFamily: 'Inter, sans-serif',
        // Hover/active effects would need JS state
    };

    // Removed Styles for Featured Products

    return (
        <div style={pageContainerStyle}>
            <CustomerNav />
            <div style={contentAreaStyle}>
                <h2 style={pageTitleStyle}>Welcome, {user.firstName}!</h2>
                <p style={welcomeMessageStyle}>Your personalized hub for all things shopping.</p>

                <div style={gridContainerStyle}>
                    <div style={dashboardCardStyle} onClick={() => navigate('/profile')}>
                        <h3 style={cardTitleStyle}>My Profile</h3>
                        <p style={cardDescriptionStyle}>Manage your personal information and password.</p>
                        <button style={cardButtonStyle}>View Profile</button>
                    </div>
                    <div style={dashboardCardStyle} onClick={() => navigate('/products')}>
                        <h3 style={cardTitleStyle}>Browse Products</h3>
                        <p style={cardDescriptionStyle}>Explore our latest collection of products.</p>
                        <button style={cardButtonStyle}>Shop Now</button>
                    </div>
                    <div style={dashboardCardStyle} onClick={() => navigate('/my-orders')}>
                        <h3 style={cardTitleStyle}>My Orders</h3>
                        <p style={cardDescriptionStyle}>Track your current orders and view past purchases.</p>
                        <button style={cardButtonStyle}>View Orders</button>
                    </div>
                </div>

                {/* Removed Featured Products Section */}

                <h3 style={sectionHeaderStyle}>Recent Orders</h3>
                {loadingOrders ? (
                    <div style={loadingOrdersContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.mediumText, marginTop: '15px' }}>Loading recent orders...</p>
                    </div>
                ) : ordersError ? (
                    <p style={errorMessageStyle}>{ordersError}</p>
                ) : recentOrders.length === 0 ? (
                    <p style={noOrdersMessageStyle}>You haven't placed any orders yet. <Link to="/products" style={linkStyle}>Start shopping!</Link></p>
                ) : (
                    <div style={tableContainerStyle}>
                        <table style={ordersTableStyle}>
                            <thead>
                                <tr style={tableHeaderRowStyle}>
                                    <th style={tableHeaderCellStyle}>Order ID</th>
                                    <th style={tableHeaderCellStyle}>Date</th>
                                    <th style={tableHeaderCellStyle}>Total</th>
                                    <th style={tableHeaderCellStyle}>Status</th>
                                    <th style={tableHeaderCellStyle}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order._id} style={tableRowStyle}>
                                        <td style={tableBodyCellStyle}>{order._id.substring(0, 8)}...</td>
                                        <td style={tableBodyCellStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={tableBodyCellStyle}>${order.totalAmount.toFixed(2)}</td>
                                        <td style={tableBodyCellStyle}>
                                            <span style={{ ...orderStatusStyle, backgroundColor: getStatusColor(order.status) }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={tableBodyCellStyle}>
                                            <button onClick={() => navigate(`/my-orders/${order._id}`)} style={viewDetailsButtonStyle}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            </div>
        </div>
    );
};

export default CustomerDashboard;

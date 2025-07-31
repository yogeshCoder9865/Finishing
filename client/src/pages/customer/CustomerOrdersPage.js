// client/src/pages/customer/CustomerOrdersPage.js
import React, { useEffect, useState } from 'react';
import CustomerNav from '../../components/customer/CustomerNav';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// --- Simple UI Color Palette ---
const colors = {
    background: '#F8F8F8',        // Very light grey page background
    cardBackground: '#FFFFFF',     // White for main content and modal
    primaryText: '#333333',        // Dark grey for main text
    secondaryText: '#666666',      // Medium grey for secondary text
    border: '#EEEEEE',             // Light grey for borders and separators
    accentBlue: '#007BFF',         // Standard blue for links and buttons
    successGreen: '#28A745',       // Green for success status/elements
    errorRed: '#DC3545',           // Red for error status/elements
    warningOrange: '#FFC107',      // Orange for pending/warning status
    infoTeal: '#17A2B8',           // Teal for processing/shipped status
};

const CustomerOrdersPage = () => {
    const { authAxios, user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal/details view

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const res = await authAxios.get('/orders/myorders'); // This endpoint fetches orders for the logged-in user
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to load your orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [authAxios, user]); // Re-run if authAxios or user changes

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    // Helper for Status Colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return colors.warningOrange;
            case 'Processing': return colors.infoTeal;
            case 'Shipped': return colors.infoTeal;
            case 'Delivered': return colors.successGreen;
            case 'Cancelled': return colors.errorRed;
            default: return colors.secondaryText;
        }
    };

    if (!user) {
        return (
            <div style={loadingContainerStyle}>
                <div style={spinnerStyle}></div>
                <p style={{ color: colors.secondaryText, marginTop: '20px', fontSize: '1.1em' }}>Loading user data...</p>
            </div>
        );
    }

    // --- Inline Styles for Simple UI ---
    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.background, // Very light grey background
        fontFamily: 'Inter, sans-serif',
        color: colors.primaryText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '20px',
        backgroundColor: colors.cardBackground, // White background for main content
        borderRadius: '5px',
        margin: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
    };

    const pageTitleStyle = {
        color: colors.primaryText,
        fontSize: '2em',
        marginBottom: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
    };

    const pageDescriptionStyle = {
        fontSize: '1em',
        color: colors.secondaryText,
        marginBottom: '20px',
        textAlign: 'center',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        backgroundColor: `${colors.errorRed}1A`, // Light tint of red
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontSize: '0.9em',
        textAlign: 'center',
        border: `1px solid ${colors.errorRed}`,
        width: '100%',
        maxWidth: '700px',
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
        border: `6px solid ${colors.border}`,
        borderTop: `6px solid ${colors.accentBlue}`,
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    };

    const noOrdersMessageStyle = {
        textAlign: 'center',
        fontSize: '1em',
        color: colors.secondaryText,
        padding: '30px',
        border: `1px dashed ${colors.border}`,
        borderRadius: '5px',
        backgroundColor: colors.background,
        width: '80%',
        maxWidth: '500px',
        marginTop: '10px',
    };

    const shopNowButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.accentBlue,
        color: colors.white,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: 'bold',
        marginTop: '15px',
        // Basic hover effect
        ':hover': {
            backgroundColor: colors.accentBlue, // No change for simplicity
        },
    };

    const tableContainerStyle = {
        width: '100%',
        maxWidth: '1000px',
        overflowX: 'auto',
        border: `1px solid ${colors.border}`,
        borderRadius: '5px',
        backgroundColor: colors.cardBackground,
        marginBottom: '20px',
    };

    const ordersTableStyle = {
        width: '100%',
        borderCollapse: 'collapse', // Simple collapse for clean lines
        borderRadius: '5px',
        overflow: 'hidden',
    };

    const tableHeaderRowStyle = {
        backgroundColor: colors.background,
        color: colors.primaryText,
        fontSize: '0.9em',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    };

    const tableHeaderCellStyle = {
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: `1px solid ${colors.border}`,
    };

    const tableRowStyle = {
        borderBottom: `1px solid ${colors.border}`,
        // No hover effect for extreme simplicity
    };

    const tableBodyCellStyle = {
        padding: '10px 15px',
        verticalAlign: 'middle',
        color: colors.primaryText,
        fontSize: '0.9em',
    };

    const orderStatusStyle = {
        padding: '4px 8px',
        borderRadius: '4px',
        color: colors.white,
        fontWeight: 'bold',
        fontSize: '0.8em',
    };

    const viewDetailsButtonStyle = {
        padding: '8px 15px',
        backgroundColor: colors.accentBlue,
        color: colors.white,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8em',
        // Basic hover effect
        ':hover': {
            backgroundColor: colors.accentBlue, // No change for simplicity
        },
    };

    // --- Modal Styles (Simple) ---
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Simple dark overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: colors.cardBackground,
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)', // Simple shadow
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    const modalTitleStyle = {
        fontSize: '1.8em',
        color: colors.primaryText,
        marginBottom: '20px',
        fontWeight: 'bold',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '10px',
    };

    const modalInfoGridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr', // Single column for simplicity
        gap: '10px',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: `1px dashed ${colors.border}`,
    };

    const modalSectionHeaderStyle = {
        fontSize: '1.2em',
        color: colors.primaryText,
        marginTop: '15px',
        marginBottom: '10px',
        fontWeight: 'bold',
    };

    const modalProductsListStyle = {
        maxHeight: '150px',
        overflowY: 'auto',
        marginBottom: '20px',
        borderBottom: `1px dashed ${colors.border}`,
        paddingBottom: '10px',
    };

    const modalProductItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
        paddingBottom: '8px',
        borderBottom: `1px dotted ${colors.border}`,
    };

    const modalProductImageStyle = {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginRight: '10px',
        border: `1px solid ${colors.border}`,
    };

    const modalProductNameStyle = {
        flexGrow: 1,
        fontSize: '0.9em',
        color: colors.primaryText,
    };

    const modalProductPriceStyle = {
        fontWeight: 'bold',
        color: colors.accentBlue,
        fontSize: '0.9em',
    };

    const modalAddressStyle = {
        lineHeight: '1.5',
        color: colors.secondaryText,
        marginBottom: '20px',
    };

    const modalFooterStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    };

    const closeModalButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.secondaryText,
        color: colors.white,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        // Basic hover effect
        ':hover': {
            backgroundColor: colors.secondaryText, // No change for simplicity
        },
    };

    return (
        <div style={pageContainerStyle}>
            <CustomerNav />
            <div style={contentAreaStyle}>
                <h2 style={pageTitleStyle}>My Orders</h2>
                <p style={pageDescriptionStyle}>Track the status of your recent and past orders.</p>

                {error && <p style={errorMessageStyle}>{error}</p>}

                {loading ? (
                    <div style={loadingOrdersContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.secondaryText, marginTop: '15px' }}>Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={noOrdersMessageStyle}>
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/products')} style={shopNowButtonStyle}>Start Shopping!</button>
                    </div>
                ) : (
                    <div style={tableContainerStyle}>
                        <table style={ordersTableStyle}>
                            <thead>
                                <tr style={tableHeaderRowStyle}>
                                    <th style={tableHeaderCellStyle}>Order ID</th>
                                    <th style={tableHeaderCellStyle}>Date</th>
                                    <th style={tableHeaderCellStyle}>Total</th>
                                    <th style={tableHeaderCellStyle}>Status</th>
                                    <th style={tableHeaderCellStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
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
                                            <button onClick={() => viewOrderDetails(order)} style={viewDetailsButtonStyle}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3 style={modalTitleStyle}>Order Details - {selectedOrder._id.substring(0, 8)}...</h3>
                            <div style={modalInfoGridStyle}>
                                <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status), fontWeight: 'bold' }}>{selectedOrder.status}</span></p>
                                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                <p><strong>Total Amount:</strong> <span style={{ fontWeight: 'bold', color: colors.accentBlue }}>${selectedOrder.totalAmount.toFixed(2)}</span></p>
                            </div>

                            <h4 style={modalSectionHeaderStyle}>Products:</h4>
                            <div style={modalProductsListStyle}>
                                {selectedOrder.products.map(item => (
                                    <div key={item.product ? item.product._id : item._id} style={modalProductItemStyle}> {/* Fallback key */}
                                        <img
                                            src={item.product ? item.product.imageUrl : 'https://placehold.co/40x40/eeeeee/333333?text=Prod'}
                                            alt={item.product ? item.product.name : 'Product Image'}
                                            style={modalProductImageStyle}
                                        />
                                        <span style={modalProductNameStyle}>
                                            {item.product ? item.product.name : 'Unknown Product'} x {item.quantity}
                                        </span>
                                        <span style={modalProductPriceStyle}>
                                            ${(item.priceAtOrder || item.product?.price || 0).toFixed(2)} {/* Fallback for price */}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <h4 style={modalSectionHeaderStyle}>Shipping Address:</h4>
                            <div style={modalAddressStyle}>
                                <p>{selectedOrder.shippingAddress.address1}</p>
                                {selectedOrder.shippingAddress.address2 && <p>{selectedOrder.shippingAddress.address2}</p>}
                                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                                <p>{selectedOrder.shippingAddress.country}</p>
                                {selectedOrder.shippingAddress.phone && <p>Phone: {selectedOrder.shippingAddress.phone}</p>}
                            </div>

                            <div style={modalFooterStyle}>
                                <button onClick={closeOrderDetails} style={closeModalButtonStyle}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrdersPage;

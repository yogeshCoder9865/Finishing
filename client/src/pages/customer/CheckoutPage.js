// client/src/pages/customer/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import CustomerNav from '../../components/customer/CustomerNav';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// --- Simple UI Color Palette ---
const colors = {
    primaryBlue: '#007BFF',        // Main action blue
    lightGrey: '#F4F4F4',          // Very light background grey
    mediumGrey: '#CCCCCC',         // Border/separator grey
    darkText: '#333333',           // Main text color
    white: '#FFFFFF',              // Pure white
    successGreen: '#28A745',       // Success messages/buttons
    errorRed: '#DC3545',           // Error messages
};

const CheckoutPage = () => {
    const { authAxios } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false); // State for success animation

    // Custom message box function (re-used for consistency)
    const showMessageBox = (message, type = 'info', onConfirm) => {
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${colors.white};
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 2000;
            text-align: center;
            font-family: 'Inter', sans-serif;
            max-width: 300px;
            width: 90%;
            border: 1px solid ${type === 'error' ? colors.errorRed : (type === 'success' ? colors.successGreen : colors.primaryBlue)};
        `;
        messageBox.innerHTML = `
            <p style="font-size: 1em; margin-bottom: 15px; color: ${colors.darkText};">${message}</p>
            <button id="msgBoxConfirmBtn" style="
                padding: 8px 15px;
                background-color: ${type === 'error' ? colors.errorRed : (type === 'success' ? colors.successGreen : colors.primaryBlue)};
                color: ${colors.white};
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
            ">OK</button>
        `;
        document.body.appendChild(messageBox);

        document.getElementById('msgBoxConfirmBtn').onclick = () => {
            document.body.removeChild(messageBox);
            if (onConfirm) onConfirm();
        };
    };

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (storedCart.length === 0) {
            showMessageBox('Your cart is empty. Please add items before checking out.', 'info', () => navigate('/products'));
            return;
        }
        setCartItems(storedCart);
    }, [navigate]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty!');
            return;
        }
        // Basic validation for required fields
        const requiredFields = ['address1', 'city', 'state', 'zip', 'country'];
        const missingFields = requiredFields.filter(field => !shippingAddress[field]);
        if (missingFields.length > 0) {
            setError(`Please fill in all required shipping address fields: ${missingFields.join(', ')}.`);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const orderItems = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity
            }));

            const orderData = {
                orderItems,
                shippingAddress,
                totalAmount: calculateTotal()
            };

            const res = await authAxios.post('/orders', orderData);
            localStorage.removeItem('cart'); // Clear cart after successful order
            setCartItems([]); // Clear cart state
            setOrderPlaced(true); // Trigger success animation

            showMessageBox(`Order placed successfully! Order ID: ${res.data._id.substring(0, 8)}...`, 'success', () => {
                navigate('/my-orders'); // Redirect to order history
            });

        } catch (err) {
            console.error('Order placement failed:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- Inline Styles for Simple UI ---

    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.lightGrey,
        fontFamily: 'Inter, sans-serif',
        color: colors.darkText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '20px',
        backgroundColor: colors.white,
        borderRadius: '5px',
        margin: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
    };

    const pageTitleStyle = {
        color: colors.darkText,
        fontSize: '2em',
        marginBottom: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        backgroundColor: `${colors.errorRed}1A`,
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontSize: '0.9em',
        textAlign: 'center',
        border: `1px solid ${colors.errorRed}`,
        width: '100%',
        maxWidth: '600px',
    };

    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr', // Single column for simplicity
        gap: '20px',
        width: '100%',
        maxWidth: '700px', // Max width for content
    };

    const sectionCardStyle = {
        backgroundColor: colors.lightGrey,
        padding: '20px',
        borderRadius: '5px',
        border: `1px solid ${colors.mediumGrey}`,
    };

    const sectionTitleStyle = {
        color: colors.darkText,
        fontSize: '1.5em',
        marginBottom: '15px',
        fontWeight: 'bold',
        borderBottom: `1px solid ${colors.mediumGrey}`,
        paddingBottom: '10px',
    };

    const formGroupStyle = {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
    };

    const labelStyle = {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: colors.darkText,
        fontSize: '0.9em',
    };

    const inputStyle = {
        padding: '10px',
        border: `1px solid ${colors.mediumGrey}`,
        borderRadius: '4px',
        fontSize: '0.9em',
        boxSizing: 'border-box',
        backgroundColor: colors.white,
        color: colors.darkText,
    };

    const orderSummaryItemsStyle = {
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '15px',
        paddingRight: '5px',
        border: `1px solid ${colors.mediumGrey}`,
        borderRadius: '4px',
        padding: '10px',
        backgroundColor: colors.white,
    };

    const orderItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: `1px dashed ${colors.mediumGrey}`,
    };

    const orderItemImageStyle = {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginRight: '10px',
        border: `1px solid ${colors.mediumGrey}`,
    };

    const orderItemNameStyle = {
        flexGrow: 1,
        fontSize: '0.9em',
        color: colors.darkText,
    };

    const orderItemPriceStyle = {
        fontWeight: 'bold',
        color: colors.primaryBlue,
        fontSize: '0.9em',
    };

    const totalAmountStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: colors.darkText,
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: `2px solid ${colors.mediumGrey}`,
    };

    const placeOrderButtonStyle = {
        width: '100%',
        padding: '15px 20px',
        backgroundColor: colors.successGreen,
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginTop: '20px',
        // Basic hover effect
        ':hover': {
            backgroundColor: colors.successGreen, // No change for simplicity
        },
        ':disabled': {
            backgroundColor: `${colors.successGreen}80`, // Lighter green when disabled
            cursor: 'not-allowed',
        },
    };

    const loadingOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(255, 255, 255, 0.9)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1500,
    };

    const spinnerStyle = {
        border: `6px solid ${colors.mediumGrey}`,
        borderTop: `6px solid ${colors.primaryBlue}`,
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
    };

    const successOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(40, 167, 69, 0.9)`, // Green overlay
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1500,
    };

    const successIconStyle = {
        fontSize: '4em',
        color: colors.white,
        border: `3px solid ${colors.white}`,
        borderRadius: '50%',
        padding: '15px',
        width: '90px',
        height: '90px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '15px',
    };

    const emptyCartStyle = {
        textAlign: 'center',
        fontSize: '1em',
        color: colors.darkText,
        padding: '30px',
        border: `1px dashed ${colors.mediumGrey}`,
        borderRadius: '5px',
        backgroundColor: colors.lightGrey,
        width: '80%',
        maxWidth: '400px',
    };

    return (
        <div style={pageContainerStyle}>
            <CustomerNav />
            <div style={contentAreaStyle}>
                <h2 style={pageTitleStyle}>Complete Your Order</h2>

                {error && <p style={errorMessageStyle}>{error}</p>}
                {loading && (
                    <div style={loadingOverlayStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.primaryBlue, marginTop: '10px', fontSize: '1em' }}>Placing your order...</p>
                    </div>
                )}
                {orderPlaced && (
                    <div style={successOverlayStyle}>
                        <div style={successIconStyle}>✓</div>
                        <p style={{ color: colors.white, fontSize: '1.2em', fontWeight: 'bold' }}>Order Placed!</p>
                    </div>
                )}

                {!orderPlaced && cartItems.length > 0 ? (
                    <div style={gridContainerStyle}>
                        {/* Shipping Address Section */}
                        <div style={sectionCardStyle}>
                            <h3 style={sectionTitleStyle}>Shipping Address</h3>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Address Line 1:</label>
                                <input type="text" name="address1" value={shippingAddress.address1} onChange={handleAddressChange} required style={inputStyle} placeholder="Street address, P.O. box, company name, c/o" />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Address Line 2 (Optional):</label>
                                <input type="text" name="address2" value={shippingAddress.address2} onChange={handleAddressChange} style={inputStyle} placeholder="Apartment, suite, unit, building, floor, etc." />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>City:</label>
                                <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} required style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>State/Province/Region:</label>
                                <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} required style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>ZIP / Postal Code:</label>
                                <input type="text" name="zip" value={shippingAddress.zip} onChange={handleAddressChange} required style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Country:</label>
                                <input type="text" name="country" value={shippingAddress.country} onChange={handleAddressChange} required style={inputStyle} />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Phone Number:</label>
                                <input type="text" name="phone" value={shippingAddress.phone} onChange={handleAddressChange} style={inputStyle} placeholder="Optional" />
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div style={sectionCardStyle}>
                            <h3 style={sectionTitleStyle}>Order Summary</h3>
                            <div style={orderSummaryItemsStyle}>
                                {cartItems.map(item => (
                                    <div key={item._id} style={orderItemStyle}>
                                        <img src={item.imageUrl || 'https://placehold.co/40x40/eeeeee/333333?text=Prod'} alt={item.name} style={orderItemImageStyle} />
                                        <span style={orderItemNameStyle}>{item.name} x {item.quantity}</span>
                                        <span style={orderItemPriceStyle}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={totalAmountStyle}>
                                <span>Order Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button onClick={placeOrder} disabled={loading || cartItems.length === 0} style={placeOrderButtonStyle}>
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                ) : (
                    !orderPlaced && <div style={emptyCartStyle}>
                        <p>Your cart is empty. <a href="/products" style={{ color: colors.primaryBlue }}>Start shopping!</a></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;

// client/src/pages/customer/CartPage.js
import React, { useState, useEffect } from 'react';
import CustomerNav from '../../components/customer/CustomerNav';
import { useNavigate } from 'react-router-dom';

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
    buttonDanger: '#dc3545',       // Danger button red
    buttonSuccess: '#28a745',      // Success button green
    tableHeaderBg: '#ecf0f1',      // Light background for table headers
    tableHeaderTxt: '#34495e',     // Dark text for table headers
    tableRowBorder: '#f0f0f0',     // Lighter border for table rows
    inputBorder: '#cfd8dc',        // Input border color
    inputShadow: 'rgba(0,0,0,0.05)', // Input shadow
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // --- Custom Message Box Functions (Re-used for consistency) ---
    const showMessageBox = (message, type = 'info', onConfirm) => {
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${colors.white};
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 5px 15px ${colors.shadowMedium};
            z-index: 2000;
            text-align: center;
            font-family: 'Inter', sans-serif;
            max-width: 400px;
            width: 90%;
            animation: fadeIn 0.3s ease-out;
            border: 2px solid ${type === 'error' ? colors.errorRed : (type === 'success' ? colors.successGreen : colors.infoBlue)};
        `;
        messageBox.innerHTML = `
            <p style="font-size: 1.1em; margin-bottom: 20px; color: ${colors.darkText};">${message}</p>
            <button id="msgBoxConfirmBtn" style="
                padding: 10px 20px;
                background-color: ${type === 'error' ? colors.errorRed : (type === 'success' ? colors.successGreen : colors.infoBlue)};
                color: ${colors.white};
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                transition: background-color 0.3s ease;
            ">OK</button>
        `;
        document.body.appendChild(messageBox);

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%); }
                to { opacity: 0; transform: translate(-50%, -60%); }
            }
        `;
        document.head.appendChild(styleSheet);

        document.getElementById('msgBoxConfirmBtn').onclick = () => {
            messageBox.style.animation = 'fadeOut 0.3s ease-in forwards';
            messageBox.addEventListener('animationend', () => {
                document.body.removeChild(messageBox);
                document.head.removeChild(styleSheet);
                if (onConfirm) onConfirm();
            });
        };
    };

    useEffect(() => {
        // Load cart from localStorage on component mount
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const updateQuantity = (id, newQuantity) => {
        const updatedCart = cartItems.map(item =>
            item._id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item._id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            showMessageBox('Your cart is empty! Please add some items before checking out.', 'info');
            return;
        }
        navigate('/checkout');
    };

    // --- Inline Styles for Professional UI ---
    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.lightGrey, // Light background for the whole page
        fontFamily: 'Inter, sans-serif', // Consistent font
        color: colors.darkText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '40px',
        backgroundColor: colors.white, // White background for the main content area
        borderRadius: '0 0 12px 12px',
        boxShadow: `0 5px 20px ${colors.shadowSubtle}`, // Subtle shadow
        margin: '0 30px 30px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center content horizontally
        boxSizing: 'border-box',
    };

    const pageTitleStyle = {
        color: colors.primaryBlue, // Darker title color
        fontSize: '2.8em',
        marginBottom: '40px',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: '0.5px',
    };

    const emptyCartStyle = {
        textAlign: 'center',
        fontSize: '1.2em',
        color: colors.mediumText,
        padding: '50px',
        border: `2px dashed ${colors.borderLight}`,
        borderRadius: '10px',
        backgroundColor: colors.lightGrey,
        width: '80%',
        maxWidth: '500px',
        boxShadow: `0 2px 10px ${colors.shadowSubtle}`,
        marginTop: '20px',
        fontFamily: 'Inter, sans-serif',
    };

    const shopNowButtonStyle = {
        padding: '12px 25px',
        backgroundColor: colors.primaryBlue, // A vibrant blue
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effects would need JS state
    };

    const cartTableContainerStyle = {
        width: '100%',
        overflowX: 'auto',
        marginBottom: '40px',
        boxShadow: `0 4px 15px ${colors.shadowSubtle}`,
        borderRadius: '10px',
        backgroundColor: colors.white,
        border: `1px solid ${colors.borderLight}`,
    };

    const cartTableStyle = {
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
        padding: '15px 20px',
        verticalAlign: 'middle',
        color: colors.darkText,
    };

    const productInfoStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const productImageStyle = {
        width: '70px',
        height: '70px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginRight: '15px',
        border: `1px solid ${colors.borderLight}`,
    };

    const productNameStyle = {
        fontWeight: '600',
        fontSize: '1.1em',
    };

    const quantityInputStyle = {
        width: '70px',
        padding: '8px',
        borderRadius: '6px',
        border: `1px solid ${colors.inputBorder}`,
        fontSize: '1em',
        textAlign: 'center',
        boxShadow: `inset 0 1px 3px ${colors.inputShadow}`,
        backgroundColor: colors.lightGrey,
        color: colors.darkText,
    };

    const removeButtonStyle = {
        padding: '10px 18px',
        backgroundColor: colors.buttonDanger, // Red for remove
        color: colors.white,
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.95em',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 2px 8px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effect would need JS state
    };

    const cartSummaryStyle = {
        width: '100%',
        maxWidth: '450px', // Constrain width for summary
        backgroundColor: colors.lightGrey,
        padding: '30px',
        borderRadius: '12px',
        boxShadow: `0 4px 15px ${colors.shadowSubtle}`,
        border: `1px solid ${colors.borderLight}`,
        marginTop: '20px',
    };

    const totalAmountStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.8em',
        fontWeight: '700',
        color: colors.darkText,
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: `1px dashed ${colors.borderLight}`,
    };

    const checkoutButtonStyle = {
        width: '100%',
        padding: '18px 30px',
        backgroundColor: colors.buttonSuccess, // Green for checkout
        color: colors.white,
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1.4em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 6px 15px ${colors.successGreen}33`,
        fontFamily: 'Inter, sans-serif',
        // Hover effect would need JS state
    };

    return (
        <div style={pageContainerStyle}>
            <CustomerNav />
            <div style={contentAreaStyle}>
                <h2 style={pageTitleStyle}>Your Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <div style={emptyCartStyle}>
                        <p>Your cart is empty.</p>
                        <button onClick={() => navigate('/products')} style={shopNowButtonStyle}>Start Shopping!</button>
                    </div>
                ) : (
                    <>
                        <div style={cartTableContainerStyle}>
                            <table style={cartTableStyle}>
                                <thead>
                                    <tr style={tableHeaderRowStyle}>
                                        <th style={tableHeaderCellStyle}>Product</th>
                                        <th style={tableHeaderCellStyle}>Price</th>
                                        <th style={tableHeaderCellStyle}>Quantity</th>
                                        <th style={tableHeaderCellStyle}>Subtotal</th>
                                        <th style={tableHeaderCellStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item._id} style={tableRowStyle}>
                                            <td style={tableBodyCellStyle}>
                                                <div style={productInfoStyle}>
                                                    <img src={item.imageUrl || 'https://placehold.co/60x60/eeeeee/333333?text=Prod'} alt={item.name} style={productImageStyle} />
                                                    <span style={productNameStyle}>{item.name}</span>
                                                </div>
                                            </td>
                                            <td style={tableBodyCellStyle}>${item.price.toFixed(2)}</td>
                                            <td style={tableBodyCellStyle}>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                                    min="1"
                                                    style={quantityInputStyle}
                                                />
                                            </td>
                                            <td style={tableBodyCellStyle}>${(item.price * item.quantity).toFixed(2)}</td>
                                            <td style={tableBodyCellStyle}>
                                                <button onClick={() => removeItem(item._id)} style={removeButtonStyle}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={cartSummaryStyle}>
                            <div style={totalAmountStyle}>
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button onClick={handleCheckout} style={checkoutButtonStyle}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
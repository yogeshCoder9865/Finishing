// client/src/pages/admin/AdminOrderManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { useAuth } from '../../context/AuthContext';

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

const AdminOrderManagement = () => {
    const { authAxios } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchCustomerEmail, setSearchCustomerEmail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // --- Custom Message Box Functions (Styled for professional theme) ---
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

    const showConfirmBox = (message, onConfirm, onCancel) => {
        const confirmBox = document.createElement('div');
        confirmBox.style.cssText = `
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
            border: 2px solid ${colors.warningOrange};
        `;
        confirmBox.innerHTML = `
            <p style="font-size: 1.1em; margin-bottom: 20px; color: ${colors.darkText};">${message}</p>
            <button id="confirmBoxConfirmBtn" style="
                padding: 10px 20px;
                background-color: ${colors.successGreen};
                color: ${colors.white};
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                transition: background-color 0.3s ease;
                margin-right: 15px;
            ">Yes</button>
            <button id="confirmBoxCancelBtn" style="
                padding: 10px 20px;
                background-color: ${colors.secondaryGrey};
                color: ${colors.white};
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                transition: background-color 0.3s ease;
            ">No</button>
        `;
        document.body.appendChild(confirmBox);

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

        const removeConfirmBox = () => {
            confirmBox.style.animation = 'fadeOut 0.3s ease-in forwards';
            confirmBox.addEventListener('animationend', () => {
                document.body.removeChild(confirmBox);
                document.head.removeChild(styleSheet);
            });
        };

        document.getElementById('confirmBoxConfirmBtn').onclick = () => {
            removeConfirmBox();
            if (onConfirm) onConfirm();
        };
        document.getElementById('confirmBoxCancelBtn').onclick = () => {
            removeConfirmBox();
            if (onCancel) onCancel();
        };
    };

    // --- Fetch Orders (wrapped in useCallback for memoization) ---
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (filterStatus !== 'All') {
                params.status = filterStatus;
            }
            if (searchCustomerEmail) {
                params.customerEmail = searchCustomerEmail;
            }

            const res = await authAxios.get('/orders', { params });
            // Ensure res.data is an array or has an 'orders' key that is an array
            setOrders(res.data.orders || res.data);
            setTotalPages(res.data.pages || 1);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [authAxios, currentPage, filterStatus, searchCustomerEmail, itemsPerPage]);

    // --- Effect to call fetchOrders on component mount and dependency changes ---
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // --- Handlers for Order Actions ---

    const handleFilterStatusChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSearchCustomerChange = (e) => {
        setSearchCustomerEmail(e.target.value);
        setCurrentPage(1); // Reset to first page on search change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewClick = (order) => {
        setSelectedOrder({ ...order });
        setIsViewModalOpen(true);
        setError(''); // Clear errors on modal open
        setSuccessMessage(''); // Clear success on modal open
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        showConfirmBox(`Are you sure you want to change order status to "${newStatus}"?`, async () => {
            try {
                setError('');
                setSuccessMessage('');
                const res = await authAxios.put(`/orders/${orderId}/status`, { status: newStatus });
                // Update the specific order in the state to reflect the change immediately
                setOrders(prev => prev.map(order => order._id === res.data._id ? res.data : order));
                showMessageBox('Order status updated successfully!', 'success');
            } catch (err) {
                console.error('Failed to update order status:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Failed to update order status.');
            }
        });
    };

    const handleDeleteOrder = async (orderId) => {
        showConfirmBox('Are you sure you want to delete this order? This action cannot be undone and will restore product stock.', async () => {
            try {
                setError('');
                setSuccessMessage('');
                await authAxios.delete(`/orders/${orderId}`);
                // Filter out the deleted order from the state
                setOrders(prev => prev.filter(order => order._id !== orderId));
                showMessageBox('Order deleted successfully!', 'success');
            } catch (err) {
                console.error('Failed to delete order:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Failed to delete order.');
            }
        });
    };

    // Helper for Status Colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return colors.warningOrange;
            case 'Processing': return colors.infoBlue;
            case 'Shipped': return colors.infoBlue;
            case 'Delivered': return colors.successGreen;
            case 'Cancelled': return colors.errorRed;
            default: return colors.mediumText;
        }
    };

    // --- Inline Styles for Professional UI ---
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
        padding: '40px',
        backgroundColor: colors.white,
        borderRadius: '0 0 12px 12px',
        boxShadow: `0 5px 20px ${colors.shadowSubtle}`,
        margin: '0 30px 30px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeInUp 0.6s ease-out',
        boxSizing: 'border-box',
    };

    const headerContainerStyle = {
        display: 'flex',
        flexDirection: 'column', // Changed to column for better stacking on smaller screens
        justifyContent: 'center', // Center title
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '40px',
        paddingBottom: '15px',
        borderBottom: `1px solid ${colors.borderLight}`,
    };

    const pageTitleStyle = {
        color: colors.primaryBlue,
        fontSize: '2.8em',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '0.5px',
        textAlign: 'center',
    };

    const controlsContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px',
        width: '100%',
        maxWidth: '1200px',
        padding: '15px',
        backgroundColor: colors.lightGrey,
        borderRadius: '10px',
        boxShadow: `0 2px 10px ${colors.shadowSubtle}`,
    };

    const filterGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        position: 'relative',
    };

    const labelStyle = {
        fontWeight: '600',
        color: colors.darkText,
        fontSize: '1em',
    };

    const selectStyle = {
        padding: '10px 15px',
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '8px',
        fontSize: '1em',
        backgroundColor: colors.white,
        color: colors.darkText,
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        // Hover/focus would need JS state or CSS file
    };

    const searchInputStyle = {
        padding: '10px 15px 10px 40px', // Left padding for icon
        width: '250px',
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '8px',
        fontSize: '1em',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: colors.white,
        color: colors.darkText,
        // Hover/focus would need JS state or CSS file
    };

    const searchIconStyle = {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: colors.mediumText,
        fontSize: '1em',
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

    const successMessageStyle = {
        color: colors.successGreen,
        textAlign: 'center',
        fontSize: '1em',
        fontWeight: '600',
        padding: '12px',
        backgroundColor: `${colors.successGreen}1A`,
        borderRadius: '8px',
        border: `1px solid ${colors.successGreen}`,
        width: '100%',
        maxWidth: '800px',
        marginBottom: '30px',
        animation: 'bounceIn 0.6s ease-out',
        fontFamily: 'Inter, sans-serif',
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

    const spinnerStyle = {
        border: `8px solid ${colors.borderLight}`,
        borderTop: `8px solid ${colors.primaryBlue}`,
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    };

    const noOrdersMessageStyle = {
        textAlign: 'center',
        fontSize: '1.2em',
        color: colors.mediumText,
        padding: '50px',
        border: `2px dashed ${colors.borderLight}`,
        borderRadius: '10px',
        backgroundColor: colors.lightGrey,
        width: '80%',
        maxWidth: '600px',
        boxShadow: `0 2px 10px ${colors.shadowSubtle}`,
        marginTop: '20px',
        fontFamily: 'Inter, sans-serif',
    };

    const resetFilterButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.secondaryGrey,
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.95em',
        fontWeight: '600',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 2px 8px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover/active effects would need JS state
    };

    const tableContainerStyle = {
        width: '100%',
        maxWidth: '1200px',
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
        backgroundColor: colors.lightGrey,
        color: colors.darkText,
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
        borderBottom: `1px solid ${colors.borderLight}`,
        transition: 'background-color 0.2s ease',
        // Hover effect would need JS state
    };

    const tableCellStyle = {
        padding: '12px 15px',
        borderBottom: `1px solid ${colors.borderLight}`,
        color: colors.darkText,
    };

    const statusBadgeStyle = {
        padding: '5px 10px',
        borderRadius: '5px',
        color: colors.white,
        fontWeight: 'bold',
        fontSize: '0.85em',
    };

    const tableActionCellStyle = {
        padding: '12px 15px',
        borderBottom: `1px solid ${colors.borderLight}`,
        whiteSpace: 'nowrap',
        display: 'flex', // Use flex for button alignment
        gap: '8px', // Space between buttons
        alignItems: 'center',
    };

    const actionButtonStyle = {
        padding: '8px 12px',
        borderRadius: '5px',
        border: 'none',
        color: colors.white,
        cursor: 'pointer',
        fontSize: '0.85em',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: `0 2px 5px ${colors.shadowSubtle}`,
        // Hover effect would need JS state
    };

    const paginationContainerStyle = {
        marginTop: '30px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: colors.lightGrey,
        boxShadow: `0 2px 8px ${colors.shadowSubtle}`,
    };

    const paginationButtonStyle = {
        padding: '10px 15px',
        margin: '0 5px',
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.95em',
        transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
        // Hover effect would need JS state
    };

    // --- Modal Styles ---
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
        backdropFilter: 'blur(2px)',
    };

    const modalContentStyle = {
        backgroundColor: colors.white,
        padding: '35px',
        borderRadius: '10px',
        boxShadow: `0 8px 30px ${colors.shadowMedium}`,
        width: '90%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'zoomIn 0.3s ease-out',
        fontFamily: 'Inter, sans-serif',
        border: `1px solid ${colors.borderLight}`,
    };

    const modalTitleStyle = {
        fontSize: '2em',
        color: colors.primaryBlue,
        marginBottom: '25px',
        fontWeight: '700',
        borderBottom: `1px solid ${colors.borderLight}`,
        paddingBottom: '10px',
        textAlign: 'center',
    };

    const modalErrorMessageStyle = {
        color: colors.errorRed,
        textAlign: 'center',
        fontSize: '0.95em',
        fontWeight: 'bold',
        padding: '10px',
        backgroundColor: `${colors.errorRed}1A`,
        borderRadius: '8px',
        border: `1px solid ${colors.errorRed}`,
        marginBottom: '20px',
        fontFamily: 'Inter, sans-serif',
    };

    const modalInfoGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: `1px dashed ${colors.borderLight}`,
        color: colors.darkText,
        fontSize: '0.95em',
    };

    const modalSectionHeaderStyle = {
        fontSize: '1.4em',
        color: colors.darkText,
        marginTop: '25px',
        marginBottom: '15px',
        fontWeight: '600',
    };

    const modalProductsListStyle = {
        maxHeight: '200px',
        overflowY: 'auto',
        paddingRight: '10px',
        marginBottom: '25px',
        borderBottom: `1px dashed ${colors.borderLight}`,
        paddingBottom: '15px',
    };

    const modalProductItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    };

    const modalProductImageStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginRight: '15px',
        border: `1px solid ${colors.borderLight}`,
    };

    const modalProductNameStyle = {
        flexGrow: 1,
        fontSize: '1em',
        color: colors.darkText,
    };

    const modalProductPriceStyle = {
        fontWeight: 'bold',
        color: colors.primaryBlue,
        fontSize: '1em',
    };

    const modalAddressStyle = {
        lineHeight: '1.6',
        color: colors.darkText,
        marginBottom: '25px',
        fontSize: '0.95em',
    };

    const modalFooterStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '30px',
    };

    const closeModalButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.secondaryGrey,
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effect would need JS state
    };

    return (
        <div style={pageContainerStyle}>
            <AdminNav />
            <div style={contentAreaStyle}>
                <div style={headerContainerStyle}>
                    <h2 style={pageTitleStyle}>Order Management</h2>
                </div>

                <div style={controlsContainerStyle}>
                    <div style={filterGroupStyle}>
                        <label htmlFor="filterStatus" style={labelStyle}>Filter by Status:</label>
                        <select id="filterStatus" value={filterStatus} onChange={handleFilterStatusChange} style={selectStyle}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div style={filterGroupStyle}>
                        <label htmlFor="searchCustomer" style={labelStyle}>Search by Customer Email:</label>
                        <input
                            type="text"
                            id="searchCustomer"
                            placeholder="Customer email..."
                            value={searchCustomerEmail}
                            onChange={handleSearchCustomerChange}
                            style={searchInputStyle}
                        />
                        <i className="fas fa-search" style={searchIconStyle}></i>
                    </div>
                </div>

                {error && <p style={errorMessageStyle}>{error}</p>}
                {successMessage && <p style={successMessageStyle}>{successMessage}</p>}

                {loading ? (
                    <div style={loadingContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.mediumText, marginTop: '15px', fontFamily: 'Inter, sans-serif' }}>Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={noOrdersMessageStyle}>
                        <p>No orders found matching your criteria.</p>
                        <button onClick={() => { setFilterStatus('All'); setSearchCustomerEmail(''); setCurrentPage(1); }} style={resetFilterButtonStyle}>Reset Filters</button>
                    </div>
                ) : (
                    <>
                        <div style={tableContainerStyle}>
                            <table style={ordersTableStyle}>
                                <thead>
                                    <tr style={tableHeaderRowStyle}>
                                        <th style={tableHeaderCellStyle}>Order ID</th>
                                        <th style={tableHeaderCellStyle}>Customer</th>
                                        <th style={tableHeaderCellStyle}>Date</th>
                                        <th style={tableHeaderCellStyle}>Total</th>
                                        <th style={tableHeaderCellStyle}>Status</th>
                                        <th style={tableHeaderCellStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        // Apply a subtle animation delay to each row
                                        <tr key={order._id} style={{ ...tableRowStyle, animation: `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`, opacity: 0 }}>
                                            <td style={tableCellStyle}>{order._id.substring(0, 8)}...</td>
                                            <td style={tableCellStyle}>{order.user ? `${order.user.firstName} ${order.user.lastName} (${order.user.email})` : 'N/A'}</td>
                                            <td style={tableCellStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={tableCellStyle}>${order.totalAmount.toFixed(2)}</td>
                                            <td style={tableCellStyle}>
                                                <span style={{ ...statusBadgeStyle, backgroundColor: getStatusColor(order.status) }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={tableActionCellStyle}>
                                                <button
                                                    onClick={() => handleViewClick(order)}
                                                    style={{ ...actionButtonStyle, backgroundColor: colors.buttonPrimary }}
                                                >
                                                    <i className="fas fa-eye"></i> View
                                                </button>
                                                <select
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    value={order.status}
                                                    style={{ ...actionButtonStyle, backgroundColor: colors.buttonSecondary, width: 'auto', minWidth: '100px', padding: '8px 12px' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    style={{ ...actionButtonStyle, backgroundColor: colors.buttonDanger }}
                                                >
                                                    <i className="fas fa-trash-alt"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        <div style={paginationContainerStyle}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        ...paginationButtonStyle,
                                        backgroundColor: currentPage === page ? colors.primaryBlue : colors.white,
                                        color: currentPage === page ? colors.white : colors.darkText,
                                        fontWeight: currentPage === page ? 'bold' : 'normal',
                                        border: `1px solid ${currentPage === page ? colors.primaryBlue : colors.borderLight}`,
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* --- View Order Details Modal --- */}
                {isViewModalOpen && selectedOrder && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3 style={modalTitleStyle}>Order Details - {selectedOrder._id.substring(0, 8)}...</h3>
                            {error && <p style={modalErrorMessageStyle}>{error}</p>}
                            <div style={modalInfoGridStyle}>
                                <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status), fontWeight: 'bold' }}>{selectedOrder.status}</span></p>
                                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                <p><strong>Total Amount:</strong> <span style={{ fontWeight: 'bold', color: colors.primaryBlue }}>${selectedOrder.totalAmount.toFixed(2)}</span></p>
                            </div>

                            <h4 style={modalSectionHeaderStyle}>Products:</h4>
                            <div style={modalProductsListStyle}>
                                {selectedOrder.products.map(item => (
                                    <div key={item.product?._id || Math.random()} style={modalProductItemStyle}> {/* Fallback key */}
                                        <img
                                            src={item.product?.imageUrl || 'https://placehold.co/60x60/e0f2f7/3498db?text=No+Image'}
                                            alt={item.product?.name || 'Unknown Product'}
                                            style={modalProductImageStyle}
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/e0f2f7/3498db?text=Error'; }} // Handle broken image links
                                        />
                                        <span style={modalProductNameStyle}>
                                            {item.product?.name || 'Unknown Product'} x {item.quantity}
                                        </span>
                                        <span style={modalProductPriceStyle}>
                                            ${(item.priceAtOrder || 0).toFixed(2)}
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
                                <button onClick={() => setIsViewModalOpen(false)} style={closeModalButtonStyle}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
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
export default AdminOrderManagement;
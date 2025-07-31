// client/src/pages/admin/AdminCustomerManagement.js
import React, { useState, useEffect } from 'react';
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

const AdminCustomerManagement = () => {
    const { authAxios, user, impersonate } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8; // Optimized for card layout

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

    // --- Fetch Customers ---
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await authAxios.get('/users', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        search: searchQuery,
                        role: 'customer'
                    }
                });
                const allUsers = res.data;
                const filteredCustomers = allUsers.filter(u => u.role === 'customer');

                setCustomers(filteredCustomers);
                setTotalPages(Math.ceil(filteredCustomers.length / itemsPerPage));

            } catch (err) {
                console.error('Failed to retrieve customers:', err);
                setError('Failed to retrieve customers. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [authAxios, currentPage, searchQuery, itemsPerPage]);

    // --- Handlers for Customer Actions ---

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer({ ...customer });
        setIsEditModalOpen(true);
        setError('');
        setSuccessMessage('');
    };

    const handleEditModalChange = (e) => {
        const { name, value } = e.target;
        setSelectedCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            if (!selectedCustomer) return;

            const res = await authAxios.put(`/users/${selectedCustomer._id}`, {
                firstName: selectedCustomer.firstName,
                lastName: selectedCustomer.lastName,
                email: selectedCustomer.email,
            });
            setCustomers(prev => prev.map(cust => cust._id === res.data._id ? res.data : cust));
            setIsEditModalOpen(false);
            showMessageBox('Customer details updated successfully!', 'success');
        } catch (err) {
            console.error('Failed to update customer:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to update customer. Please try again.');
        }
    };

    const handleToggleStatus = async (customerId, currentStatus) => {
        showConfirmBox(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this customer?`, async () => {
            try {
                setError('');
                setSuccessMessage('');
                await authAxios.put(`/users/${customerId}/status`, { isActive: !currentStatus });
                setCustomers(prev => prev.map(cust =>
                    cust._id === customerId ? { ...cust, isActive: !currentStatus } : cust
                ));
                showMessageBox(`Customer ${currentStatus ? 'deactivated' : 'activated'} successfully!`, 'success');
            } catch (err) {
                console.error('Failed to alter customer status:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Failed to alter customer status. Please try again.');
            }
        });
    };

    const handleDeleteCustomer = async (customerId) => {
        showConfirmBox('Are you absolutely certain you want to permanently delete this customer? This action cannot be reversed.', async () => {
            try {
                setError('');
                setSuccessMessage('');
                await authAxios.delete(`/users/${customerId}`);
                setCustomers(prev => prev.filter(cust => cust._id !== customerId));
                showMessageBox('Customer deleted successfully!', 'success');
            } catch (err) {
                console.error('Failed to delete customer:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Failed to delete customer. Please try again.');
            }
        });
    };

    const handleImpersonate = async (customerId) => {
        if (user?.role === 'admin') {
            showConfirmBox('Are you sure you want to impersonate this customer? You will be logged in as them.', async () => {
                try {
                    setError('');
                    setSuccessMessage('');
                    const success = await impersonate(customerId);
                    if (success) {
                        showMessageBox('Impersonation successful! Redirecting to customer view.', 'success', () => {
                            window.location.href = '/'; // Force full page reload to ensure all state is reset
                        });
                    } else {
                        setError('Impersonation failed.');
                    }
                } catch (err) {
                    console.error('Impersonation failed:', err);
                    setError(err.response?.data?.message || 'Impersonation failed. Please try again.');
                }
            });
        } else {
            showMessageBox('You do not have permission to impersonate users.', 'error');
        }
    };

    // --- Inline Styles for Professional UI ---
    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.lightGrey,
        fontFamily: 'Inter, sans-serif', // Professional font
        color: colors.darkText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '40px',
        backgroundColor: colors.white,
        borderRadius: '0 0 12px 12px',
        boxShadow: `0 8px 25px ${colors.shadowSubtle}`,
        margin: '0 30px 30px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeInUp 0.6s ease-out',
        boxSizing: 'border-box',
    };

    const headerContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: `2px solid ${colors.borderLight}`,
    };

    const pageTitleStyle = {
        color: colors.primaryBlue,
        fontFamily: 'Inter, sans-serif',
        fontSize: '2.8em',
        fontWeight: '700',
        margin: '0 0 20px 0',
        letterSpacing: '0.5px',
        textAlign: 'center',
    };

    const searchContainerStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
    };

    const searchInputStyle = {
        padding: '12px 18px 12px 45px',
        width: 'calc(100% - 63px)', // Adjusted for padding and icon
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '8px',
        fontSize: '1em',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: colors.lightGrey,
        color: colors.darkText,
        // Pseudo-classes like :focus and ::placeholder are not directly supported in inline styles.
        // For these, you'd typically use a CSS file or a CSS-in-JS library.
    };

    const searchIconStyle = {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: colors.mediumText,
        fontSize: '1.1em',
    };

    const errorMessageStyle = {
        color: colors.errorRed,
        textAlign: 'center',
        fontSize: '1em',
        fontWeight: 'bold',
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

    const successMessageStyle = {
        color: colors.successGreen,
        textAlign: 'center',
        fontSize: '1em',
        fontWeight: 'bold',
        padding: '12px',
        backgroundColor: `${colors.successGreen}1A`, // Light tint of green
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
    };

    const noCustomersMessageStyle = {
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

    const resetSearchButtonStyle = {
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
        boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effects need JS state
    };

    // --- Customer Card Grid Styles ---
    const customerGridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Adjusted min-width for more compact cards
        gap: '25px', // Slightly less gap
        width: '100%',
        maxWidth: '1200px',
        padding: '20px 0',
        justifyContent: 'center',
    };

    const customerCardStyle = {
        backgroundColor: colors.white,
        borderRadius: '8px',
        boxShadow: `0 4px 15px ${colors.shadowSubtle}`,
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid ${colors.borderLight}`,
        // Hover effects need JS state
    };

    const cardHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        width: '100%',
        borderBottom: `1px solid ${colors.borderLight}`, // Solid, clean separator
        paddingBottom: '12px',
    };

    const avatarStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5em',
        fontWeight: 'bold',
        marginRight: '12px',
        boxShadow: `0 2px 8px ${colors.shadowSubtle}`,
    };

    const customerNameStyle = {
        fontSize: '1.5em',
        color: colors.darkText,
        margin: 0,
        fontWeight: '600',
    };

    const customerDetailStyle = {
        fontSize: '0.95em',
        color: colors.mediumText,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
    };

    const detailIconStyle = {
        marginRight: '8px',
        color: colors.secondaryGrey,
        fontSize: '1em',
    };

    const cardActionsStyle = {
        marginTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px', // Smaller gap for more buttons
        width: '100%',
        justifyContent: 'center',
    };

    const cardActionButtonStyle = {
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        color: colors.white,
        cursor: 'pointer',
        fontSize: '0.85em',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: `0 2px 5px ${colors.shadowSubtle}`,
        // Hover effects need JS state
    };

    // --- Pagination Styles ---
    const paginationContainerStyle = {
        marginTop: '30px',
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
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.95em',
        transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        // Hover effects need JS state
    };

    // --- Modal Styles ---
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Standard overlay
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
        maxWidth: '600px',
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
        paddingBottom: '15px',
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

    const formGroupStyle = {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
    };

    const modalLabelStyle = {
        marginBottom: '8px',
        fontWeight: '600',
        color: colors.darkText,
        fontSize: '0.9em',
    };

    const modalInputStyle = {
        padding: '10px',
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '5px',
        fontSize: '0.95em',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: colors.lightGrey,
        color: colors.darkText,
        // Focus effect needs JS state
    };

    const modalActionsStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '30px',
        gap: '15px',
    };

    const modalCancelButtonStyle = {
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
        // Hover effect needs JS state
    };

    const modalSaveButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
        fontFamily: 'Inter, sans-serif',
        // Hover effect needs JS state
    };

    return (
        <div style={pageContainerStyle}>
            <AdminNav />
            <div style={contentAreaStyle}>
                <div style={headerContainerStyle}>
                    <h2 style={pageTitleStyle}>Customer Management</h2>
                    <div style={searchContainerStyle}>
                        <input
                            type="text"
                            placeholder="Search customers by email..."
                            value={searchQuery}
                            onChange={handleSearchChange}
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
                        <p style={{ color: colors.mediumText, marginTop: '15px', fontFamily: 'Inter, sans-serif' }}>Loading customers...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div style={noCustomersMessageStyle}>
                        <p>No customers found matching your criteria.</p>
                        <button onClick={() => setSearchQuery('')} style={resetSearchButtonStyle}>Reset Search</button>
                    </div>
                ) : (
                    <>
                        <div style={customerGridContainerStyle}>
                            {customers.map(customer => (
                                <div key={customer._id} style={customerCardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <div style={avatarStyle}>
                                            {customer.firstName ? customer.firstName.charAt(0).toUpperCase() : '?'}{customer.lastName ? customer.lastName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <h4 style={customerNameStyle}>{customer.firstName} {customer.lastName}</h4>
                                    </div>
                                    <p style={customerDetailStyle}><i className="fas fa-envelope" style={detailIconStyle}></i> {customer.email}</p>
                                    <p style={customerDetailStyle}>
                                        <i className="fas fa-circle" style={{ ...detailIconStyle, color: customer.isActive ? colors.successGreen : colors.errorRed }}></i>
                                        Status: <span style={{ fontWeight: 'bold', color: customer.isActive ? colors.darkText : colors.errorRed }}>
                                            {customer.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                    <div style={cardActionsStyle}>
                                        <button
                                            onClick={() => handleEditClick(customer)}
                                            style={{ ...cardActionButtonStyle, backgroundColor: colors.buttonPrimary }}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(customer._id, customer.isActive)}
                                            style={{ ...cardActionButtonStyle, backgroundColor: customer.isActive ? colors.buttonWarning : colors.buttonSuccess }}
                                        >
                                            <i className={`fas ${customer.isActive ? 'fa-user-slash' : 'fa-user-check'}`}></i> {customer.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => handleImpersonate(customer._id)}
                                                style={{ ...cardActionButtonStyle, backgroundColor: colors.buttonInfo }}
                                            >
                                                <i className="fas fa-mask"></i> Impersonate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteCustomer(customer._id)}
                                            style={{ ...cardActionButtonStyle, backgroundColor: colors.buttonDanger }}
                                        >
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
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

                {/* --- Edit Customer Modal --- */}
                {isEditModalOpen && selectedCustomer && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3 style={modalTitleStyle}>Edit Customer: {selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                            {error && <p style={modalErrorMessageStyle}>{error}</p>}
                            <form onSubmit={handleUpdateCustomer}>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>First Name:</label>
                                    <input type="text" name="firstName" value={selectedCustomer.firstName} onChange={handleEditModalChange} required style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Last Name:</label>
                                    <input type="text" name="lastName" value={selectedCustomer.lastName} onChange={handleEditModalChange} required style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Email:</label>
                                    <input type="email" name="email" value={selectedCustomer.email} onChange={handleEditModalChange} required style={modalInputStyle} />
                                </div>
                                <div style={modalActionsStyle}>
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} style={modalCancelButtonStyle}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={modalSaveButtonStyle}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Keyframes for animations (ensure these are in your client/src/index.css or a global style file)
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
export default AdminCustomerManagement;
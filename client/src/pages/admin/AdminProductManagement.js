// client/src/pages/admin/AdminProductManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { useAuth } from '../../context/AuthContext'; // Corrected path for AuthContext

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
    buttonSuccess: '#28a745',      // Success button green
};

const AdminProductManagement = () => {
    const { authAxios } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Modal
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', stockQuantity: '', imageUrl: '' });
    const [editedProduct, setEditedProduct] = useState(null); // State to hold product being edited

    // --- Custom Message Box Functions ---
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

    // --- Function to fetch products (wrapped in useCallback) ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await authAxios.get('/products');
            setProducts(res.data.products || res.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [authAxios]); // fetchProducts only depends on authAxios

    // --- Effect to call fetchProducts on component mount (runs only once) ---
    useEffect(() => {
        fetchProducts(); // Call on mount
    }, [fetchProducts]); // Added fetchProducts to dependency array because it's a useCallback

    // --- Handlers for Add Product Modal ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Ensure price and stockQuantity are numbers
        setNewProduct(prev => ({
            ...prev,
            [name]: (name === 'price' || name === 'stockQuantity') ? parseFloat(value) : value
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Basic validation
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || newProduct.stockQuantity === '') {
            setError('All fields are required.');
            return;
        }
        if (newProduct.price < 0 || newProduct.stockQuantity < 0) {
            setError('Price and Stock Quantity cannot be negative.');
            return;
        }

        try {
            await authAxios.post('/products', newProduct);
            setNewProduct({ name: '', description: '', price: '', category: '', stockQuantity: '', imageUrl: '' }); // Reset form
            setIsAddModalOpen(false);
            showMessageBox('Product added successfully!', 'success', fetchProducts); // Re-fetch products after successful add
        } catch (err) {
            console.error('Failed to add product:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to add product. Please check your input.');
        }
    };

    // --- Handlers for Edit Product Modal ---
    const handleEditClick = (product) => {
        setEditedProduct({ ...product }); // Set the product to be edited
        setIsEditModalOpen(true); // Open the edit modal
        setError(''); // Clear any previous errors
        setSuccessMessage(''); // Clear any previous success messages
    };

    const handleEditModalChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({
            ...prev,
            [name]: (name === 'price' || name === 'stockQuantity') ? parseFloat(value) : value
        }));
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!editedProduct.name || !editedProduct.description || !editedProduct.price || !editedProduct.category || editedProduct.stockQuantity === '') {
            setError('All fields are required.');
            return;
        }
        if (editedProduct.price < 0 || editedProduct.stockQuantity < 0) {
            setError('Price and Stock Quantity cannot be negative.');
            return;
        }

        try {
            // Send PUT request to update the product
            await authAxios.put(`/products/${editedProduct._id}`, editedProduct);
            setIsEditModalOpen(false); // Close the modal
            showMessageBox('Product updated successfully!', 'success', fetchProducts); // Re-fetch products after successful update
        } catch (err) {
            console.error('Failed to update product:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to update product. Please check your input.');
        }
    };

    const handleDelete = async (productId) => {
        showConfirmBox(`Are you sure you want to delete product with ID: ${productId}?`, async () => {
            try {
                await authAxios.delete(`/products/${productId}`);
                showMessageBox('Product deleted successfully!', 'success', fetchProducts); // Re-fetch after delete
            } catch (err) {
                console.error('Failed to delete product:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Failed to delete product.');
            }
        });
    };

    return (
        <div style={pageContainerStyle}>
            <AdminNav />
            <div style={contentAreaStyle}>
                <div style={headerContainerStyle}>
                    <h2 style={pageTitleStyle}>Product Management</h2>
                    <button
                        onClick={() => { setIsAddModalOpen(true); setError(''); setSuccessMessage(''); }} // Clear messages on open
                        style={addNewProductButtonStyle}
                    >
                        <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i> Add New Product
                    </button>
                </div>

                {error && <p style={errorMessageStyle}>{error}</p>}
                {successMessage && <p style={successMessageStyle}>{successMessage}</p>}

                {loading ? (
                    <div style={loadingContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.mediumText, marginTop: '15px' }}>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={noProductsMessageStyle}>
                        <p>No products found. Click "Add New Product" to get started!</p>
                    </div>
                ) : (
                    <div style={tableContainerStyle}>
                        <table style={productsTableStyle}>
                            <thead>
                                <tr style={tableHeaderRowStyle}>
                                    <th style={tableHeaderCellStyle}>Image</th>
                                    <th style={tableHeaderCellStyle}>Name</th>
                                    <th style={tableHeaderCellStyle}>Category</th>
                                    <th style={tableHeaderCellStyle}>Price</th>
                                    <th style={tableHeaderCellStyle}>Stock</th>
                                    <th style={tableHeaderCellStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id} style={tableRowStyle}>
                                        <td style={tableImageCellStyle}>
                                            <img
                                                src={product.imageUrl || 'https://placehold.co/60x60/e0f2f7/3498db?text=Prod'}
                                                alt={product.name}
                                                style={productImageThumbnailStyle}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/e0f2f7/3498db?text=Error'; }} // Handle broken image links
                                            />
                                        </td>
                                        <td style={tableCellStyle}>{product.name}</td>
                                        <td style={tableCellStyle}>{product.category}</td>
                                        <td style={tableCellStyle}>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                                        <td style={tableCellStyle}>{product.stockQuantity}</td>
                                        <td style={tableActionCellStyle}>
                                            <button
                                                onClick={() => handleEditClick(product)}
                                                style={{ ...actionButtonStyle, backgroundColor: colors.buttonPrimary }}
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
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
                )}

                {/* --- Add Product Modal --- */}
                {isAddModalOpen && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3 style={modalTitleStyle}>Add New Product</h3>
                            {error && <p style={modalErrorMessageStyle}>{error}</p>}
                            <form onSubmit={handleAddProduct}>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Name:</label>
                                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Description:</label>
                                    <textarea name="description" value={newProduct.description} onChange={handleInputChange} required style={{ ...modalInputStyle, minHeight: '80px' }}></textarea>
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Price:</label>
                                    <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} required min="0" step="0.01" style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Category:</label>
                                    <input type="text" name="category" value={newProduct.category} onChange={handleInputChange} required style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Stock Quantity:</label>
                                    <input type="number" name="stockQuantity" value={newProduct.stockQuantity} onChange={handleInputChange} required min="0" style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Image URL (Optional):</label>
                                    <input type="text" name="imageUrl" value={newProduct.imageUrl} onChange={handleInputChange} style={modalInputStyle} placeholder="e.g., https://example.com/product.jpg" />
                                </div>
                                <div style={modalActionsStyle}>
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} style={modalCancelButtonStyle}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={modalSaveButtonStyle}> {/* Using modalSaveButtonStyle */}
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- Edit Product Modal --- */}
                {isEditModalOpen && editedProduct && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3 style={modalTitleStyle}>Edit Product</h3>
                            {error && <p style={modalErrorMessageStyle}>{error}</p>}
                            <form onSubmit={handleUpdateProduct}>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Name:</label>
                                    <input type="text" name="name" value={editedProduct.name} onChange={handleEditModalChange} required style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Description:</label>
                                    <textarea name="description" value={editedProduct.description} onChange={handleEditModalChange} required style={{ ...modalInputStyle, minHeight: '80px' }}></textarea>
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Price:</label>
                                    <input type="number" name="price" value={editedProduct.price} onChange={handleEditModalChange} required min="0" step="0.01" style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Category:</label>
                                    <input type="text" name="category" value={editedProduct.category} onChange={handleEditModalChange} required style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Stock Quantity:</label>
                                    <input type="number" name="stockQuantity" value={editedProduct.stockQuantity} onChange={handleEditModalChange} required min="0" style={modalInputStyle} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={modalLabelStyle}>Image URL (Optional):</label>
                                    <input type="text" name="imageUrl" value={editedProduct.imageUrl} onChange={handleEditModalChange} style={modalInputStyle} placeholder="e.g., https://example.com/product.jpg" />
                                </div>
                                <div style={modalActionsStyle}>
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} style={modalCancelButtonStyle}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={modalSaveButtonStyle}> {/* Using modalSaveButtonStyle */}
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

// --- Inline Styles for Professional UI and Animations ---
const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column', // Added for consistent top nav layout
    minHeight: '100vh',
    backgroundColor: colors.lightGrey, // Light background for the whole page
    fontFamily: 'Inter, sans-serif', // Consistent font
    color: colors.darkText,
};

const contentAreaStyle = {
    flex: 1,
    padding: '40px',
    backgroundColor: colors.white, // White background for the main content area
    borderRadius: '0 0 12px 12px', // Rounded bottom corners, consistent with other pages
    boxShadow: `0 5px 20px ${colors.shadowSubtle}`, // Subtle shadow
    margin: '0 30px 30px 30px', // Adjusted margin for top nav
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    animation: 'fadeInUp 0.6s ease-out', // Fade in animation for the content area
    boxSizing: 'border-box',
};

const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    marginBottom: '40px',
    paddingBottom: '15px',
    borderBottom: `1px solid ${colors.borderLight}`, // Clean separator
};

const pageTitleStyle = {
    color: colors.primaryBlue, // Darker title color
    fontSize: '2.8em', // Adjusted for consistency
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px', // Adjusted for consistency
};

const addNewProductButtonStyle = {
    padding: '12px 25px',
    backgroundColor: colors.buttonSuccess, // Green for Add
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Inter, sans-serif',
    // Hover effects would need JS state
};

const errorMessageStyle = {
    color: colors.errorRed,
    textAlign: 'center',
    fontSize: '1em', // Adjusted for consistency
    fontWeight: '600', // Adjusted for consistency
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
    fontSize: '1em', // Adjusted for consistency
    fontWeight: '600', // Adjusted for consistency
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

const noProductsMessageStyle = {
    textAlign: 'center',
    fontSize: '1.2em', // Adjusted for consistency
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

const tableContainerStyle = {
    width: '100%',
    maxWidth: '1200px',
    overflowX: 'auto',
    boxShadow: `0 4px 15px ${colors.shadowSubtle}`,
    borderRadius: '10px',
    backgroundColor: colors.white,
    marginBottom: '40px',
    border: `1px solid ${colors.borderLight}`, // Added border for consistency
};

const productsTableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '10px',
    overflow: 'hidden',
};

const tableHeaderRowStyle = {
    backgroundColor: colors.lightGrey,
    color: colors.darkText,
    fontSize: '0.95em', // Adjusted for consistency
    fontWeight: '600',
    textTransform: 'uppercase',
};

const tableHeaderCellStyle = {
    padding: '15px 20px', // Adjusted for consistency
    textAlign: 'left',
    borderBottom: `1px solid ${colors.borderLight}`,
};

const tableRowStyle = {
    borderBottom: `1px solid ${colors.borderLight}`, // Adjusted for consistency
    transition: 'background-color 0.2s ease',
    // Hover effect would need JS state
};

const tableImageCellStyle = {
    padding: '12px 15px',
    borderBottom: `1px solid ${colors.borderLight}`,
    width: '80px', // Fixed width for image column
};

const productImageThumbnailStyle = {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: `1px solid ${colors.borderLight}`,
};

const tableCellStyle = {
    padding: '12px 15px',
    borderBottom: `1px solid ${colors.borderLight}`,
    color: colors.darkText,
};

const tableActionCellStyle = {
    padding: '12px 15px',
    borderBottom: `1px solid ${colors.borderLight}`,
    whiteSpace: 'nowrap', // Prevent buttons from wrapping
    display: 'flex', // Use flex for button alignment
    gap: '8px', // Space between buttons
    alignItems: 'center',
};

const actionButtonStyle = {
    padding: '8px 12px', // Adjusted for consistency
    borderRadius: '5px',
    border: 'none',
    color: colors.white,
    cursor: 'pointer',
    fontSize: '0.85em', // Adjusted for consistency
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: `0 2px 5px ${colors.shadowSubtle}`,
    fontFamily: 'Inter, sans-serif',
    // Hover effects would need JS state
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
    borderRadius: '10px', // Adjusted for consistency
    boxShadow: `0 8px 30px ${colors.shadowMedium}`,
    width: '90%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'zoomIn 0.3s ease-out',
    fontFamily: 'Inter, sans-serif', // Consistent font
    border: `1px solid ${colors.borderLight}`, // Added border for consistency
};

const modalTitleStyle = {
    fontSize: '2em',
    color: colors.primaryBlue,
    marginBottom: '25px',
    fontWeight: '700',
    borderBottom: `1px solid ${colors.borderLight}`,
    paddingBottom: '10px',
    textAlign: 'center', // Centered for better presentation
};

const modalErrorMessageStyle = {
    color: colors.errorRed,
    textAlign: 'center',
    fontSize: '0.95em', // Adjusted for consistency
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
    fontSize: '0.9em', // Adjusted for consistency
};

const modalInputStyle = {
    padding: '10px', // Adjusted for consistency
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '5px', // Adjusted for consistency
    fontSize: '0.95em', // Adjusted for consistency
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    backgroundColor: colors.lightGrey, // Light background for inputs
    color: colors.darkText,
    // Focus effect would need JS state
};

const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
    gap: '15px',
};

const modalCancelButtonStyle = {
    padding: '10px 20px', // Adjusted for consistency
    backgroundColor: colors.secondaryGrey,
    color: colors.white,
    border: 'none',
    borderRadius: '5px', // Adjusted for consistency
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
    fontFamily: 'Inter, sans-serif',
    // Hover effect would need JS state
};

const modalSaveButtonStyle = { // Renamed from modalAddButtonStyle for clarity in modals
    padding: '10px 20px', // Adjusted for consistency
    backgroundColor: colors.primaryBlue, // Primary blue for save actions
    color: colors.white,
    border: 'none',
    borderRadius: '5px', // Adjusted for consistency
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: `0 4px 10px ${colors.shadowSubtle}`,
    fontFamily: 'Inter, sans-serif',
    // Hover effect would need JS state
};

// Keyframes for animations (ensure these are in your client/src/index.css)
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

export default AdminProductManagement;
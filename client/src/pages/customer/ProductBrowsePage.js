// client/src/pages/customer/ProductBrowsePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerNav from '../../components/customer/CustomerNav';
import { useNavigate } from 'react-router-dom';

// --- Simple UI Color Palette ---
const colors = {
    background: '#F8F8F8',        // Very light grey page background
    cardBackground: '#FFFFFF',     // White for main content and cards
    primaryText: '#333333',        // Dark grey for main text
    secondaryText: '#666666',      // Medium grey for secondary text
    border: '#EEEEEE',             // Light grey for borders and separators
    accentBlue: '#007BFF',         // Standard blue for links and actions
    successGreen: '#28A745',       // Green for success messages/buttons
    errorRed: '#DC3545',           // Red for error messages/buttons
    warningOrange: '#FFC107',      // Orange for pending/warning status
    starYellow: '#FFD700',         // Gold for stars
};

const ProductBrowsePage = () => {
    const { authAxios } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [combinedSort, setCombinedSort] = useState('createdAt-desc');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModalImage, setCurrentModalImage] = useState('');

    const categories = [
        'All', 'Laptops', 'PCs', 'Mobile Phones', 'Tablets', 'Smartwatches', 'Drones', 'Cameras',
        'Networking', 'Storage', 'Peripherals', 'Gadgets', 'Accessories', 'Circuit Boards', 'Smart Home'
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');

            const [sortBy, sortOrder] = combinedSort.split('-');
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery,
                sortBy: sortBy,
                order: sortOrder,
            };

            if (selectedCategory !== 'All') {
                params.category = selectedCategory;
            }

            try {
                const res = await authAxios.get(`/products`, { params });
                setProducts(res.data.products);
                setTotalPages(res.data.pages);
            } catch (err) {
                setError('Failed to fetch products. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [authAxios, currentPage, searchQuery, combinedSort, selectedCategory]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleCombinedSortChange = (e) => {
        setCombinedSort(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const openProductModal = (product) => {
        setSelectedProduct(product);
        const images = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);
        setCurrentModalImage(images.length > 0 ? images[0] : 'https://placehold.co/400x300/EEEEEE/333333?text=Product');
        setIsModalOpen(true);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
        setCurrentModalImage('');
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item._id === product._id);

        if (existingItemIndex > -1) {
            if (cart[existingItemIndex].quantity < product.stockQuantity) {
                cart[existingItemIndex].quantity += 1;
                showMessageBox(`${product.name} quantity updated in cart!`, 'success');
            } else {
                showMessageBox(`Cannot add more ${product.name}. Maximum stock reached.`, 'error');
                return;
            }
        } else {
            if (product.stockQuantity > 0) {
                cart.push({ ...product, quantity: 1 });
                showMessageBox(`${product.name} added to cart!`, 'success');
            } else {
                showMessageBox(`${product.name} is out of stock.`, 'error');
                return;
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Current Cart:', cart);
    };

    const buyNow = (product) => {
        const newCart = [{ ...product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(newCart));
        showMessageBox(`Proceeding to checkout with ${product.name}.`, 'info', () => {
            navigate('/checkout');
        });
    };

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
            border: 1px solid ${type === 'error' ? colors.errorRed : (type === 'success' ? colors.successGreen : colors.accentBlue)};
        `;
        messageBox.innerHTML = `
            <p style="font-size: 1em; margin-bottom: 15px; color: ${colors.primaryText};">${message}</p>
            <button id="msgBoxConfirmBtn" style="
                padding: 8px 15px;
                background-color: ${type === 'error' ? colors.errorRed : (type === 'success' ? colors.successGreen : colors.accentBlue)};
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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={i <= rating ? 'fas fa-star' : (i - 0.5 <= rating ? 'fas fa-star-half-alt' : 'far fa-star')}
                    style={starStyle(i <= rating)}
                ></i>
            );
        }
        return stars;
    };

    // --- Inline Styles for Simple UI ---
    const pageContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.background,
        fontFamily: 'Inter, sans-serif',
        color: colors.primaryText,
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '20px',
        backgroundColor: colors.cardBackground,
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

    const controlsContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '1000px',
        padding: '10px',
        backgroundColor: colors.background,
        borderRadius: '5px',
        border: `1px solid ${colors.border}`,
    };

    const searchInputStyle = {
        padding: '10px 12px',
        width: '250px',
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        fontSize: '0.9em',
        boxSizing: 'border-box',
    };

    const sortFilterGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: colors.primaryText,
        fontSize: '0.9em',
    };

    const selectStyle = {
        padding: '8px 10px',
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        fontSize: '0.9em',
        backgroundColor: colors.white,
        cursor: 'pointer',
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

    const spinnerStyle = {
        border: `6px solid ${colors.border}`,
        borderTop: `6px solid ${colors.accentBlue}`,
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    };

    const noProductsMessageStyle = {
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

    const resetFilterButtonStyle = {
        padding: '10px 20px',
        backgroundColor: colors.secondaryText,
        color: colors.white,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: 'bold',
        marginTop: '15px',
    };

    const productGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Adjusted for simpler cards
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '30px',
    };

    const productCardStyle = {
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: colors.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
    };

    const productImageStyle = {
        width: '100%',
        height: '180px', // Slightly smaller image height
        objectFit: 'cover',
        borderBottom: `1px solid ${colors.border}`,
        borderRadius: '8px 8px 0 0',
    };

    const productCardContentStyle = {
        padding: '15px', // Reduced padding
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    };

    const productNameStyle = {
        margin: '0 0 8px 0',
        fontSize: '1.2em', // Reduced font size
        color: colors.primaryText,
        fontWeight: 'bold',
        lineHeight: '1.3',
    };

    const productPriceStyle = {
        fontWeight: 'bold',
        fontSize: '1.1em', // Reduced font size
        color: colors.accentBlue,
        marginBottom: '8px',
    };

    const productStockStyle = {
        fontSize: '0.85em',
        marginBottom: '15px',
        fontWeight: 'normal',
    };

    const cardButtonContainerStyle = {
        display: 'flex',
        gap: '8px', // Reduced gap
        marginTop: 'auto',
    };

    const addToCartButtonStyle = {
        padding: '10px 12px', // Reduced padding
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: 'bold',
        flex: 1,
    };

    const buyNowButtonStyle = {
        padding: '10px 12px',
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: 'bold',
        flex: 1,
    };

    const paginationContainerStyle = {
        marginTop: '20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
    };

    const paginationButtonStyle = {
        padding: '10px 15px',
        margin: '0 3px',
        border: `1px solid ${colors.border}`,
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        backgroundColor: colors.background,
        color: colors.primaryText,
        // No hover effect for extreme simplicity
    };

    // --- Styles for Product Detail Modal (Simple) ---
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
    };

    const modalContentStyle = {
        backgroundColor: colors.white,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    };

    const closeModalButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '1.8em',
        color: colors.secondaryText,
        cursor: 'pointer',
    };

    const modalProductDetailGridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr', // Stack on small screens
        gap: '15px',
        marginBottom: '15px',
        '@media (min-width: 768px)': {
            gridTemplateColumns: '1fr 1.2fr', // Image slightly wider than info
        },
    };

    const modalImageGalleryStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    };

    const modalMainImageStyle = {
        width: '100%',
        height: 'auto',
        maxHeight: '300px',
        objectFit: 'contain',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
    };

    const modalThumbnailContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '8px',
    };

    const modalThumbnailImageStyle = {
        width: '60px', // Reduced thumbnail size
        height: '60px',
        objectFit: 'cover',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
        // No hover effect for simplicity
    };

    const modalProductInfoStyle = {
        display: 'flex',
        flexDirection: 'column',
    };

    const modalProductNameStyle = {
        fontSize: '1.8em', // Reduced font size
        fontWeight: 'bold',
        color: colors.primaryText,
        marginBottom: '6px',
        lineHeight: '1.2',
    };

    const modalProductDescriptionStyle = {
        fontSize: '0.9em',
        color: colors.secondaryText,
        marginBottom: '10px',
        lineHeight: '1.5',
    };

    const modalProductPriceStyle = {
        fontSize: '1.5em', // Reduced font size
        fontWeight: 'bold',
        color: colors.accentBlue,
        marginBottom: '8px',
    };

    const modalProductStockStyle = {
        fontSize: '0.9em',
        fontWeight: 'normal',
        marginBottom: '10px',
    };

    const modalRatingStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        color: colors.starYellow,
        fontSize: '1em',
    };

    const modalRatingStarsStyle = {
        marginRight: '5px',
    };

    const modalNumReviewsStyle = {
        fontSize: '0.8em',
        color: colors.secondaryText,
        fontWeight: 'normal',
    };

    const modalOffersStyle = {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: colors.background,
        border: `1px dashed ${colors.border}`,
        borderRadius: '5px',
    };

    const modalSectionHeaderStyle = {
        fontSize: '1.1em', // Reduced font size
        color: colors.primaryText,
        marginBottom: '8px',
        fontWeight: 'bold',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '5px',
    };

    const modalOfferListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const modalOfferItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px',
        fontSize: '0.9em',
        color: colors.secondaryText,
    };

    const modalButtonContainerStyle = {
        display: 'flex',
        gap: '8px',
        marginTop: 'auto',
        width: '100%',
    };

    const modalAddToCartButtonStyle = {
        padding: '10px 12px',
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        flex: 1,
    };

    const modalBuyNowButtonStyle = {
        padding: '10px 12px',
        color: colors.white,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        flex: 1,
    };

    const modalReviewsSectionStyle = {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: `1px solid ${colors.border}`,
    };

    const modalReviewItemStyle = {
        backgroundColor: colors.background,
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '8px',
        border: `1px solid ${colors.border}`,
    };

    const modalReviewHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
        fontSize: '0.9em',
        fontWeight: 'bold',
        color: colors.primaryText,
    };

    const modalReviewStarsStyle = {
        color: colors.starYellow,
        fontSize: '0.8em',
    };

    const modalReviewCommentStyle = {
        fontSize: '0.85em',
        color: colors.secondaryText,
        lineHeight: '1.4',
    };

    const cardRatingStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        color: colors.starYellow,
        fontSize: '0.9em',
    };

    const starStyle = (filled) => ({
        marginRight: '2px',
        color: filled ? colors.starYellow : colors.border,
    });

    const cardReviewCountStyle = {
        fontSize: '0.75em',
        color: colors.secondaryText,
        fontWeight: 'normal',
        marginLeft: '5px',
    };

    return (
        <div style={pageContainerStyle}>
            <CustomerNav />
            <div style={contentAreaStyle}>
                <h2 style={pageTitleStyle}>Explore Our Products</h2>
                <p style={pageDescriptionStyle}>Discover high-quality items for all your needs.</p>

                <div style={controlsContainerStyle}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={searchInputStyle}
                    />
                    <div style={sortFilterGroupStyle}>
                        <label htmlFor="combinedSort" style={labelStyle}>Sort by:</label>
                        <select id="combinedSort" value={combinedSort} onChange={handleCombinedSortChange} style={selectStyle}>
                            <option value="createdAt-desc">Newest Arrivals</option>
                            <option value="createdAt-asc">Oldest Arrivals</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                            <option value="stockQuantity-desc">In Stock First</option>
                        </select>
                    </div>
                    <div style={sortFilterGroupStyle}>
                        <label htmlFor="categoryFilter" style={labelStyle}>Category:</label>
                        <select id="categoryFilter" value={selectedCategory} onChange={handleCategoryChange} style={selectStyle}>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <p style={errorMessageStyle}>{error}</p>}

                {loading ? (
                    <div style={loadingContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.secondaryText, marginTop: '15px' }}>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={noProductsMessageStyle}>
                        <p>No products found matching your criteria.</p>
                        <button onClick={() => { setSearchQuery(''); setCombinedSort('createdAt-desc'); setSelectedCategory('All'); setCurrentPage(1); }} style={resetFilterButtonStyle}>Reset Filters</button>
                    </div>
                ) : (
                    <>
                        <div style={productGridStyle}>
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    style={productCardStyle}
                                >
                                    <img
                                        src={product.imageUrl || 'https://placehold.co/400x300/EEEEEE/333333?text=Product'}
                                        alt={product.name}
                                        style={productImageStyle}
                                        onClick={() => openProductModal(product)}
                                    />
                                    <div style={productCardContentStyle}>
                                        <h3 style={productNameStyle} onClick={() => openProductModal(product)}>{product.name}</h3>
                                        <p style={productPriceStyle}>${product.price.toFixed(2)}</p>

                                        <div style={cardRatingStyle}>
                                            {renderStars(product.averageRating || 0)}
                                            <span style={cardReviewCountStyle}>({product.numReviews || 0})</span>
                                        </div>

                                        <p style={{ ...productStockStyle, color: product.stockQuantity > 0 ? colors.successGreen : colors.errorRed }}>
                                            {product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                                        </p>
                                        <div style={cardButtonContainerStyle}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                disabled={product.stockQuantity === 0}
                                                style={{ ...addToCartButtonStyle, backgroundColor: product.stockQuantity > 0 ? colors.successGreen : `${colors.successGreen}80` }}
                                            >
                                                {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); buyNow(product); }}
                                                disabled={product.stockQuantity === 0}
                                                style={{ ...buyNowButtonStyle, backgroundColor: product.stockQuantity > 0 ? colors.accentBlue : `${colors.accentBlue}80` }}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={paginationContainerStyle}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        ...paginationButtonStyle,
                                        backgroundColor: currentPage === page ? colors.accentBlue : colors.background,
                                        color: currentPage === page ? colors.white : colors.primaryText,
                                        fontWeight: currentPage === page ? 'bold' : 'normal',
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Product Details Modal */}
                {isModalOpen && selectedProduct && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <button onClick={closeProductModal} style={closeModalButtonStyle}>
                                &times;
                            </button>
                            <div style={modalProductDetailGridStyle}>
                                {/* Image Gallery */}
                                <div style={modalImageGalleryStyle}>
                                    <img src={currentModalImage} alt={selectedProduct.name} style={modalMainImageStyle} />
                                    {(selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0) || selectedProduct.imageUrl ? (
                                        <div style={modalThumbnailContainerStyle}>
                                            {/* Always show primary image as first thumbnail */}
                                            {selectedProduct.imageUrl && (
                                                <img
                                                    src={selectedProduct.imageUrl}
                                                    alt={`${selectedProduct.name} primary thumbnail`}
                                                    style={{
                                                        ...modalThumbnailImageStyle,
                                                        border: currentModalImage === selectedProduct.imageUrl ? `2px solid ${colors.accentBlue}` : `1px solid ${colors.border}`
                                                    }}
                                                    onClick={() => setCurrentModalImage(selectedProduct.imageUrl)}
                                                />
                                            )}
                                            {selectedProduct.additionalImages && selectedProduct.additionalImages.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`${selectedProduct.name} thumbnail ${idx + 1}`}
                                                    style={{
                                                        ...modalThumbnailImageStyle,
                                                        border: currentModalImage === img ? `2px solid ${colors.accentBlue}` : `1px solid ${colors.border}`
                                                    }}
                                                    onClick={() => setCurrentModalImage(img)}
                                                />
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                {/* Product Info */}
                                <div style={modalProductInfoStyle}>
                                    <h3 style={modalProductNameStyle}>{selectedProduct.name}</h3>
                                    <p style={modalProductDescriptionStyle}>{selectedProduct.description}</p>
                                    <p style={modalProductPriceStyle}>${selectedProduct.price.toFixed(2)}</p>
                                    <p style={{ ...modalProductStockStyle, color: selectedProduct.stockQuantity > 0 ? colors.successGreen : colors.errorRed }}>
                                        {selectedProduct.stockQuantity > 0 ? `In Stock: ${selectedProduct.stockQuantity}` : 'Out of Stock'}
                                    </p>

                                    {/* Ratings */}
                                    {selectedProduct.averageRating !== undefined && (
                                        <div style={modalRatingStyle}>
                                            <span style={modalRatingStarsStyle}>
                                                {renderStars(selectedProduct.averageRating || 0)}
                                            </span>
                                            <span style={modalNumReviewsStyle}>({selectedProduct.numReviews || 0} reviews)</span>
                                        </div>
                                    )}

                                    {/* Offers */}
                                    {selectedProduct.offers && selectedProduct.offers.length > 0 && (
                                        <div style={modalOffersStyle}>
                                            <h4 style={modalSectionHeaderStyle}>Special Offers:</h4>
                                            <ul style={modalOfferListStyle}>
                                                {selectedProduct.offers.map((offer, idx) => (
                                                    <li key={idx} style={modalOfferItemStyle}>
                                                        <i className="fas fa-tag" style={{ marginRight: '8px', color: colors.warningOrange }}></i>{offer}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div style={modalButtonContainerStyle}>
                                        <button
                                            onClick={() => { addToCart(selectedProduct); closeProductModal(); }}
                                            disabled={selectedProduct.stockQuantity === 0}
                                            style={{ ...modalAddToCartButtonStyle, backgroundColor: selectedProduct.stockQuantity > 0 ? colors.successGreen : `${colors.successGreen}80` }}
                                        >
                                            {selectedProduct.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                        <button
                                            onClick={() => { buyNow(selectedProduct); closeProductModal(); }}
                                            disabled={selectedProduct.stockQuantity === 0}
                                            style={{ ...modalBuyNowButtonStyle, backgroundColor: selectedProduct.stockQuantity > 0 ? colors.accentBlue : `${colors.accentBlue}80` }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Reviews Section */}
                            {selectedProduct.reviews && selectedProduct.reviews.length > 0 && (
                                <div style={modalReviewsSectionStyle}>
                                    <h4 style={modalSectionHeaderStyle}>Customer Reviews:</h4>
                                    {selectedProduct.reviews.map((review, idx) => (
                                        <div key={idx} style={modalReviewItemStyle}>
                                            <p style={modalReviewHeaderStyle}>
                                                <strong>{review.customerName}</strong>
                                                <span style={modalReviewStarsStyle}>
                                                    {renderStars(review.rating)}
                                                </span>
                                            </p>
                                            <p style={modalReviewCommentStyle}>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductBrowsePage;

// server/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); // Import User model to search by email

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/Customer (or Admin when impersonating)
const createOrder = async (req, res) => {
    const { orderItems, shippingAddress } = req.body;
    try {
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        let totalAmount = 0;
        const productsInOrder = [];

        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stockQuantity}` });
            }

            productsInOrder.push({
                product: product._id,
                quantity: item.quantity,
                priceAtOrder: product.price,
            });
            totalAmount += product.price * item.quantity;

            // Reduce stock quantity
            product.stockQuantity -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user._id, // User who is logged in (could be impersonated customer)
            products: productsInOrder,
            shippingAddress,
            totalAmount,
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get logged in user orders (customer)
// @route   GET /api/orders/myorders
// @access  Private/Customer
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price imageUrl') // Added imageUrl
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(orders);
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, customerEmail } = req.query;

        let filter = {}; // Initialize an empty filter object

        // Filter by status if provided and not 'All'
        if (status && status !== 'All') {
            filter.status = status;
        }

        // Filter by customer email if provided
        if (customerEmail) {
            // Find user by email to get their _id
            const user = await User.findOne({ email: { $regex: customerEmail, $options: 'i' } }); // Case-insensitive search
            if (user) {
                filter.user = user._id;
            } else {
                // If no user found with that email, return empty orders
                return res.json({
                    orders: [],
                    page: parseInt(page),
                    pages: 0,
                    totalOrders: 0,
                });
            }
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch orders with filtering and pagination
        const orders = await Order.find(filter)
            .populate('user', 'firstName lastName email')
            .populate('products.product', 'name price imageUrl') // Added imageUrl
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 }); // Sort by newest first

        // Get total count of orders matching the filter for pagination
        const count = await Order.countDocuments(filter);
        const totalPages = Math.ceil(count / parseInt(limit));

        res.json({
            orders,
            page: parseInt(page),
            pages: totalPages,
            totalOrders: count,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Admin or owner)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('products.product', 'name price imageUrl'); // Added imageUrl

        if (order) {
            // Check if current user is admin OR the owner of the order
            if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            order.updatedAt = Date.now();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(400).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Admin: Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Before deleting order, consider restoring product stock (optional, depends on business logic)
        for (const item of order.products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stockQuantity += item.quantity;
                await product.save();
            }
        }

        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};

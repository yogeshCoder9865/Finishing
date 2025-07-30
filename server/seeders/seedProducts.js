const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product'); // Ensure this path is correct to your Product model
const connectDB = require('../config/db'); // Ensure this path is correct to your DB connection utility

// Load environment variables from the .env file in the parent (server) directory
dotenv.config({ path: '../.env' });

// Connect to the database
connectDB();

// Helper function to generate random ratings and reviews
const generateRandomRating = () => parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)); // 3.0 to 5.0
const generateRandomReviews = (count) => {
    const reviews = [];
    const customerNames = ['Alice J.', 'Bob K.', 'Charlie L.', 'Diana M.', 'Eve N.', 'Frank O.', 'Grace P.', 'Henry Q.'];
    const comments = [
        'Absolutely love this product! Highly recommend.',
        'Great quality for the price. Very satisfied.',
        'Works as expected. No complaints.',
        'A solid purchase, performs well.',
        'Decent product, but could be improved.',
        'Not bad, but I had higher expectations.',
        'Very happy with this. Fast shipping too!',
        'Excellent value and features.',
        'Good product, easy to set up.',
        'Impressive performance, worth every penny.'
    ];

    for (let i = 0; i < count; i++) {
        reviews.push({
            customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
            rating: Math.floor(Math.random() * 3) + 3, // 3, 4, or 5 stars
            comment: comments[Math.floor(Math.random() * comments.length)],
        });
    }
    return reviews;
};

// Sample product data matching your ProductSchema
const sampleProducts = [
    // --- Laptops ---
    {
        name: 'Gaming Laptop Pro 15',
        description: 'Unleash ultimate gaming performance with Intel Core i9, RTX 4080, and 32GB RAM. 15.6" QHD 240Hz display.',
        price: 1899.99,
        stockQuantity: 25,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Gaming+Laptop',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Laptop+Side',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Laptop+Keyboard',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Laptop+Ports'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(3),
        offers: ['Free Gaming Headset', '10% off next purchase', 'Extended Warranty']
    },
    {
        name: 'UltraBook Air 13',
        description: 'Feather-light and powerful, perfect for on-the-go productivity. Intel Evo certified, 16GB RAM, 512GB SSD.',
        price: 1199.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=UltraBook',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/457b9d?text=UltraBook+Slim',
            'https://placehold.co/400x300/f1faee/457b9d?text=UltraBook+Open'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Free Carrying Sleeve', 'Student Discount Available']
    },
    {
        name: 'Budget Laptop 14',
        description: 'Reliable performance for daily tasks and online learning. AMD Ryzen 3, 8GB RAM, 256GB SSD.',
        price: 499.99,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Budget+Laptop',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Limited Time Offer']
    },
    {
        name: '2-in-1 Convertible Laptop',
        description: 'Versatile laptop that transforms into a tablet. Ideal for creative professionals and students.',
        price: 899.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/457b9d/f1faee?text=Convertible+Laptop',
        additionalImages: [
            'https://placehold.co/400x300/457b9d/f1faee?text=Tablet+Mode',
            'https://placehold.co/400x300/457b9d/f1faee?text=Tent+Mode'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(2),
        offers: ['Includes Stylus Pen']
    },

    // --- Desktops / PCs ---
    {
        name: 'High-End Gaming PC',
        description: 'Custom-built powerhouse for extreme gaming and content creation. Liquid-cooled, RGB case.',
        price: 2499.00,
        stockQuantity: 15,
        imageUrl: 'https://placehold.co/400x300/1d3557/a8dadc?text=Gaming+PC',
        additionalImages: [
            'https://placehold.co/400x300/1d3557/a8dadc?text=PC+Interior',
            'https://placehold.co/400x300/1d3557/a8dadc?text=PC+RGB'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 20) + 5,
        reviews: generateRandomReviews(2),
        offers: ['Free Gaming Mouse & Keyboard', 'Professional Assembly']
    },
    {
        name: 'Mini PC Home Office',
        description: 'Compact and energy-efficient mini PC, perfect for home office or media center. Intel NUC equivalent.',
        price: 399.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/457b9d/f1faee?text=Mini+PC',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 35) + 7,
        reviews: generateRandomReviews(1),
        offers: ['Compact Design']
    },
    {
        name: 'All-in-One Desktop 24"',
        description: 'Sleek 24-inch Full HD touchscreen desktop with integrated speakers and webcam. Perfect for families.',
        price: 799.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=AIO+Desktop',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=AIO+Side',
            'https://placehold.co/400x300/a8dadc/1d3557?text=AIO+Rear'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 6,
        reviews: generateRandomReviews(2),
        offers: ['Wireless Keyboard & Mouse Included']
    },

    // --- Mobile Phones ---
    {
        name: 'Flagship Smartphone X',
        description: 'Capture stunning photos with a 108MP camera, powered by the latest A17 Bionic chip. 5G ready.',
        price: 999.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/f1faee/e63946?text=Smartphone+X',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/e63946?text=Phone+Back',
            'https://placehold.co/400x300/f1faee/e63946?text=Phone+Camera'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 30,
        reviews: generateRandomReviews(4),
        offers: ['Free Case & Screen Protector', 'Trade-in Bonus']
    },
    {
        name: 'Mid-Range Android Phone',
        description: 'Great features at an affordable price. Long-lasting battery, vibrant display, and dual cameras.',
        price: 349.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Android+Phone',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Limited Stock']
    },

    // --- Tablets ---
    {
        name: 'Pro Tablet 11-inch',
        description: 'Powerful tablet for creativity and productivity. Liquid Retina display, M2 chip, Apple Pencil support.',
        price: 799.00,
        stockQuantity: 35,
        imageUrl: 'https://placehold.co/400x300/457b9d/f1faee?text=Pro+Tablet',
        additionalImages: [
            'https://placehold.co/400x300/457b9d/f1faee?text=Tablet+Side',
            'https://placehold.co/400x300/457b9d/f1faee?text=Tablet+Pen'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 45) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Optional Keyboard Case']
    },
    {
        name: 'Budget Android Tablet',
        description: 'Affordable tablet for entertainment and casual use. Great for kids and media consumption.',
        price: 199.00,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Android+Tablet',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 55) + 12,
        reviews: generateRandomReviews(1),
        offers: ['Bundle with Kids Case']
    },

    // --- Smartwatches / Wearables ---
    {
        name: 'Smartwatch Series 8',
        description: 'Advanced health features, always-on display, and cellular connectivity. Track your fitness and stay connected.',
        price: 399.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Smartwatch',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Watch+Face',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Watch+Side'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Free Extra Band']
    },
    {
        name: 'Fitness Tracker Pro',
        description: 'Monitor heart rate, steps, sleep, and more with this sleek fitness band. Long battery life.',
        price: 79.99,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Fitness+Tracker',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(2),
        offers: ['Water Resistant']
    },

    // --- Drones ---
    {
        name: 'Drone Pro 3',
        description: 'Professional 4K drone with 3-axis gimbal, 30-minute flight time, and obstacle avoidance.',
        price: 1299.00,
        stockQuantity: 10,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Drone+Pro',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=Drone+Flying',
            'https://placehold.co/400x300/e63946/f1faee?text=Drone+Folded'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(1),
        offers: ['Free Extra Battery']
    },

    // --- Cameras ---
    {
        name: 'Mirrorless Camera Z50',
        description: 'Compact and powerful mirrorless camera with 24MP sensor and 4K video. Perfect for enthusiasts.',
        price: 899.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Mirrorless+Camera',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Camera+Lens',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Camera+Back'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(2),
        offers: ['Kit Lens Included']
    },
    {
        name: 'Action Camera 4K',
        description: 'Rugged and waterproof 4K action camera for all your adventures. HyperSmooth stabilization.',
        price: 299.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Action+Camera',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(1),
        offers: ['Free Mounting Kit']
    },

    // --- Networking ---
    {
        name: 'Wi-Fi 6 Mesh System',
        description: 'Whole-home coverage with blazing-fast Wi-Fi 6 speeds. Eliminate dead zones and enjoy seamless streaming.',
        price: 249.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Mesh+WiFi',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=Mesh+Router',
            'https://placehold.co/400x300/e63946/f1faee?text=Mesh+Node'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(2),
        offers: ['Easy Setup Guide']
    },
    {
        name: 'Gigabit Ethernet Switch 8-Port',
        description: 'Expand your wired network with this unmanaged 8-port Gigabit Ethernet switch. Plug and play.',
        price: 49.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Ethernet+Switch',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(1),
        offers: ['Fanless Design']
    },

    // --- Storage ---
    {
        name: 'Internal SSD 2TB NVMe',
        description: 'Blazing-fast NVMe SSD for your PC or laptop. Dramatically improve load times and system responsiveness.',
        price: 179.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/457b9d/f1faee?text=NVMe+SSD',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 15,
        reviews: generateRandomReviews(2),
        offers: ['5-Year Warranty']
    },
    {
        name: 'Network Attached Storage (NAS) 2-Bay',
        description: 'Your personal cloud storage solution. Centralize your data, stream media, and backup devices.',
        price: 299.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=NAS+Drive',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=NAS+Rear',
            'https://placehold.co/400x300/e63946/f1faee?text=NAS+Disks'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 10) + 2,
        reviews: generateRandomReviews(1),
        offers: ['Diskless Enclosure']
    },

    // --- Peripherals ---
    {
        name: 'Ergonomic Vertical Mouse',
        description: 'Designed to reduce wrist strain, promoting a natural handshake position for comfortable long-term use.',
        price: 45.00,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/f0f2f5/2c3e50?text=Vertical+Mouse',
        additionalImages: [
            'https://placehold.co/400x300/f0f2f5/2c3e50?text=Mouse+Hand',
            'https://placehold.co/400x300/f0f2f5/2c3e50?text=Mouse+Angle'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Adjustable DPI']
    },
    {
        name: 'Gaming Mouse Pad XL',
        description: 'Large surface, optimized for gaming sensors, with anti-slip rubber base for ultimate control.',
        price: 19.99,
        stockQuantity: 250,
        imageUrl: 'https://placehold.co/400x300/e9ecef/495057?text=Mouse+Pad',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 20,
        reviews: generateRandomReviews(2),
        offers: ['Stitched Edges']
    },
    {
        name: 'Professional USB Microphone',
        description: 'Studio-quality condenser microphone for streaming, podcasting, and recording. Plug and play.',
        price: 79.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/cce5ff/007bff?text=USB+Mic',
        additionalImages: [
            'https://placehold.co/400x300/cce5ff/007bff?text=Mic+Stand',
            'https://placehold.co/400x300/cce5ff/007bff?text=Mic+PopFilter'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(2),
        offers: ['Includes Desktop Stand']
    },
    {
        name: 'Curved Gaming Monitor 32"',
        description: 'Immersive 32-inch 144Hz curved monitor for an unparalleled gaming experience. QHD resolution.',
        price: 499.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/ffeeba/ffc107?text=Curved+Monitor',
        additionalImages: [
            'https://placehold.co/400x300/ffeeba/ffc107?text=Monitor+Back',
            'https://placehold.co/400x300/ffeeba/ffc107?text=Monitor+Setup'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 20) + 5,
        reviews: generateRandomReviews(1),
        offers: ['AMD FreeSync Premium']
    },
    {
        name: 'Wireless Ergonomic Keyboard',
        description: 'Split design and cushioned palm rest for maximum typing comfort and reduced strain.',
        price: 69.99,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/d4edda/28a745?text=Ergo+Keyboard',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Multi-Device Connectivity']
    },
    {
        name: 'Portable Projector Mini',
        description: 'Pocket-sized projector for movies, presentations, and gaming on the go. Built-in speaker.',
        price: 189.00,
        stockQuantity: 45,
        imageUrl: 'https://placehold.co/400x300/f8d7da/dc3545?text=Mini+Projector',
        additionalImages: [
            'https://placehold.co/400x300/f8d7da/dc3545?text=Projector+Side',
            'https://placehold.co/400x300/f8d7da/dc3545?text=Projector+Screen'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['HDMI & USB Input']
    },

    // --- Mobile & Laptop Gadgets / Accessories ---
    {
        name: 'Fast Wireless Charging Stand',
        description: 'Charge your smartphone vertically or horizontally with this fast wireless charging stand.',
        price: 34.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/e9ecef/1a202c?text=Charging+Stand',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Qi Certified']
    },
    {
        name: 'USB-C to HDMI Adapter 4K',
        description: 'Connect your USB-C laptop or phone to an HDMI display with 4K@60Hz support.',
        price: 18.50,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/ced4da/666666?text=USB-C+HDMI',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 120) + 30,
        reviews: generateRandomReviews(4),
        offers: ['Plug & Play']
    },
    {
        name: 'Portable Power Bank 20000mAh',
        description: 'High-capacity power bank with dual USB-A and USB-C ports for fast charging multiple devices.',
        price: 45.00,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/f8f9fa/333333?text=Power+Bank',
        additionalImages: [
            'https://placehold.co/400x300/f8f9fa/333333?text=Power+Bank+Ports',
            'https://placehold.co/400x300/f8f9fa/333333?text=Power+Bank+Size'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(5),
        offers: ['Built-in LED Display']
    },
    {
        name: 'Universal Laptop Charger 90W',
        description: 'Compatible with most laptop brands, includes multiple tips and surge protection.',
        price: 39.99,
        stockQuantity: 75,
        imageUrl: 'https://placehold.co/400x300/d1ecf1/17a2b8?text=Laptop+Charger',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Multi-Tip Design']
    },
    {
        name: 'Smartphone Gimbal Stabilizer',
        description: 'Capture smooth, cinematic footage with your smartphone. 3-axis stabilization and intelligent tracking.',
        price: 99.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/fcf8e3/856404?text=Phone+Gimbal',
        additionalImages: [
            'https://placehold.co/400x300/fcf8e3/856404?text=Gimbal+Folded',
            'https://placehold.co/400x300/fcf8e3/856404?text=Gimbal+Action'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Free Mini Tripod']
    },
    {
        name: 'Magnetic Phone Mount for Car',
        description: 'Securely hold your smartphone on your car dashboard or vent with strong magnets.',
        price: 14.99,
        stockQuantity: 300,
        imageUrl: 'https://placehold.co/400x300/dae0e5/0056b3?text=Car+Phone+Mount',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 200) + 50,
        reviews: generateRandomReviews(4),
        offers: ['360° Rotation']
    },
    {
        name: 'Laptop Privacy Screen Filter 15.6"',
        description: 'Protect your sensitive data from prying eyes with this easy-to-install privacy filter.',
        price: 49.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/f0f2f5/2c3e50?text=Privacy+Filter',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Anti-Glare Coating']
    },
    {
        name: 'Stylus Pen for Tablets',
        description: 'Precise and responsive stylus for drawing, writing, and navigating on touchscreens.',
        price: 29.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/e9ecef/495057?text=Stylus+Pen',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Palm Rejection']
    },

    // --- Components / Circuit Boards (Simplified for seeding) ---
    {
        name: 'Arduino Uno R3 Board',
        description: 'Popular open-source microcontroller board for electronics projects and learning.',
        price: 22.99,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/d4edda/28a745?text=Arduino+Uno',
        additionalImages: [
            'https://placehold.co/400x300/d4edda/28a745?text=Arduino+Top',
            'https://placehold.co/400x300/d4edda/28a745?text=Arduino+Ports'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Starter Kits Available']
    },
    {
        name: 'Raspberry Pi 4 Model B (4GB)',
        description: 'Versatile single-board computer for DIY projects, home automation, and learning to code.',
        price: 55.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/ffeeba/ffc107?text=Raspberry+Pi',
        additionalImages: [
            'https://placehold.co/400x300/ffeeba/ffc107?text=Pi+Ports',
            'https://placehold.co/400x300/ffeeba/ffc107?text=Pi+Mounted'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Official Case Bundle']
    },
    {
        name: 'ESP32 Development Board',
        description: 'Wi-Fi and Bluetooth enabled development board for IoT projects and embedded systems.',
        price: 9.99,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f8d7da/dc3545?text=ESP32+Board',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Bulk Discount']
    },
    {
        name: 'Breadboard 830 Tie-Points',
        description: 'Solderless breadboard for prototyping electronic circuits. Ideal for beginners and hobbyists.',
        price: 5.00,
        stockQuantity: 500,
        imageUrl: 'https://placehold.co/400x300/cce5ff/007bff?text=Breadboard',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(4),
        offers: ['Multi-Pack Available']
    },
    {
        name: 'Jumper Wires Assortment (400pcs)',
        description: 'Male-to-male, male-to-female, and female-to-female jumper wires for breadboards and prototyping.',
        price: 11.50,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/e2e3e5/6c757d?text=Jumper+Wires',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 20,
        reviews: generateRandomReviews(2),
        offers: ['Various Colors']
    },

    // --- Miscellaneous Tech ---
    {
        name: 'Smart Plug Mini',
        description: 'Control your appliances from anywhere with this Wi-Fi smart plug. Schedule on/off times.',
        price: 19.99,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/d1ecf1/17a2b8?text=Smart+Plug',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 110) + 30,
        reviews: generateRandomReviews(3),
        offers: ['Voice Control Compatible']
    },
    {
        name: 'Robot Vacuum Cleaner',
        description: 'Intelligent robot vacuum with powerful suction, smart navigation, and app control.',
        price: 299.00,
        stockQuantity: 25,
        imageUrl: 'https://placehold.co/400x300/fcf8e3/856404?text=Robot+Vacuum',
        additionalImages: [
            'https://placehold.co/400x300/fcf8e3/856404?text=Vacuum+Bottom',
            'https://placehold.co/400x300/fcf8e3/856404?text=Vacuum+Dock'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 35) + 7,
        reviews: generateRandomReviews(2),
        offers: ['Auto-Docking & Recharge']
    },
    {
        name: 'Portable SSD 500GB USB 3.2',
        description: 'Ultra-fast and compact external SSD for reliable data storage and transfer on the go.',
        price: 79.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f8f9fa/333333?text=Portable+SSD',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Pocket-Sized']
    },
    {
        name: 'Gaming Headset with Mic',
        description: 'Immersive 7.1 surround sound gaming headset with noise-cancelling microphone for clear communication.',
        price: 65.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Gaming+Headset',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Headset+Mic',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Headset+Side'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 110) + 25,
        reviews: generateRandomReviews(4),
        offers: ['RGB Lighting']
    },
    {
        name: 'Wireless Earbuds Pro',
        description: 'Premium true wireless earbuds with active noise cancellation, transparency mode, and rich audio.',
        price: 159.00,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/f1faee/e63946?text=Wireless+Earbuds',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/e63946?text=Earbuds+Case',
            'https://placehold.co/400x300/f1faee/e63946?text=Earbuds+InEar'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 130) + 35,
        reviews: generateRandomReviews(5),
        offers: ['30-Hour Battery Life']
    },
    {
        name: 'Smart Home Security Camera',
        description: 'Full HD indoor security camera with motion detection, night vision, and two-way audio.',
        price: 59.99,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/457b9d/f1faee?text=Security+Camera',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Cloud Storage Available']
    },
    {
        name: 'Portable Photo Printer',
        description: 'Print instant photos from your smartphone. ZINK Zero Ink technology for vibrant, smudge-proof prints.',
        price: 119.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Photo+Printer',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=Printer+Side',
            'https://placehold.co/400x300/e63946/f1faee?text=Printer+Print'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 20) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Includes 10 Sheets of Photo Paper']
    },
    {
        name: 'Digital Drawing Tablet 10"',
        description: 'Large drawing area with pressure-sensitive stylus. Ideal for digital art, graphic design, and online teaching.',
        price: 89.00,
        stockQuantity: 55,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Drawing+Tablet',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 45) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Compatible with Mac & PC']
    },
    {
        name: 'Smart Doorbell Camera',
        description: 'See, hear, and speak to visitors from anywhere. Full HD video, motion alerts, and night vision.',
        price: 149.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Doorbell',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/457b9d?text=Doorbell+Installed',
            'https://placehold.co/400x300/f1faee/457b9d?text=Doorbell+App'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Easy Installation']
    },
    {
        name: 'USB-C Multiport Adapter Pro',
        description: 'All-in-one hub with HDMI, Ethernet, USB 3.0, SD/TF card readers, and 100W PD charging.',
        price: 59.99,
        stockQuantity: 110,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Hub+Pro',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Aluminum Casing']
    },
    {
        name: 'Gaming Chair Ergonomic',
        description: 'High-back ergonomic gaming chair with lumbar support, adjustable armrests, and recline function.',
        price: 199.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Gaming+Chair',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Chair+Recline',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Chair+Side'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Free Shipping']
    },
    {
        name: 'Smart Light Strip RGB',
        description: 'Flexible RGB LED light strip with app control and music sync. Perfect for ambient lighting.',
        price: 35.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Light+Strip',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Voice Assistant Compatible']
    },
    {
        name: 'Portable Monitor 15.6"',
        description: 'Lightweight Full HD portable monitor with USB-C and HDMI. Extend your laptop screen anywhere.',
        price: 179.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Portable+Monitor',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=Monitor+Setup',
            'https://placehold.co/400x300/e63946/f1faee?text=Monitor+Slim'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Includes Smart Cover']
    },
    {
        name: 'Gaming Desk Large',
        description: 'Spacious gaming desk with carbon fiber texture, cup holder, and headphone hook. Z-shaped legs for stability.',
        price: 149.00,
        stockQuantity: 15,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Gaming+Desk',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 10) + 2,
        reviews: generateRandomReviews(1),
        offers: ['Easy Assembly']
    },
    {
        name: 'Smart Scale Body Composition',
        description: 'Track weight, BMI, body fat, muscle mass, and more. Syncs with health apps via Bluetooth.',
        price: 39.99,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Scale',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Multiple User Profiles']
    },
    {
        name: 'External Hard Drive 4TB',
        description: 'Reliable high-capacity external hard drive for backups and extra storage. USB 3.0 connectivity.',
        price: 99.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=External+HDD',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Plug & Play']
    },
    {
        name: 'USB Condenser Microphone Kit',
        description: 'Complete microphone kit for podcasting, streaming, and voiceovers. Includes pop filter and shock mount.',
        price: 110.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Mic+Kit',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Mic+Boom+Arm',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Mic+Setup'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 20) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Studio Quality Sound']
    },
    {
        name: 'Smart Light Bulbs 4-Pack',
        description: 'Control brightness and color with your smartphone or voice. Energy-efficient and easy to install.',
        price: 49.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Bulbs+Pack',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Compatible with Alexa/Google Home']
    },
    {
        name: 'Wireless Charging Desk Mat',
        description: 'Large desk mat with integrated wireless charging pad for your smartphone or earbuds.',
        price: 45.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Charging+Desk+Mat',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(2),
        offers: ['Non-Slip Base']
    },
    {
        name: 'USB-C to Lightning Cable (MFi)',
        description: 'Durable braided cable for fast charging and syncing Apple devices. MFi certified.',
        price: 19.99,
        stockQuantity: 250,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=USB-C+Lightning',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(5),
        offers: ['Fast Charge Compatible']
    },
    {
        name: 'Smart Thermostat Wi-Fi',
        description: 'Save energy and control your home climate from anywhere with this smart thermostat.',
        price: 129.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Thermostat',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/457b9d?text=Thermostat+Display',
            'https://placehold.co/400x300/f1faee/457b9d?text=Thermostat+Installed'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Energy Saving Reports']
    },
    {
        name: 'Portable Monitor 13.3" 4K',
        description: 'Ultra-slim 4K portable monitor, perfect for professionals needing extra screen real estate.',
        price: 299.00,
        stockQuantity: 25,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Portable+4K+Monitor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(1),
        offers: ['VESA Mountable']
    },
    {
        name: 'Gaming Headphone Stand with RGB',
        description: 'Display your gaming headset in style with this RGB illuminated stand with USB hub.',
        price: 29.99,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Headphone+Stand+RGB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Built-in USB Ports']
    },
    {
        name: 'USB-C to Ethernet Adapter',
        description: 'Add a reliable wired Ethernet connection to your USB-C laptop or tablet.',
        price: 15.00,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Ethernet',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Gigabit Speed']
    },
    {
        name: 'Smart Sprinkler Controller',
        description: 'Automate your lawn watering based on weather forecasts. Save water and money.',
        price: 179.00,
        stockQuantity: 15,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Smart+Sprinkler',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 10) + 2,
        reviews: generateRandomReviews(1),
        offers: ['Weather Intelligence']
    },
    {
        name: 'Portable Bluetooth Keyboard',
        description: 'Compact and lightweight keyboard for tablets and smartphones. Multi-device pairing.',
        price: 39.00,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Bluetooth+Keyboard',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Long Battery Life']
    },
    {
        name: 'USB 3.0 Hub 4-Port',
        description: 'Expand your USB ports with this compact 4-port USB 3.0 hub. Fast data transfer.',
        price: 12.00,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB+Hub',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Backward Compatible']
    },
    {
        name: 'Smart Lock Keyless Entry',
        description: 'Secure your home with a smart lock. Keyless entry via keypad, smartphone, or voice.',
        price: 199.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Smart+Lock',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=Lock+Installed',
            'https://placehold.co/400x300/e63946/f1faee?text=Lock+Keypad'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(1),
        offers: ['Easy DIY Installation']
    },
    {
        name: 'Gaming Monitor 24" 144Hz',
        description: 'Fast 144Hz refresh rate and 1ms response time for competitive gaming. Full HD resolution.',
        price: 189.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Gaming+Monitor+24',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(2),
        offers: ['FreeSync Compatible']
    },
    {
        name: 'Laptop Cooling Pad 17"',
        description: 'Keep your gaming laptop cool with powerful fans and ergonomic design. Fits up to 17-inch laptops.',
        price: 30.00,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Cooling+Pad',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(3),
        offers: ['Adjustable Height']
    },
    {
        name: 'USB-C to DisplayPort Cable 4K',
        description: 'Connect your USB-C device to a DisplayPort monitor or TV for 4K video output.',
        price: 21.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+DP',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(2),
        offers: ['Braided Nylon']
    },
    {
        name: 'Smart Air Purifier HEPA',
        description: 'Clean your indoor air with a smart HEPA air purifier. App control and air quality monitoring.',
        price: 159.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Air+Purifier',
        additionalImages: [
            'https://placehold.co/400x300/a8dadc/1d3557?text=Purifier+Filter',
            'https://placehold.co/400x300/a8dadc/1d3557?text=Purifier+App'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(1),
        offers: ['Quiet Operation']
    },
    {
        name: 'Portable Photo Studio Box',
        description: 'Mini photo studio with LED lights for professional product photography. Foldable design.',
        price: 49.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Photo+Studio+Box',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Multiple Backgrounds']
    },
    {
        name: 'Smart LED Strip Lights 5M',
        description: '5-meter RGB LED strip lights with remote and app control. Perfect for room decor.',
        price: 25.00,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=LED+Strip',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Music Sync Mode']
    },
    {
        name: 'Universal Tablet Stand',
        description: 'Adjustable aluminum stand for tablets and smartphones. Perfect for hands-free viewing.',
        price: 18.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Tablet+Stand',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Foldable Design']
    },
    {
        name: 'USB-C to USB-A Adapter (2-pack)',
        description: 'Convert your USB-C port to a USB-A port. Ideal for connecting older peripherals.',
        price: 9.99,
        stockQuantity: 300,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Adapter',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(4),
        offers: ['Compact Size']
    },
    {
        name: 'Smart Home Hub Zigbee/Z-Wave',
        description: 'Central hub for all your smart home devices. Compatible with Zigbee and Z-Wave protocols.',
        price: 89.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Smart+Hub',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 20) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Local Control Option']
    },
    {
        name: 'Gaming Mouse Wired RGB',
        description: 'High-precision wired gaming mouse with customizable RGB lighting and programmable buttons.',
        price: 39.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Wired+Gaming+Mouse',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Adjustable Weight System']
    },
    {
        name: 'Portable SSD 1TB USB 3.2',
        description: 'Ultra-fast and compact external SSD for reliable data storage and transfer on the go.',
        price: 129.99,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Portable+SSD+1TB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Hardware Encryption']
    },
    {
        name: 'Bluetooth Speaker Waterproof',
        description: 'Rugged and waterproof Bluetooth speaker with powerful sound and long battery life. Perfect for outdoors.',
        price: 69.00,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Waterproof+Speaker',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Built-in Carabiner']
    },
    {
        name: 'Smartwatch Sport Edition',
        description: 'GPS-enabled smartwatch for sports and fitness tracking. Heart rate, blood oxygen, and sleep monitoring.',
        price: 249.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Sport+Smartwatch',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Multiple Sport Modes']
    },
    {
        name: 'USB-C Docking Station Dual Monitor',
        description: 'Expand your laptop\'s capabilities with dual 4K monitor support, multiple USB ports, and Ethernet.',
        price: 119.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Dock',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/457b9d?text=Dock+Ports',
            'https://placehold.co/400x300/f1faee/457b9d?text=Dock+Setup'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['100W Power Delivery']
    },
    {
        name: 'Wireless Gaming Headset',
        description: 'Lag-free wireless gaming headset with comfortable earcups and clear microphone. Long battery life.',
        price: 99.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Wireless+Gaming+Headset',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Cross-Platform Compatible']
    },
    {
        name: 'Portable Mini Projector',
        description: 'Compact and lightweight projector for on-the-go entertainment. Supports Full HD input.',
        price: 89.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Mini+Projector+Portable',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(1),
        offers: ['HDMI & USB Input']
    },
    {
        name: 'Smart Home Security System',
        description: 'Comprehensive smart home security system with motion sensors, door/window sensors, and siren.',
        price: 349.00,
        stockQuantity: 10,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Security+System',
        additionalImages: [
            'https://placehold.co/400x300/f1faee/457b9d?text=System+Sensors',
            'https://placehold.co/400x300/f1faee/457b9d?text=System+Hub'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 10) + 2,
        reviews: generateRandomReviews(1),
        offers: ['Professional Monitoring Available']
    },
    {
        name: 'Gaming Keyboard Compact 60%',
        description: 'Ultra-compact 60% mechanical gaming keyboard with hot-swappable switches and RGB.',
        price: 79.00,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=60Percent+Keyboard',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Detachable USB-C Cable']
    },
    {
        name: 'USB-C to SD Card Reader',
        description: 'Fast data transfer from SD and MicroSD cards to your USB-C device. Plug and play.',
        price: 10.00,
        stockQuantity: 250,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=SD+Card+Reader',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Compact Design']
    },
    {
        name: 'Smart Home Motion Sensor',
        description: 'Detect motion and trigger smart home routines. Battery-powered and easy to install.',
        price: 25.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Motion+Sensor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Wireless Connectivity']
    },
    {
        name: 'VR Headset Stand',
        description: 'Display and store your VR headset and controllers neatly. Stable and stylish design.',
        price: 29.00,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=VR+Stand',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Weighted Base']
    },
    {
        name: 'Gaming Mouse Wireless Lightweight',
        description: 'Ultra-lightweight wireless gaming mouse with high-precision sensor and long battery life.',
        price: 59.99,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Lightweight+Mouse',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Honeycomb Shell Design']
    },
    {
        name: 'Portable SSD 2TB USB 3.2',
        description: 'Massive 2TB portable SSD for all your games, videos, and large files. Blazing fast speeds.',
        price: 199.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Portable+SSD+2TB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Rugged Design']
    },
    {
        name: 'Smart Display with Voice Assistant',
        description: 'Control your smart home, make video calls, and stream content on this smart display.',
        price: 129.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Smart+Display',
        additionalImages: [
            'https://placehold.co/400x300/e63946/f1faee?text=Display+VideoCall',
            'https://placehold.co/400x300/e63946/f1faee?text=Display+Home'
        ],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Built-in Camera']
    },
    {
        name: 'USB-C to HDMI/USB/PD Hub',
        description: 'Compact USB-C hub with HDMI, USB 3.0, and Power Delivery passthrough for laptops.',
        price: 35.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=USB-C+Mini+Hub',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Portable Design']
    },
    {
        name: 'Gaming Headset Stand with USB Hub',
        description: 'Organize your desk with this headset stand featuring a built-in 3-port USB hub.',
        price: 24.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Headset+Stand+USB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Non-Slip Base']
    },
    {
        name: 'Smart Home Door/Window Sensor',
        description: 'Monitor entries and exits with this compact wireless sensor. Integrates with smart home systems.',
        price: 19.00,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Door+Sensor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Easy Peel-and-Stick Install']
    },
    {
        name: 'Portable Hard Drive 1TB',
        description: 'Reliable 1TB portable hard drive for extra storage on the go. USB 3.0 compatible.',
        price: 59.99,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Portable+HDD+1TB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 30,
        reviews: generateRandomReviews(4),
        offers: ['Compact & Durable']
    },
    {
        name: 'Smart Power Strip Wi-Fi',
        description: 'Control 4 outlets and 2 USB ports individually from your phone or voice assistant.',
        price: 39.00,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Power+Strip',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Surge Protection']
    },
    {
        name: 'Gaming Headset Stand RGB with Wireless Charging',
        description: 'Premium headset stand with dynamic RGB lighting and integrated wireless charging for your phone.',
        price: 49.99,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=RGB+Charging+Stand',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Fast Wireless Charging']
    },
    {
        name: 'USB-C to Dual HDMI Adapter',
        description: 'Connect two HDMI monitors to your USB-C laptop for extended desktop display. Supports 4K.',
        price: 45.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=USB-C+Dual+HDMI',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(2),
        offers: ['Plug & Play']
    },
    {
        name: 'Smart Home Water Leak Sensor',
        description: 'Receive instant alerts on your phone if a water leak is detected. Protect your home from damage.',
        price: 29.00,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Water+Leak+Sensor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Battery Operated']
    },
    {
        name: 'Portable Bluetooth Speaker Mini',
        description: 'Ultra-compact Bluetooth speaker with surprisingly powerful sound. Perfect for travel.',
        price: 29.99,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Mini+Bluetooth+Speaker',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 120) + 30,
        reviews: generateRandomReviews(4),
        offers: ['Clip-on Design']
    },
    {
        name: 'USB-C to VGA Adapter',
        description: 'Connect your USB-C laptop to an older VGA monitor or projector.',
        price: 15.00,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=USB-C+VGA',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Compact & Portable']
    },
    {
        name: 'Smart Home Temperature Sensor',
        description: 'Monitor room temperature and humidity with this wireless smart sensor.',
        price: 22.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Temp+Sensor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['App Notifications']
    },
    {
        name: 'Gaming Mouse Bungee',
        description: 'Cable management solution for wired gaming mice. Prevents tangles and drag.',
        price: 12.99,
        stockQuantity: 250,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Mouse+Bungee',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Stable Design']
    },
    {
        name: 'Portable Monitor Stand',
        description: 'Adjustable and foldable stand for portable monitors, tablets, and laptops.',
        price: 28.00,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Portable+Monitor+Stand',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Aluminum Alloy']
    },
    {
        name: 'USB-C to Ethernet + PD Adapter',
        description: 'Connect to wired internet and charge your laptop simultaneously via a single USB-C port.',
        price: 29.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Ethernet+PD',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Gigabit Ethernet']
    },
    {
        name: 'Smart Home Smoke Detector',
        description: 'Connected smoke detector that sends alerts to your phone. Integrates with smart home systems.',
        price: 59.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Smoke+Detector',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 20) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Long Battery Life']
    },
    {
        name: 'Gaming Headset Wired RGB',
        description: 'High-fidelity wired gaming headset with powerful drivers and customizable RGB lighting.',
        price: 49.99,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Wired+RGB+Headset',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Comfortable Ear Cushions']
    },
    {
        name: 'USB-C to 3.5mm Audio Adapter',
        description: 'Connect your traditional headphones to USB-C devices without a headphone jack.',
        price: 9.00,
        stockQuantity: 300,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Audio',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(5),
        offers: ['High-Fidelity Audio']
    },
    {
        name: 'Smart Home Carbon Monoxide Detector',
        description: 'Protect your family from CO poisoning with this smart detector. App alerts and loud siren.',
        price: 69.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=CO+Detector',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Self-Test Function']
    },
    {
        name: 'Laptop Backpack 15.6"',
        description: 'Stylish and durable laptop backpack with multiple compartments and padded laptop sleeve.',
        price: 49.00,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Laptop+Backpack',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Water-Resistant Material']
    },
    {
        name: 'Gaming Mousepad RGB Large',
        description: 'Extra-large RGB illuminated gaming mousepad for full desk coverage and dynamic lighting effects.',
        price: 35.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=RGB+Mousepad',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Multiple Lighting Modes']
    },
    {
        name: 'USB-C to Ethernet Adapter Gigabit',
        description: 'High-speed Gigabit Ethernet adapter for USB-C devices. Essential for stable wired connections.',
        price: 20.00,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Gigabit+Ethernet',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(4),
        offers: ['Compact & Portable']
    },
    {
        name: 'Smart Home Camera Outdoor 1080p',
        description: 'Weatherproof outdoor security camera with Full HD video, night vision, and motion detection.',
        price: 89.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Outdoor+Camera',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Two-Way Audio']
    },
    {
        name: 'Portable Bluetooth Speaker with LED Lights',
        description: 'Party speaker with dynamic LED light show and powerful bass. Perfect for gatherings.',
        price: 79.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=LED+Bluetooth+Speaker',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Long Battery Life']
    },
    {
        name: 'USB-C to Dual DisplayPort Adapter',
        description: 'Connect two DisplayPort monitors to your USB-C laptop for a multi-display setup. Supports 4K.',
        price: 55.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Dual+DP',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['Plug & Play']
    },
    {
        name: 'Smart Home Carbon Monoxide & Smoke Alarm',
        description: 'Dual-sensor smart alarm for both smoke and carbon monoxide detection. App alerts and voice notifications.',
        price: 99.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Combo+Alarm',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(1),
        offers: ['Battery Backup']
    },
    {
        name: 'Laptop Sleeve 13"',
        description: 'Protective and stylish laptop sleeve for 13-inch laptops. Water-resistant and shock-absorbent.',
        price: 22.00,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Laptop+Sleeve',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Multiple Colors']
    },
    {
        name: 'Gaming Headphone Stand with RGB & USB Hub',
        description: 'Ultimate desk accessory: RGB lighting, 3-port USB hub, and a secure stand for your gaming headset.',
        price: 39.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=RGB+USB+Headset+Stand',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Dynamic Lighting Effects']
    },
    {
        name: 'USB-C to SD/MicroSD Card Reader',
        description: 'Compact and fast card reader for both SD and MicroSD cards via USB-C.',
        price: 14.99,
        stockQuantity: 250,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=USB-C+Card+Reader',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(4),
        offers: ['Plug & Play']
    },
    {
        name: 'Smart Home Siren Alarm',
        description: 'Loud siren alarm for your smart home security system. Customizable sound and volume.',
        price: 35.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Smart+Siren',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Easy Pairing']
    },
    {
        name: 'Portable Hard Drive 2TB',
        description: 'Spacious 2TB portable hard drive for extensive backups and media storage. USB 3.0.',
        price: 79.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Portable+HDD+2TB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Slim Design']
    },
    {
        name: 'Smart Power Outlet Outdoor',
        description: 'Weatherproof smart outlet for outdoor lights and appliances. Control via app or voice.',
        price: 45.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Outdoor+Smart+Outlet',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(2),
        offers: ['Two Outlets']
    },
    {
        name: 'Gaming Headset Wired with Volume Control',
        description: 'Comfortable wired gaming headset with clear audio and convenient inline volume control.',
        price: 39.99,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Wired+Headset+Volume',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 90) + 25,
        reviews: generateRandomReviews(3),
        offers: ['Universal Compatibility']
    },
    {
        name: 'USB-C to HDMI + USB + SD Card Hub',
        description: 'Versatile USB-C hub with HDMI, USB 3.0, and SD/MicroSD card slots.',
        price: 32.00,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Multi+Hub',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 100) + 30,
        reviews: generateRandomReviews(4),
        offers: ['Compact & Lightweight']
    },
    {
        name: 'Smart Home Water Valve Controller',
        description: 'Automatically shut off your main water supply in case of a leak. Remote control via app.',
        price: 199.00,
        stockQuantity: 15,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Water+Valve+Controller',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 10) + 2,
        reviews: generateRandomReviews(1),
        offers: ['Easy Installation']
    },
    {
        name: 'Portable Bluetooth Speaker with FM Radio',
        description: 'Enjoy music and FM radio on the go with this portable Bluetooth speaker. Long battery life.',
        price: 39.00,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Bluetooth+Speaker+FM',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(2),
        offers: ['Built-in Microphone']
    },
    {
        name: 'USB-C to Ethernet Adapter + 3 USB Ports',
        description: 'Get a wired internet connection and expand your USB ports with this versatile USB-C adapter.',
        price: 28.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Ethernet+USB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(3),
        offers: ['Plug & Play']
    },
    {
        name: 'Smart Home Garage Door Opener',
        description: 'Control and monitor your garage door from anywhere with your smartphone. Secure and convenient.',
        price: 79.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Garage+Door+Opener',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(2),
        offers: ['Easy Installation']
    },
    {
        name: 'Gaming Mouse Wired with Side Buttons',
        description: 'Ergonomic wired gaming mouse with multiple programmable side buttons for MMO/MOBA games.',
        price: 49.99,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=MMO+Mouse',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(2),
        offers: ['Customizable DPI']
    },
    {
        name: 'Portable SSD 4TB USB 3.2',
        description: 'Massive 4TB portable SSD for professionals and heavy users. Ultimate speed and capacity.',
        price: 349.00,
        stockQuantity: 25,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Portable+SSD+4TB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(1),
        offers: ['5-Year Limited Warranty']
    },
    {
        name: 'Smart Home Air Quality Monitor',
        description: 'Track indoor air quality (VOC, PM2.5, CO2) and receive alerts on your smartphone.',
        price: 119.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Air+Quality+Monitor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 20) + 5, // Can have 0 reviews
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1), // Can have 0 reviews
        offers: ['Real-time Data']
    },
    {
        name: 'USB-C to Micro USB Adapter',
        description: 'Convert your USB-C cable to Micro USB. Useful for charging older Android devices.',
        price: 7.00,
        stockQuantity: 300,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Micro+USB',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(5),
        offers: ['2-Pack']
    },
    {
        name: 'Smart Home Pet Feeder',
        description: 'Automate your pet\'s feeding schedule and dispense food remotely via smartphone app.',
        price: 89.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Pet+Feeder',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Portion Control']
    },
    {
        name: 'Gaming Headset Wired with RGB & USB',
        description: 'Wired gaming headset with vibrant RGB lighting and a USB connection for PC/Console.',
        price: 59.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Wired+RGB+USB+Headset',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(3),
        offers: ['Detachable Microphone']
    },
    {
        name: 'USB-C to DVI Adapter',
        description: 'Connect your USB-C laptop to a DVI monitor or projector. Supports up to 1080p.',
        price: 18.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+DVI',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['HD Resolution']
    },
    {
        name: 'Smart Home Curtain Motor',
        description: 'Automate your curtains or blinds with this smart motor. Control via app or voice.',
        price: 149.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Curtain+Motor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Easy Installation']
    },
    {
        name: 'Portable Document Scanner',
        description: 'Scan documents on the go with this compact portable scanner. USB powered.',
        price: 99.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Portable+Scanner',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['High-Speed Scanning']
    },
    {
        name: 'USB-C to Ethernet Adapter + HDMI',
        description: 'Get wired internet and an HDMI display connection from a single USB-C port.',
        price: 39.00,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Ethernet+HDMI',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Plug & Play']
    },
    {
        name: 'Smart Home Garage Door Sensor',
        description: 'Monitor the open/closed status of your garage door and receive alerts.',
        price: 29.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Garage+Sensor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['Wireless Installation']
    },
    {
        name: 'Gaming Headset Wired with Detachable Mic',
        description: 'Versatile wired gaming headset with a high-quality detachable microphone for gaming and music.',
        price: 55.00,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Detachable+Mic+Headset',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Comfortable Fit']
    },
    {
        name: 'USB-C to Dual USB-A Hub',
        description: 'Expand your USB-C port with two USB-A 3.0 ports for connecting peripherals.',
        price: 12.00,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+Dual+USB-A',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 4),
        offers: ['Ultra-Compact']
    },
    {
        name: 'Smart Home Light Switch Wi-Fi',
        description: 'Replace your existing light switch to control lights via app or voice. No hub required.',
        price: 39.00,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Smart+Light+Switch',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Schedule Lights']
    },
    {
        name: 'Portable SSD 500GB USB-C',
        description: 'Fast and compact 500GB portable SSD with USB-C connectivity. Ideal for quick backups.',
        price: 69.99,
        stockQuantity: 100,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Portable+SSD+500GB+C',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 70) + 15,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['Shock Resistant']
    },
    {
        name: 'Smart Home Video Doorbell Pro',
        description: 'Advanced video doorbell with 2K HDR video, person detection, and local storage option.',
        price: 249.00,
        stockQuantity: 25,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Video+Doorbell+Pro',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Two-Way Talk']
    },
    {
        name: 'USB-C to Multi-Card Reader',
        description: 'Read SD, MicroSD, CF, and MS cards with this versatile USB-C card reader.',
        price: 19.99,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Multi+Card+Reader',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['High-Speed Transfer']
    },
    {
        name: 'Smart Home Pet Camera',
        description: 'Monitor your pets remotely with 1080p video, two-way audio, and treat dispensing.',
        price: 129.00,
        stockQuantity: 40,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Pet+Camera',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Night Vision']
    },
    {
        name: 'Gaming Keyboard Full Size RGB',
        description: 'Full-size mechanical gaming keyboard with per-key RGB lighting and durable switches.',
        price: 119.00,
        stockQuantity: 60,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Full+Size+RGB+Keyboard',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Programmable Macros']
    },
    {
        name: 'USB-C to Ethernet + USB-A Hub',
        description: 'Compact adapter providing Gigabit Ethernet and three USB 3.0 ports via USB-C.',
        price: 25.00,
        stockQuantity: 180,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+Ethernet+USB+Hub',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 90) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['Driver-Free']
    },
    {
        name: 'Smart Home Water Leak Detector 3-Pack',
        description: 'Protect multiple areas of your home with a 3-pack of wireless water leak sensors.',
        price: 69.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Leak+Sensor+3Pack',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 30) + 5,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Battery Included']
    },
    {
        name: 'Portable Bluetooth Speaker with Power Bank',
        description: 'Powerful Bluetooth speaker that doubles as a power bank to charge your devices.',
        price: 89.00,
        stockQuantity: 50,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Speaker+PowerBank',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 40) + 8,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Rugged Design']
    },
    {
        name: 'USB-C to HDMI Cable 6ft 4K',
        description: 'Directly connect your USB-C device to an HDMI display with this 6ft 4K cable.',
        price: 16.00,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=USB-C+HDMI+Cable',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 4),
        offers: ['Braided Cable']
    },
    {
        name: 'Smart Home Water Leak Sensor Pro',
        description: 'Advanced water leak sensor with temperature monitoring and extended battery life.',
        price: 39.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Water+Leak+Sensor+Pro',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 50) + 10,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Long Range Wireless']
    },
    {
        name: 'Gaming Mouse Wireless RGB',
        description: 'High-performance wireless gaming mouse with vibrant RGB lighting and a precise optical sensor.',
        price: 69.99,
        stockQuantity: 80,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Wireless+RGB+Mouse',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 60) + 15,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['Rechargeable Battery']
    },
    {
        name: 'Portable SSD 1TB USB-A',
        description: 'Fast and durable 1TB portable SSD with traditional USB-A connection for broad compatibility.',
        price: 119.00,
        stockQuantity: 90,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Portable+SSD+1TB+A',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 70) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['Shock Resistant']
    },
    {
        name: 'Smart Home Humidity Sensor',
        description: 'Monitor indoor humidity levels and receive alerts. Integrates with smart home systems.',
        price: 22.00,
        stockQuantity: 150,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=Humidity+Sensor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['App Notifications']
    },
    {
        name: 'USB-C to USB 3.0 Adapter (2-pack)',
        description: 'Convert your USB-C port to a standard USB 3.0 port for connecting legacy devices. 2-pack.',
        price: 11.99,
        stockQuantity: 300,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=USB-C+USB3+2Pack',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 150) + 40,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 5),
        offers: ['High-Speed Data']
    },
    {
        name: 'Smart Home CO2 Monitor',
        description: 'Monitor indoor CO2 levels for improved air quality and health. App alerts and data logging.',
        price: 139.00,
        stockQuantity: 20,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=CO2+Monitor',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 15) + 3,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Real-time Readings']
    },
    {
        name: 'Gaming Keyboard RGB Mechanical',
        description: 'Full-size mechanical gaming keyboard with clicky switches, vibrant RGB, and durable construction.',
        price: 99.00,
        stockQuantity: 70,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=RGB+Mechanical+Keyboard',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 60) + 10,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 2),
        offers: ['Customizable Keycaps']
    },
    {
        name: 'Portable SSD 250GB USB-C',
        description: 'Entry-level portable SSD for fast and convenient data storage. USB-C connectivity.',
        price: 49.99,
        stockQuantity: 120,
        imageUrl: 'https://placehold.co/400x300/f1faee/457b9d?text=Portable+SSD+250GB+C',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 80) + 20,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 3),
        offers: ['Lightweight Design']
    },
    {
        name: 'Smart Home Garage Door Camera',
        description: 'Monitor your garage with a wide-angle camera. See who comes and goes, day or night.',
        price: 119.00,
        stockQuantity: 30,
        imageUrl: 'https://placehold.co/400x300/e63946/f1faee?text=Garage+Camera',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 25) + 5,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 1),
        offers: ['Motion Alerts']
    },
    {
        name: 'USB-C to Gigabit Ethernet Adapter',
        description: 'Add a high-speed wired network connection to your USB-C laptop or tablet.',
        price: 19.99,
        stockQuantity: 200,
        imageUrl: 'https://placehold.co/400x300/a8dadc/1d3557?text=USB-C+Gigabit+Adapter',
        additionalImages: [],
        averageRating: generateRandomRating(),
        numReviews: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 100) + 25,
        reviews: generateRandomReviews(Math.random() < 0.5 ? 0 : 4),
        offers: ['Driver-Free Installation']
    }
];


// Function to import data
const importData = async () => {
    try {
        await Product.deleteMany(); // Clears all existing products
        await Product.insertMany(sampleProducts); // Inserts new sample products
        console.log('Sample Products Data Imported Successfully!');
        process.exit(); // Exit the process after completion
    } catch (error) {
        console.error(`Error importing data: ${error}`);
        process.exit(1); // Exit with error code
    }
};

// Function to destroy all data
const destroyData = async () => {
    try {
        await Product.deleteMany(); // Clears all products
        console.log('All Products Data Destroyed!');
        process.exit(); // Exit the process after completion
    } catch (error) {
        console.error(`Error destroying data: ${error}`);
        process.exit(1); // Exit with error code
    }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
    destroyData(); // Run with `node server/seeders/seedProducts.js -d` to destroy
} else {
    importData(); // Run with `node server/seeders/seedProducts.js` to import
}

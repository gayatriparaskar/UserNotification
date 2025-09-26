// Snake E-commerce Website JavaScript

// Global variables
let cart = JSON.parse(localStorage.getItem('snakeCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('snakeWishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('snakeUser')) || null;

// Snake products database
const snakeProducts = [
    {
        id: 1,
        name: "Ball Python",
        breed: "Python regius",
        price: 299,
        image: "https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop",
        category: "pythons",
        difficulty: "beginner",
        description: "A gentle and docile snake perfect for beginners. Known for their calm temperament and beautiful patterns.",
        specifications: {
            "Size": "3-5 feet",
            "Lifespan": "20-30 years",
            "Temperature": "75-85°F",
            "Humidity": "50-60%",
            "Diet": "Mice/Rats"
        },
        inStock: true,
        rating: 4.8,
        reviews: 127
    },
    {
        id: 2,
        name: "Corn Snake",
        breed: "Pantherophis guttatus",
        price: 199,
        image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop",
        category: "colubrids",
        difficulty: "beginner",
        description: "One of the most popular pet snakes. Hardy, easy to care for, and comes in many beautiful color morphs.",
        specifications: {
            "Size": "3-5 feet",
            "Lifespan": "15-20 years",
            "Temperature": "75-85°F",
            "Humidity": "40-50%",
            "Diet": "Mice"
        },
        inStock: true,
        rating: 4.9,
        reviews: 203
    },
    {
        id: 3,
        name: "Boa Constrictor",
        breed: "Boa constrictor",
        price: 599,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        category: "boas",
        difficulty: "intermediate",
        description: "A large, impressive snake that grows to substantial size. Requires experienced handling.",
        specifications: {
            "Size": "6-10 feet",
            "Lifespan": "20-30 years",
            "Temperature": "80-85°F",
            "Humidity": "60-70%",
            "Diet": "Rats/Rabbits"
        },
        inStock: true,
        rating: 4.6,
        reviews: 89
    },
    {
        id: 4,
        name: "King Snake",
        breed: "Lampropeltis getula",
        price: 249,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "colubrids",
        difficulty: "beginner",
        description: "Beautiful patterns and colors. Generally docile and easy to care for.",
        specifications: {
            "Size": "3-4 feet",
            "Lifespan": "15-20 years",
            "Temperature": "75-85°F",
            "Humidity": "50-60%",
            "Diet": "Mice"
        },
        inStock: true,
        rating: 4.7,
        reviews: 156
    },
    {
        id: 5,
        name: "Green Tree Python",
        breed: "Morelia viridis",
        price: 899,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
        category: "pythons",
        difficulty: "expert",
        description: "Stunning arboreal python with vibrant green coloration. Requires advanced care.",
        specifications: {
            "Size": "4-6 feet",
            "Lifespan": "15-20 years",
            "Temperature": "78-88°F",
            "Humidity": "70-80%",
            "Diet": "Mice/Rats"
        },
        inStock: true,
        rating: 4.5,
        reviews: 67
    },
    {
        id: 6,
        name: "Milk Snake",
        breed: "Lampropeltis triangulum",
        price: 179,
        image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop",
        category: "colubrids",
        difficulty: "beginner",
        description: "Colorful and docile snake with beautiful banded patterns. Great for beginners.",
        specifications: {
            "Size": "2-4 feet",
            "Lifespan": "15-20 years",
            "Temperature": "75-85°F",
            "Humidity": "50-60%",
            "Diet": "Mice"
        },
        inStock: true,
        rating: 4.8,
        reviews: 134
    },
    {
        id: 7,
        name: "Reticulated Python",
        breed: "Malayopython reticulatus",
        price: 1299,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        category: "pythons",
        difficulty: "expert",
        description: "One of the world's longest snakes. Requires experienced handlers and large enclosures.",
        specifications: {
            "Size": "10-20 feet",
            "Lifespan": "20-30 years",
            "Temperature": "80-85°F",
            "Humidity": "60-70%",
            "Diet": "Large Rats/Rabbits"
        },
        inStock: false,
        rating: 4.3,
        reviews: 45
    },
    {
        id: 8,
        name: "Rosy Boa",
        breed: "Lichanura trivirgata",
        price: 349,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "boas",
        difficulty: "beginner",
        description: "Small, docile boa perfect for beginners. Beautiful coloration and easy care.",
        specifications: {
            "Size": "2-4 feet",
            "Lifespan": "20-30 years",
            "Temperature": "75-85°F",
            "Humidity": "40-50%",
            "Diet": "Mice"
        },
        inStock: true,
        rating: 4.9,
        reviews: 98
    }
];

// Accessories
const accessories = [
    {
        id: 101,
        name: "Glass Terrarium 40 Gallon",
        price: 199,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
        category: "accessories",
        description: "High-quality glass terrarium perfect for most snake species."
    },
    {
        id: 102,
        name: "Heat Mat with Thermostat",
        price: 89,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
        category: "accessories",
        description: "Precise temperature control for your snake's comfort."
    },
    {
        id: 103,
        name: "Snake Hides (Set of 3)",
        price: 45,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
        category: "accessories",
        description: "Natural-looking hides for your snake's security."
    }
];

// All products combined
const allProducts = [...snakeProducts, ...accessories];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    updateCartDisplay();
    updateWishlistDisplay();
    setupEventListeners();
});

// Initialize the application
function initializeApp() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Load products into the grid
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    let filteredProducts = allProducts;
    
    if (filter !== 'all') {
        filteredProducts = allProducts.filter(product => product.difficulty === filter);
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-breed">${product.breed || 'Accessory'}</p>
                <div class="product-price">$${product.price}</div>
                ${product.rating ? `
                    <div class="product-rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}</span>
                        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                ` : ''}
                <div class="product-actions">
                    <button class="btn btn-outline btn-small" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event to product cards for details
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const productId = parseInt(this.dataset.productId);
                showProductDetails(productId);
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadProducts(this.dataset.filter);
        });
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });

    // Modal controls
    setupModalControls();
}

// Setup modal controls
function setupModalControls() {
    // Cart modal
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => showCart());
    }
    
    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => hideModal(cartModal));
    }

    // User modal
    const userBtn = document.getElementById('userBtn');
    const userModal = document.getElementById('userModal');
    const closeUser = document.getElementById('closeUser');
    
    if (userBtn && userModal) {
        userBtn.addEventListener('click', () => showModal(userModal));
    }
    
    if (closeUser && userModal) {
        closeUser.addEventListener('click', () => hideModal(userModal));
    }

    // Form tabs
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const formType = this.dataset.form;
            switchForm(formType);
        });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm = document.getElementById('contactForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

// Search functionality
function performSearch(query) {
    if (!query.trim()) return;
    
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.breed && product.breed.toLowerCase().includes(query.toLowerCase())) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(filteredProducts, query);
}

function displaySearchResults(products, query) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${query}"</h3>
                <p>Try searching for different terms or browse our categories.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = `
        <div class="search-results-header">
            <h3>Search Results for "${query}" (${products.length} found)</h3>
        </div>
    ` + products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-breed">${product.breed || 'Accessory'}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-outline btn-small" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter by category
function filterByCategory(category) {
    const filteredProducts = allProducts.filter(product => product.category === category);
    displaySearchResults(filteredProducts, category);
}

// Cart functionality
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('snakeCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (!cartModal || !cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Your cart is empty</h3>
                <p>Add some snakes to get started!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    showModal(cartModal);
}

// Wishlist functionality
function toggleWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist`);
    }
    
    saveWishlist();
    updateWishlistDisplay();
}

function saveWishlist() {
    localStorage.setItem('snakeWishlist', JSON.stringify(wishlist));
}

function updateWishlistDisplay() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// Product details modal
function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const productModal = document.getElementById('productModal');
    const productModalTitle = document.getElementById('productModalTitle');
    const productDetails = document.getElementById('productDetails');
    
    if (!productModal || !productDetails) return;
    
    productModalTitle.textContent = product.name;
    
    productDetails.innerHTML = `
        <div class="product-details">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-details-info">
                <h3>${product.name}</h3>
                <div class="price">$${product.price}</div>
                <p class="description">${product.description}</p>
                ${product.specifications ? `
                    <div class="product-specs">
                        <h4>Specifications</h4>
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${key}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i> Add to Wishlist
                    </button>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(productModal);
}

// Modal functions
function showModal(modal) {
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function hideModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

// Form handling
function switchForm(formType) {
    document.querySelectorAll('.form-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.user-form').forEach(form => form.classList.remove('active'));
    
    document.querySelector(`[data-form="${formType}"]`).classList.add('active');
    document.getElementById(`${formType}Form`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
    
    // Simulate login
    currentUser = { email, name: 'User' };
    localStorage.setItem('snakeUser', JSON.stringify(currentUser));
    
    showNotification('Login successful!');
    hideModal(document.getElementById('userModal'));
    updateUserDisplay();
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelectorAll('input[type="password"]')[0].value;
    
    // Simulate registration
    currentUser = { email, name };
    localStorage.setItem('snakeUser', JSON.stringify(currentUser));
    
    showNotification('Registration successful!');
    hideModal(document.getElementById('userModal'));
    updateUserDisplay();
}

function handleContact(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We\'ll get back to you soon.');
    e.target.reset();
}

function updateUserDisplay() {
    const userBtn = document.getElementById('userBtn');
    if (userBtn && currentUser) {
        userBtn.innerHTML = `<i class="fas fa-user-check"></i>`;
        userBtn.title = `Logged in as ${currentUser.name}`;
    }
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please log in to proceed with checkout');
        showModal(document.getElementById('userModal'));
        return;
    }
    
    // Simulate checkout process
    showNotification('Processing your order...');
    
    // Create order
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        trackingNumber: null,
        trackingStatus: null
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('snakeOrders')) || [];
    orders.unshift(order); // Add to beginning of array
    localStorage.setItem('snakeOrders', JSON.stringify(orders));
    
    // Simulate order processing
    setTimeout(() => {
        // Update order status
        order.status = 'processing';
        order.trackingNumber = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
        order.trackingStatus = 'Order confirmed and being prepared for shipment';
        
        // Update stored orders
        const updatedOrders = JSON.parse(localStorage.getItem('snakeOrders'));
        const orderIndex = updatedOrders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            updatedOrders[orderIndex] = order;
            localStorage.setItem('snakeOrders', JSON.stringify(updatedOrders));
        }
        
        showNotification('Order placed successfully! Order #' + order.id);
        cart = [];
        saveCart();
        updateCartDisplay();
        hideModal(document.getElementById('cartModal'));
        
        // Simulate shipping updates
        setTimeout(() => {
            order.status = 'shipped';
            order.trackingStatus = 'Package in transit - Expected delivery in 2-3 business days';
            if (orderIndex !== -1) {
                updatedOrders[orderIndex] = order;
                localStorage.setItem('snakeOrders', JSON.stringify(updatedOrders));
            }
        }, 30000); // 30 seconds for demo
        
        // Simulate delivery
        setTimeout(() => {
            order.status = 'delivered';
            order.trackingStatus = 'Package delivered successfully';
            if (orderIndex !== -1) {
                updatedOrders[orderIndex] = order;
                localStorage.setItem('snakeOrders', JSON.stringify(updatedOrders));
            }
        }, 60000); // 1 minute for demo
        
    }, 2000);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4a7c59;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        color: #ffd700;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize user display if logged in
if (currentUser) {
    updateUserDisplay();
}

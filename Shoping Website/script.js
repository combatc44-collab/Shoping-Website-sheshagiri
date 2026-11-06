
// Get HTML Elements
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");
const noProducts = document.getElementById("noProducts");

// Store products and cart information
let products = [];
let cart = [];

// Fetch Products from JSON File
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        productContainer.innerHTML =
            "<p class='loading'>Error loading products. Please run the project using Live Server.</p>";

        console.error(error);
    }
}

// Display Products Dynamically
function displayProducts(productList) {

    productContainer.innerHTML = "";

    noProducts.hidden = productList.length !== 0;

    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
                loading="lazy"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ★★★★★
                    <span style="color:#888">
                        ${product.rating}
                    </span>
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                    >
                        + Add
                    </button>

                </div>

            </div>
        `;

        productContainer.appendChild(productCard);
    });
}

// Search Products
function searchProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);
}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("input", searchProducts);

// Add Products to Cart
productContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-cart")) {

        const productId = Number(event.target.dataset.id);

        addToCart(productId);
    }

});

function addToCart(productId) {

    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}

// Update Shopping Cart
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p class='empty-cart'>Your cart is empty.</p>";

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-details">

                <h4>${item.name}</h4>

                <p>₹${item.price.toLocaleString("en-IN")}</p>

                <div class="quantity-controls">

                    <button data-action="decrease" data-id="${item.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button data-action="increase" data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Remove ${item.name}"
            >
                ×
            </button>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent =
        "₹" + total.toLocaleString("en-IN");

}

// Cart Quantity and Remove Buttons
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    } else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(item => item.id !== productId);

        }

    } else if (action === "remove") {

        cart = cart.filter(item => item.id !== productId);

    }

    updateCart();

});

// Open Cart
cartButton.addEventListener("click", function() {

    cartOverlay.classList.add("active");

});

// Close Cart
closeCart.addEventListener("click", function() {

    cartOverlay.classList.remove("active");

});

// Close Cart by Clicking Outside
cartOverlay.addEventListener("click", function(event) {

    if (event.target === cartOverlay) {

        cartOverlay.classList.remove("active");

    }

});

// Checkout Button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping with ShopZone! " +
        "Your total is " + cartTotal.textContent
    );

    cart = [];

    updateCart();

    cartOverlay.classList.remove("active");

});

// Start Website
loadProducts();

updateCart();

// ===== Product Data =====
const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2499, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 4999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Casual T-Shirt", category: "Fashion", price: 599, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Running Shoes", category: "Fashion", price: 3299, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Coffee Maker", category: "Home", price: 2199, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Smart LED Lamp", category: "Home", price: 999, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" },
  { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 1699, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80" },
  { id: 8, name: "Sunglasses", category: "Fashion", price: 899, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80" },
];

// ===== State =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let activeCategory = "All";
let searchTerm = "";

// ===== Render Products =====
function renderProducts() {
  const container = document.getElementById("productContainer");

  // Filter by category and search term
  let filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }

  container.innerHTML = filtered
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <span class="category">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="price">₹${p.price}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    `
    )
    .join("");
}

// ===== Cart Functions =====
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p>Your cart is empty.</p>`;
  } else {
    cartItemsDiv.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="info">
            <p>${item.name}</p>
            <p>₹${item.price} x ${item.qty}</p>
          </div>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `
      )
      .join("");
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice;
}

// ===== Cart Sidebar Toggle =====
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

// ===== Event Listeners =====
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("clearCartBtn").addEventListener("click", clearCart);

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderProducts();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

// ===== Initial Load =====
renderProducts();
renderCart();

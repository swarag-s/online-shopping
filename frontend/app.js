const API = "http://localhost:3000";

/* ── session ── */
function getUser() { try { return JSON.parse(localStorage.getItem("shop_user")); } catch { return null; } }
function setUser(u) { localStorage.setItem("shop_user", JSON.stringify(u)); }
function clearUser() { localStorage.removeItem("shop_user"); }
function requireAuth() { const u = getUser(); if (!u) { window.location.href = "index.html#home-auth-section"; return null; } return u; }

/* ── cart ── */
function getCart() { try { return JSON.parse(localStorage.getItem("shop_cart")) || []; } catch { return []; } }
function setCart(c) { localStorage.setItem("shop_cart", JSON.stringify(c)); }

function addToCart(product) {
  const cart = getCart();
  const ex = cart.find(i => i.id === product.id);
  if (ex) {
    if (ex.qty >= product.stock) { showToast("Maximum stock reached", "error"); return; }
    ex.qty++;
  } else {
    if (product.stock < 1) { showToast("Out of stock", "error"); return; }
    cart.push({ id: product.id, name: product.name, price: product.price, stock: product.stock, qty: 1 });
  }
  setCart(cart);
  updateCartCount();
  showToast(`Added to cart — ${product.name}`, "success");
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const n = getCart().reduce((s, i) => s + i.qty, 0);
  el.textContent = n;
  el.style.display = n > 0 ? "block" : "none";
}

/* ── toast ── */
function showToast(msg, type = "success") {
  let c = document.querySelector(".toast-container");
  if (!c) { c = document.createElement("div"); c.className = "toast-container"; document.body.appendChild(c); }
  const t = document.createElement("div");
  const icon = type === "success" ? "✓" : "✕";
  t.className = `toast ${type}`;
  t.innerHTML = `<span style="font-weight:700;">${icon}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ── header builder ── */
function buildHeader(activePage) {
  const user = getUser();
  const cartN = getCart().reduce((s, i) => s + i.qty, 0);
  return `
  <div class="top-bar">
    Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code <strong>FIRST10</strong> for 10% off
  </div>
  <header class="header">
    <div class="header-inner">
      <a href="index.html" class="logo">Shop<span class="logo-dot">Easy</span></a>

      <div class="header-search">
        <input type="text" placeholder="Search products, brands and more..." id="search-input" onkeydown="handleSearch(event)" />
        <button onclick="doSearch()">🔍</button>
      </div>

      <div class="header-actions">
        ${user
          ? `<span class="header-user-badge">Hi, ${user.name.split(" ")[0]}</span>`
          : `<a href="index.html#home-auth-section" class="btn btn-outline-green btn-sm">Login</a>`
        }
        <a href="cart.html" class="header-btn ${activePage === "cart" ? "active" : ""}">
          <span class="icon">🛒</span>
          <span>Cart</span>
          <span class="cart-count" id="cart-count" style="display:${cartN > 0 ? "block" : "none"}">${cartN}</span>
        </a>
        <a href="history.html" class="header-btn ${activePage === "history" ? "active" : ""}">
          <span class="icon">📦</span>
          <span>Orders</span>
        </a>
        ${user ? `<button class="header-btn" onclick="logout()"><span class="icon">🚪</span><span>Logout</span></button>` : ""}
      </div>
    </div>
  </header>
  <nav class="nav-bar">
    <div class="nav-bar-inner">
      <a href="index.html"     ${activePage === "home"     ? 'class="active"' : ""}>Home</a>
      <a href="products.html"  ${activePage === "products" ? 'class="active"' : ""}>All Products</a>
      <a href="cart.html"      ${activePage === "cart"     ? 'class="active"' : ""}>My Cart</a>
      <a href="history.html"   ${activePage === "history"  ? 'class="active"' : ""}>My Orders</a>
    </div>
  </nav>`;
}

function logout() { clearUser(); setCart([]); window.location.href = "index.html"; }

/* ── search ── */
function handleSearch(e) { if (e.key === "Enter") doSearch(); }
function doSearch() {
  const q = document.getElementById("search-input")?.value.trim();
  if (q) window.location.href = `products.html?q=${encodeURIComponent(q)}`;
}

/* ── product helpers ── */
const PRODUCT_ICONS = ["🎧", "⌨️", "🔌", "📷", "🖱️", "💡", "📱", "🖥️", "💾", "🖨️", "📺", "🔋"];
const FAKE_RATINGS  = [4.2, 4.5, 4.0, 4.7, 3.9, 4.3, 4.6, 4.1, 4.8, 4.4];

function getIcon(id) { return PRODUCT_ICONS[(id - 1) % PRODUCT_ICONS.length]; }
function getRating(id) { return FAKE_RATINGS[(id - 1) % FAKE_RATINGS.length].toFixed(1); }
function getMRP(price) { return Math.round(price * 1.25); }
function getDiscount(price) { const mrp = getMRP(price); return Math.round((mrp - price) / mrp * 100); }
function getReviews(id) { return [128, 342, 89, 512, 67, 203, 441, 156, 290, 378][(id - 1) % 10]; }

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - half);
}

/* ── format ── */
function rupee(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }

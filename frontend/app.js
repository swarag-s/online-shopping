const API = "";

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
  const icon = type === "success" ? "<i class='ph ph-check-circle' style='font-size:1.1rem;'></i>" : "<i class='ph ph-x-circle' style='font-size:1.1rem;'></i>";
  t.className = `toast ${type}`;
  t.innerHTML = `<span style="font-weight:700; display:flex; align-items:center;">${icon}</span> ${msg}`;
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
        <button onclick="doSearch()"><i class="ph ph-magnifying-glass"></i></button>
      </div>

      <div class="header-actions">
        ${user
          ? `<span class="header-user-badge">Hi, ${user.name.split(" ")[0]}</span>`
          : `<a href="index.html#home-auth-section" class="btn btn-outline-green btn-sm">Login</a>`
        }
        <a href="cart.html" class="header-btn ${activePage === "cart" ? "active" : ""}">
          <span class="icon"><i class="ph ph-shopping-cart"></i></span>
          <span>Cart</span>
          <span class="cart-count" id="cart-count" style="display:${cartN > 0 ? "block" : "none"}">${cartN}</span>
        </a>
        <a href="history.html" class="header-btn ${activePage === "history" ? "active" : ""}">
          <span class="icon"><i class="ph ph-package"></i></span>
          <span>Orders</span>
        </a>
        ${user ? `<button class="header-btn" onclick="logout()"><span class="icon"><i class="ph ph-sign-out"></i></span><span>Logout</span></button>` : ""}
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
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
  "https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=500&q=80",
  "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500&q=80",
  "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=500&q=80",
  "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
  "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
  "https://images.unsplash.com/photo-1586953208448-b95a79201389?w=500&q=80",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
  "https://images.unsplash.com/photo-1563208221-66c3038d17f4?w=500&q=80",
  "https://images.unsplash.com/photo-1554522434-d0231ccf6eb2?w=500&q=80",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80"
];
const FAKE_RATINGS  = [4.2, 4.5, 4.0, 4.7, 3.9, 4.3, 4.6, 4.1, 4.8, 4.4];

function getIcon(id) { 
  const src = PRODUCT_IMAGES[(id - 1) % PRODUCT_IMAGES.length];
  return `<img src="${src}" alt="Product" style="width:100%; height:100%; object-fit:cover; border-radius:inherit; display:block;" />`;
}
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

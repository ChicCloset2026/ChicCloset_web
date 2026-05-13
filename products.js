let selectedTop = null;
let selectedPants = null;
let selectedShoes = null;

// ================== Product Data ==================

// Get product data from HTML data attributes
const productData = document.body.dataset;

// Create product object using data from the page
let product = {
  name: productData.name,
  price: Number(productData.price),
  image: productData.image,
  page: productData.page
};

// ================== Message System ==================

// Function to show success/error messages to the user
function showMessage(text, type) {
  const msg = document.getElementById("message");
  if (!msg) return;

  msg.textContent = text;
  msg.className = "message " + type;
  msg.style.display = "block";

  // Hide message after 3 seconds
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

// ================== Size Validation ==================

// Check if required sizes are selected before adding to cart
function validateSizes() {

  const hasTop = document.getElementById("topSize") || document.getElementById("size");
  const hasPants = document.getElementById("pantsSize")|| document.getElementById("skirtSize");
  const hasShoes = document.getElementById("shoesSize") || document.getElementById("heelsSize");

  // If any required size is missing, show error message
  if (
    (hasTop && !selectedTop) ||
    (hasPants && !selectedPants) ||
    (hasShoes && !selectedShoes)
  ) {
    showMessage("⚠️ Please Select All Sizes", "error");
    return false;
  }

  return true;
}

// ================== Size Button Selection ==================

// Setup click events for size buttons (top, pants, shoes)
function setupSizeButtons(containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll(".size");

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {

      // Remove selection from all buttons
      buttons.forEach(b => b.classList.remove("selected"));

      // Add selection to clicked button
      this.classList.add("selected");

      // Store selected size based on type
      if (type === "top") selectedTop = this.textContent;
      if (type === "pants") selectedPants = this.textContent;
      if (type === "shoes") selectedShoes = this.textContent;

      checkIfInCart();
    });
  });
}

// ================== Wishlist System ==================

// Setup favorite (wishlist) functionality
function setupWishlist() {
  const heartBtn = document.querySelector(".heart-btn");
  if (!heartBtn) return;

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if product already exists in favorites
  function checkStatus() {
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.find(p => p.name === product.name)) {
      heartBtn.classList.add("liked");
      heartBtn.innerHTML = "♥️";
    } else {
      heartBtn.classList.remove("liked");
      heartBtn.innerHTML = "♡";
    }
  }

  checkStatus();

  // Add or remove product from favorites on click
  heartBtn.onclick = function () {
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let index = favorites.findIndex(item => item.name === product.name);

    // If product already exists → remove it
    if (index !== -1) {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      this.classList.remove("liked");
      this.innerHTML = "♡";
      showMessage("Removed from favorites", "error");
      return;
    }

    // Otherwise add product to favorites
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    this.classList.add("liked");
    this.innerHTML = "♥️";
    showMessage("❤️ Added to favorites", "success");
  };
}

// ================== Add To Cart ==================

// Setup add-to-cart button functionality
function setupCart() {
  const addBtn = document.querySelector(".add");
  if (!addBtn) return;

  addBtn.onclick = function () {

    if (!validateSizes()) return;

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      const pendingItem = {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        topSize: selectedTop,
        pantsSize: selectedPants,
        shoesSize: selectedShoes,
        page: product.page
      };
      localStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      localStorage.setItem("pendingRedirect", "cart.html");
      showMessage("⚠️ Please login first", "error");
      window.location.href = "login.html";
      return;
    }

    const item = {
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      topSize: selectedTop,
      pantsSize: selectedPants,
      shoesSize: selectedShoes,
      page: product.page
    };

    let cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];

    let exists = cart.find(p =>
      p.name === item.name &&
      p.topSize === item.topSize &&
      p.pantsSize === item.pantsSize &&
      p.shoesSize === item.shoesSize
    );

    if (exists) {
      exists.quantity++;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart_" + user.email, JSON.stringify(cart));

    updateCartCount();
    showMessage("Added To Cart 🛒", "success");
  };
}
// ================== Buy Now ==================

function setupBuy() {

  const buyBtn = document.querySelector(".buy");
  if (!buyBtn) return;

  buyBtn.onclick = function () {

    if (!validateSizes()) return;

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        const pendingItem = {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        topSize: selectedTop,
        pantsSize: selectedPants,
        shoesSize: selectedShoes,
        page: product.page
      };
      localStorage.setItem("pendingCartItem", JSON.stringify(pendingItem));
      localStorage.setItem("pendingRedirect", "checkout.html");
      showMessage("⚠️ Please login first", "error");
      window.location.href = "login.html";
      return;
    }

    const item = {
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      topSize: selectedTop,
      pantsSize: selectedPants,
      shoesSize: selectedShoes,
      page: product.page
    };

    let cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];

    let exists = cart.find(p =>
      p.name === item.name &&
      p.topSize === item.topSize &&
      p.pantsSize === item.pantsSize &&
      p.shoesSize === item.shoesSize
    );

    if (exists) {
      exists.quantity++;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart_" + user.email, JSON.stringify(cart));

    updateCartCount();

    window.location.href = "checkout.html";
  };
}

// ================== Cart Count ==================

// Update cart icon number
function updateCartCount() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  let cart = [];

  if (user) {
    cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];
  }

  let totalQty = 0;

  cart.forEach(item => {
    totalQty += item.quantity;
  });

  let count = document.getElementById("cart-count");
  if (count) count.textContent = totalQty;
}

// ================== INIT (Page Load) ==================
function checkIfInCart() {

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];

  const exists = cart.find(item =>
    item.name === product.name &&
    item.topSize === selectedTop &&
    item.pantsSize === selectedPants &&
    item.shoesSize === selectedShoes
  );

  const addBtn = document.querySelector(".add");
  if (!addBtn) return;

  if (exists) {
    addBtn.textContent = "Added ✓";
    addBtn.style.background = "#222";
  } else {
    addBtn.textContent = "Add to Cart";
    addBtn.style.background = "#c89b7b";
  }
}

// Run all functions after page loads
document.addEventListener("DOMContentLoaded", function () {

  // Setup size selection depending on available sections
  if (document.getElementById("topSize")) {
    setupSizeButtons("topSize", "top");
  }

  if (document.getElementById("size")) {
    setupSizeButtons("size", "top");
  }

  if (document.getElementById("pantsSize")) {
    setupSizeButtons("pantsSize", "pants");
  }

  if (document.getElementById("skirtSize")) {
    setupSizeButtons("skirtSize", "pants");
  }

  if (document.getElementById("shoesSize")) {
    setupSizeButtons("shoesSize", "shoes");
  }

  if (document.getElementById("heelsSize")) {
    setupSizeButtons("heelsSize", "shoes");
  }

  // Initialize features
  setupWishlist();
  setupCart();
  setupBuy();
  updateCartCount();
  checkIfInCart();

});
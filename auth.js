/* =========================================================
                     NAVBAR
========================================================= */
// Update the navbar based on the login status
function updateNavbar() {
  // Retrieve the currently logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Select the login link and logout button from the page
  const loginLink = document.getElementById("login-link");
  const logoutBtn = document.getElementById("logout-btn");

  // If a user is logged in
  if (user) {

    // Extract the username from the email (text before @)
    const username = user.email.split("@")[0];

    // Replace the Login text with the username and user icon
   loginLink.innerHTML = `
  <i class="fa-solid fa-user"></i> ${username}
  `;

   loginLink.href = "profile.html";

    // Show the logout button
    logoutBtn.style.display = "block";

  } else {

    // If no user is logged in, show the default Login text
    loginLink.innerHTML = `
      <i class="fa-solid fa-user"></i> Login
    `;

    // Hide the logout button
    logoutBtn.style.display = "none";
  }
}

// Run the navbar update immediately when the page loads
updateNavbar();



// Log out the current user
function logout() {
  localStorage.removeItem("currentUser");
  alert("Logged out!");

  // Redirect the user to the home page
  window.location.href = "home.html";
}

/* =========================================================
   Basic Functions to get elements and show errors
========================================================= */
function get(id) {
  return document.getElementById(id);
}

/*
  Show or hide validation error messages
  and toggle input error styling
*/
function setError(id, msg, inputId) {
  const errorEl = get(id);
  const inputEl = get(inputId);

  if (errorEl) errorEl.textContent = msg;

  if (inputEl) {
    if (msg) {
      inputEl.classList.add("is-invalid"); // show red border
    } else {
      inputEl.classList.remove("is-invalid"); // remove red border
    }
  }
}

/* =========================================================
   Validation Patterns
   Used to validate email format
========================================================= */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =========================================================
   UI Icons Handler
   Controls visibility of clear buttons and password toggle
========================================================= */
function handleIcons() {
  const email = get("email");
  const pass = get("password");

  const emailClear = document.querySelector(".clear-btn-e");
  const passClear = document.querySelector(".clear-btn-p");
  const passHide = document.querySelector(".hide-btn-p");

  if (emailClear) emailClear.style.display = email?.value ? "block" : "none";
  if (passClear) passClear.style.display = pass?.value ? "block" : "none";
  if (passHide) passHide.style.display = pass?.value ? "block" : "none";
}

/* =========================================================
   Real-time Validation Handler
   Improves UX by clearing errors only when input becomes valid
========================================================= */
document.addEventListener("input", (e) => {
  handleIcons();

  // Email validation live check
  if (e.target.id === "email") {
    const val = e.target.value.trim();

    if (emailPattern.test(val) || val === "") {
      setError("emailError", "", "email");
    }
  }

  // Password validation live check
  if (e.target.id === "password") {
    const val = e.target.value.trim();

    if (val.length >= 8 || val === "") {
      setError("passwordError", "", "password");
    }
  }
});

/* =========================================================
   Create new account
========================================================= */
function register() {
  const email = get("email")?.value.trim();
  const pass = get("password")?.value.trim();
  let hasError = false;

  // Validate email
  if (!email) {
    setError("emailError", "Email is required", "email");
    hasError = true;
  }

  if (email && !emailPattern.test(email)) {
    setError("emailError", "Invalid format (example: name@example.com)", "email");
    hasError = true;
  }

  // Validate password
  if (!pass) {
    setError("passwordError", "Password is required", "password");
    hasError = true;
  } else if (pass.length < 8) {
    setError("passwordError", "Password must be at least 8 characters", "password");
    hasError = true;
  } else if (!/[A-Z]/.test(pass)) {
    setError("passwordError", "Add at least one uppercase letter (A-Z)", "password");
    hasError = true;
  }

  if (hasError) return;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    setError("emailError", "This email is already registered", "email");
    return;
  }

  // Save user
  users.push({ email, password: pass });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully! 🎉");
  window.location.href = "login.html";
}

/* =========================================================
   Check login data
========================================================= */
function login() {
  const email = get("email")?.value.trim();
  const pass = get("password")?.value.trim();
  let hasError = false;

  // Email validation
  if (!email) {
    setError("emailError", "Email is required", "email");
    hasError = true;
  }

  if (email && !emailPattern.test(email)) {
    setError("emailError", "Invalid format (example: name@example.com)", "email");
    hasError = true;
  }

  // Password validation
  if (!pass) {
    setError("passwordError", "Password is required", "password");
    hasError = true;
  }

  // Stop if any validation error exists
  if (hasError) return;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check credentials
  const user = users.find(u => u.email === email && u.password === pass);

  if (!user) {
    setError("passwordError", "Incorrect email or password", "password");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  const pendingItem = JSON.parse(localStorage.getItem("pendingCartItem"));
if (pendingItem) {
  let cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];

  let exists = cart.find(p =>
    p.name === pendingItem.name &&
    p.topSize === pendingItem.topSize &&
    p.pantsSize === pendingItem.pantsSize &&
    p.shoesSize === pendingItem.shoesSize
  );

  if (exists) {
    exists.quantity++;
  } else {
    cart.push(pendingItem);
  }

  localStorage.setItem("cart_" + user.email, JSON.stringify(cart));
  localStorage.removeItem("pendingCartItem");


}

  alert("Login successful! 🎉");

// Check if user came from Buy Now
const pendingRedirect = localStorage.getItem("pendingRedirect");

if (pendingRedirect) {

  // Remove redirect after using it
  localStorage.removeItem("pendingRedirect");

  // Go to checkout page
  window.location.href = pendingRedirect;

} else {

  // Normal login redirect
  window.location.href = "home.html";
}
}

/* =========================================================
   Clear inputs and toggle password
========================================================= */

// Clear email input
function clearEmail() {
  const e = get("email");
  if (e) e.value = "";
  setError("emailError", "", "email");
  handleIcons();
}

// Clear password input
function clearPass() {
  const p = get("password");
  if (p) p.value = "";
  setError("passwordError", "", "password");
  handleIcons();
}

// Toggle password visibility
function hidePass() {
  const p = get("password");
  if (p) p.type = p.type === "password" ? "text" : "password";
}

/* =========================================================
   Reset password by email
========================================================= */
function resetPassword() {
  const email = get("email")?.value.trim();

  if (!email || !emailPattern.test(email)) {
    setError("emailError", "Enter a valid email to reset", "email");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const index = users.findIndex(u => u.email === email);

  if (index === -1) {
    setError("emailError", "Email not found in our records", "email");
    return;
  }

  const newPass = prompt("Enter new password (8+ chars, 1 uppercase)");

  if (newPass && newPass.length >= 8 && /[A-Z]/.test(newPass)) {
    users[index].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated! 🎉");
    window.location.href = "login.html";
  } else if (newPass) {
    alert("Password must have 8+ chars and one uppercase letter.");
  }
}

/* =========================================================
   Run when page loads
========================================================= */
window.addEventListener("DOMContentLoaded", handleIcons);

// Expose functions to HTML
window.login = login;
window.register = register;
window.resetPassword = resetPassword;
window.clearEmail = clearEmail;
window.clearPass = clearPass;
window.hidePass = hidePass;

/* =========================================================
                     Cart Count
========================================================= */
  // Update cart icon number in the navbar
  function updateCartCount() {

    // Get current logged-in user
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Initialize cart array
    let cart = [];

    // Load user's cart if logged in
    if (user) {
      cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];
    }

    // Calculate total quantity of all items
    let totalQty = 0;

    cart.forEach(item => {
      totalQty += Number(item.quantity);
    });

    // Update the cart count element
    let count = document.getElementById("cart-count");

    if (count) {
      count.textContent = totalQty;
    }
  }

  // Run cart count update when page loads
  updateCartCount();

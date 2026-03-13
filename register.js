const URL_HOST = "https://flash-card-backend-ibve.onrender.com";

const toggle = document.getElementById("toggleAuth");
const loginForm = document.getElementById("loginForm");
const signUpForm = document.getElementById("signupForm");
const switchText = document.getElementById("switchText");
const authTitle = document.getElementById("authTitle");

const isLoginVisible = !loginForm.classList.contains("hidden");
const isSignupVisible = !signUpForm.classList.contains("hidden");

let loginMode = false;

toggle.addEventListener("click", function (e) {
  e.preventDefault();

  if (loginMode) {
    loginForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");

    authTitle.textContent = "Create your account";
    switchText.textContent = "Already have an account?";
    toggle.textContent = "Login";
  } else {
    signUpForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

    authTitle.textContent = "Login to continue studying";
    switchText.textContent = "Don't have an account?";
    toggle.textContent = "Sign up";
  }

  loginMode = !loginMode;
});

function createErrorElement(submitButton) {
  let el = document.getElementById("error-message");
  if (!el) {
    el = document.createElement("p");
    el.id = "error-message";
    el.className = "error-message";
    submitButton.parentNode.insertBefore(el, submitButton);
  }
  return el;
}

function showError(msg, submitButton) {
  const el = createErrorElement(submitButton);
  el.textContent = msg;
}

function clearError() {
  const el = document.getElementById("error-message");
  if (el) el.textContent = "";
}

function validEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Login handler
async function handleLoginSubmit(event) {
  event.preventDefault();
  clearError();

  const emailInput = document.querySelector("#loginForm #email");
  const passwordInput = document.querySelector("#loginForm #password");
  const submitButton = document.querySelector("#loginForm button");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validation
  if (!email) {
    showError("Email is required.", submitButton);
    return;
  }
  if (!validEmail(email)) {
    showError("Please enter a valid email address.", submitButton);
    return;
  }
  if (!password) {
    showError("Password is required.", submitButton);
    return;
  }

  submitButton.disabled = true;

  try {
    const res = await fetch(`${URL_HOST}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      showError(data.message || "Login failed.", submitButton);
      return;
    }

    if (data.token) {
      console.log(data);

      localStorage.setItem("authToken", data.token);
      sessionStorage.setItem("name", data.user.fullName);
      sessionStorage.setItem("subjects", data.subjects);
      sessionStorage.setItem("cards", data.cards);
    }

    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error(err);
    showError("Network error. Please try again.", submitButton);
  } finally {
    submitButton.disabled = false;
  }
}

// Signup handler
async function handleSignupSubmit(event) {
  event.preventDefault();
  clearError();
  console.log("START SIGN UP");

  const fullNameInput = document.querySelector("#signupForm #fullName");
  const emailInput = document.querySelector("#signupForm #email");
  const passwordInput = document.querySelector("#signupForm #password");
  const submitButton = document.querySelector("#signupForm button");

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  console.log({ fullName, email, password });

  // Validation
  if (!fullName) {
    showError("Full name is required.", submitButton);
    return;
  }
  if (!email) {
    showError("Email is required.", submitButton);
    return;
  }
  if (!validEmail(email)) {
    showError("Please enter a valid email address.", submitButton);
    return;
  }
  if (!password) {
    showError("Password is required.", submitButton);
    return;
  }
  if (password.length < 6) {
    showError("Password must be at least 6 characters.", submitButton);
    return;
  }

  submitButton.disabled = true;

  try {
    const res = await fetch(`${URL_HOST}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      showError(data.message || "Signup failed.", submitButton);
      return;
    }

    if (data.token) {
      localStorage.setItem("authToken", data.token);
      sessionStorage.setItem("name", fullName);
      sessionStorage.setItem("subjects", data.subjects);
      sessionStorage.setItem("cards", data.cards);
    }

    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error(err);
    showError("Network error. Please try again.", submitButton);
  } finally {
    submitButton.disabled = false;
  }
}

loginForm.addEventListener("submit", handleLoginSubmit);
signUpForm.addEventListener("submit", handleSignupSubmit);

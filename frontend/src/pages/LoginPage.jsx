/* ===== REACT ===== */

import { useState } from "react";

/* ===== ROUTER ===== */

import { API_URL } from "../services/api.config";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

/* ===== ICONS ===== */

import { FiEye, FiEyeOff, FiX } from "react-icons/fi";

/* ===== LOGIN PAGE ===== */

function LoginPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const verified = searchParams.get("verified");

  const [isLoginOpen, setIsLoginOpen] = useState(
    verified === "success" || verified === "invalid" || verified === "error",
  );

  const [error, setError] = useState(() => {
    if (verified === "invalid") {
      return "Verification link is invalid or expired.";
    }

    if (verified === "error") {
      return "Something went wrong during verification.";
    }

    return "";
  });

  const [message, setMessage] = useState(() => {
    if (verified === "success") {
      return "Account verified successfully. You can now log in.";
    }

    return "";
  });

  const [showPassword, setShowPassword] = useState(false);

  /* ===== VALIDATION ===== */

  function validateLoginForm(email, password) {
    if (!email.includes("@")) {
      throw new Error("Email must be valid");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
  }

  /* ===== LOGIN ===== */

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const formData = new FormData(event.target);

    const email = formData.get("email");

    const password = formData.get("password");

    try {
      validateLoginForm(email, password);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      event.target.reset();

      setShowPassword(false);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  /* ===== JSX ===== */

  return (
    <div className="auth-home-page">
      <section className="auth-home-hero">
        <div className="auth-home-topbar">
          <h1>SmartBank</h1>

          <button
            className="auth-home-login-button"
            onClick={() => setIsLoginOpen(true)}
          >
            כניסה לחשבון
          </button>
        </div>

        <div className="auth-home-content">
          <p className="auth-home-label">Digital Banking</p>

          <h2>Banking made simple</h2>

          <p>
            Manage your money securely, track your balance, and transfer funds
            from one clean banking dashboard.
          </p>

          <div className="auth-home-actions">
            <Link className="secondary-auth-link" to="/register">
              פתיחת חשבון
            </Link>
          </div>
        </div>
      </section>

      {isLoginOpen && (
        <div className="auth-modal-overlay">
          <section className="auth-modal-card">
            <button
              className="auth-modal-close"
              onClick={() => setIsLoginOpen(false)}
              aria-label="Close login modal"
            >
              <FiX />
            </button>

            <h2>Login</h2>

            <p className="auth-subtitle">Welcome back to your account</p>

            {message && <div className="auth-alert success">{message}</div>}

            {error && <div className="auth-alert error">{error}</div>}

            <form onSubmit={handleLogin}>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onInput={(event) => {
                  event.target.value = event.target.value.replace(/[א-ת]/g, "");
                }}
              />

              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button className="primary-button" type="submit">
                Login
              </button>

              <p className="auth-note">
                Your login details are protected and encrypted.
              </p>
            </form>

            <p className="auth-link-text">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

/* ===== EXPORT ===== */

export default LoginPage;

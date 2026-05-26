/* ===== REACT ===== */

import { useState } from "react";

/* ===== ROUTER ===== */

import { API_URL } from "../services/api.config";

import { Link, useNavigate } from "react-router-dom";

/* ===== ICONS ===== */

import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";

/* ===== REGISTER PAGE ===== */

function RegisterPage() {
  const [message, setMessage] = useState("");

  const [sentEmail, setSentEmail] = useState("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /* ===== VALIDATION ===== */

  function validateRegisterForm(fullName, email, password, phone) {
    if (!fullName || fullName.trim().length < 2) {
      throw new Error("Full name must contain at least 2 characters");
    }

    if (!email.includes("@")) {
      throw new Error("Email must be valid");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    if (!/^\d{10}$/.test(phone)) {
      throw new Error("Phone must contain exactly 10 digits");
    }
  }

  /* ===== REGISTER ===== */

  async function handleRegister(event) {
    event.preventDefault();

    setMessage("");

    setError("");

    setIsLoading(true);

    const formData = new FormData(event.target);

    const fullName = formData.get("fullName");

    const email = formData.get("email");

    const password = formData.get("password");

    const phone = formData.get("phone");

    try {
      validateRegisterForm(fullName, email, password, phone);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Register failed");
      }

      event.target.reset();

      setShowPassword(false);
      setSentEmail(email);
      setMessage("success");

      setTimeout(() => {
        navigate("/");
      }, 8000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  /* ===== JSX ===== */

  return (
    <div className={`auth-page${message ? " auth-success-page" : ""}`}>
      {!message && (
        <section className="auth-hero">
          <h1>SmartBank</h1>

          <h2>Open your account in minutes</h2>

          <p>
            Create a secure account and start managing your money with confidence.
          </p>

          <ul className="hero-highlights">
            <li>Quick setup for your new bank profile</li>
            <li>Verified security for every transfer</li>
            <li>Easily track spending and balance</li>
          </ul>
        </section>
      )}

      <section className="auth-card">
        {message ? (
          <div className="register-success">
            <div className="register-success-card">
              <div className="success-banner">
                <div className="success-icon-wrap">
                  <FiMail />
                </div>

                <div className="success-banner-text">
                  <span className="status-chip">Email sent</span>
                  <h2>Verify your inbox to activate your account</h2>
                </div>
              </div>

              <div className="register-details">
                <p className="register-success-intro">
                  We sent a verification message to:
                </p>

                <div className="register-email-tag">{sentEmail || "your email address"}</div>

                <p>
                  Open the email and click <strong>Verify Account</strong> to complete your
                  SmartBank signup.
                </p>

                <p className="register-note">
                  If you don't see it, check your spam folder or search for "SmartBank"
                  in your inbox.
                </p>
              </div>
            </div>

            <p className="redirect-text">
              Redirecting to login in 8 seconds...
            </p>

            <button className="primary-button" onClick={() => navigate("/")}>
              Go To Login
            </button>
          </div>
        ) : (
          <>
            <h2>Register</h2>

            <p className="auth-subtitle">Create your SmartBank account</p>

            <form onSubmit={handleRegister}>
              <input name="fullName" type="text" placeholder="Full name" />

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
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <input
                name="phone"
                type="text"
                placeholder="Phone number"
                maxLength="10"
                onInput={(event) => {
                  event.target.value = event.target.value.replace(/\D/g, "");
                }}
              />

              <button
                className="primary-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <p className="auth-link-text">
              Already have an account?
              <Link to="/">Login</Link>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

/* ===== EXPORT ===== */

export default RegisterPage;
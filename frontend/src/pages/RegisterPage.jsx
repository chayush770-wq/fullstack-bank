/* ===== REACT ===== */

import { useState } from "react";

/* ===== ROUTER ===== */

import { Link, useNavigate } from "react-router-dom";

/* ===== ICONS ===== */

import { FiEye, FiEyeOff } from "react-icons/fi";

/* ===== REGISTER PAGE ===== */

function RegisterPage() {
  const [message, setMessage] = useState("");

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

      const response = await fetch("http://localhost:3000/api/auth/register", {
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
    <div className="auth-page">
      <section className="auth-hero">
        <h1>SmartBank</h1>

        <h2>Open your account in minutes</h2>

        <p>
          Create a secure account and start managing your money with confidence.
        </p>
      </section>

      <section className="auth-card">
        {message ? (
          <div className="register-success">
            <div className="success-icon">✅</div>

            <h2>Account Created</h2>

            <p>
              We sent a verification email.
              <br />
              <br />
              Please open your inbox and click:
              <br />
              <strong>Verify Account</strong>
            </p>

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
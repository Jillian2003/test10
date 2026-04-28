import { useState } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

function Footer({ user, isLoggedIn, onLoginSuccess, onLogout }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = (userData) => {
    onLoginSuccess(userData);
    setShowLogin(false);
  };

  const handleSignupSuccess = (userData) => {
    onLoginSuccess(userData);
    setShowSignup(false);
  };

  return (
    <>
      <footer className="app-footer border-top">
        <div className="container d-flex align-items-center justify-content-center py-2">
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                Logged in as: <strong>{user?.username || user?.email}</strong>
                {user?.role === "admin" && <span className="badge bg-primary ms-2">Admin</span>}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </footer>

      {showLogin && (
        <LoginModal
          close={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showSignup && (
        <SignupModal
          close={() => setShowSignup(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </>
  );
}

export default Footer;

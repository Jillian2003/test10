import { useState } from "react";

function Navbar({ user, isLoggedIn, isAdmin, onLogout }) {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  function navButton(hash, label) {
    const isActive = window.location.hash === `#${hash}`;
    return (
      <button
        type="button"
        className={`nav-link btn btn-link px-2 ${isActive ? "active" : ""}`}
        onClick={() => {
          setAdminMenuOpen(false);
          window.location.hash = hash;
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <header className="app-header sticky-top">
      <nav className="navbar navbar-expand bg-body-tertiary border-bottom">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="navbar-brand btn btn-link p-0"
              onClick={() => {
                setAdminMenuOpen(false);
                window.location.hash = "home";
              }}
            >
              Alumni App
            </button>

            <div className="navbar-nav flex-row gap-1">
              {navButton("home", "Home")}

              {isLoggedIn && navButton("users", "Users")}
              {isLoggedIn && navButton("opportunities", "Opportunities")}
              {isLoggedIn && navButton("messages", "Messages")}
              {isLoggedIn && navButton("profile", "Profile")}

              {isAdmin && (
                <div className="nav-item dropdown">
                  <button
                    type="button"
                    className={`nav-link btn btn-link dropdown-toggle px-2 ${
                      window.location.hash.startsWith("#admin-") ? "active" : ""
                    }`}
                    onClick={() => setAdminMenuOpen(open => !open)}
                    aria-expanded={adminMenuOpen}
                  >
                    Admin Panel
                  </button>

                  {adminMenuOpen && (
                    <div className="dropdown-menu show">
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setAdminMenuOpen(false);
                          window.location.hash = "admin-approve-posted";
                        }}
                      >
                        Approve Posted
                      </button>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setAdminMenuOpen(false);
                          window.location.hash = "admin-approve-new-user";
                        }}
                      >
                        Approve New User
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isLoggedIn && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">
                Welcome, {user?.first_name || user?.username}!
              </span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

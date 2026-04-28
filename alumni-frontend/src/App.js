import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Opportunities from "./pages/Opportunities";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import AdminPanel from "./components/AdminPanel";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:2490";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  const isAdminPage =
    window.location.hash === "#admin-approve-posted" ||
    window.location.hash === "#admin-approve-new-user";

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && window.location.hash !== "#home") {
    window.location.hash = "#home";
  }

  if (!isAdmin && isAdminPage) {
    window.location.hash = "#home";
  }

  const renderPage = () => {
    const hash = window.location.hash.slice(1) || "home";

    switch (hash) {
      case "home":
        return <Home />;
      case "users":
        return isLoggedIn ? <Users /> : <Home />;
      case "opportunities":
        return isLoggedIn ? <Opportunities /> : <Home />;
      case "profile":
        return isLoggedIn ? <Profile /> : <Home />;
      case "messages":
        return isLoggedIn ? <Messages /> : <Home />;
      case "admin-approve-posted":
        return isAdmin ? <AdminPanel mode="approve-posted" /> : <Home />;
      case "admin-approve-new-user":
        return isAdmin ? <AdminPanel mode="approve-new-user" /> : <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="app-main container py-4">
        {renderPage()}
      </main>

      <Footer
        user={user}
        isLoggedIn={isLoggedIn}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;

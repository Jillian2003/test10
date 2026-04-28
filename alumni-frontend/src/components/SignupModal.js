import { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:2490";

function SignupModal({ close, onSignupSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    year_graduated: "",
    major: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState([]);

  // Load majors on mount
  useState(() => {
    fetch(`${API_BASE_URL}/api/majors`)
      .then(res => res.json())
      .then(data => setMajors(Array.isArray(data) ? data : []))
      .catch(() => setMajors([]));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          year_graduated: parseInt(formData.year_graduated, 10),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSignupSuccess?.(data.user);
        close();
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-card__header">
          <h3 className="mb-0">Signup</h3>
          <p className="text-muted mb-0">Create your account.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-card__body">
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Graduation Year</label>
                <input
                  className="form-control"
                  name="year_graduated"
                  type="number"
                  value={formData.year_graduated}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Major</label>
                <select
                  className="form-control"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Major</option>
                  {majors.map(major => (
                    <option key={major._id} value={major._id}>
                      {major.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={close}
                disabled={loading}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;

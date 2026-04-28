import { useEffect, useState, useCallback } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:2490";

function AdminPanel({ mode }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const isApprovePosted = mode === "approve-posted";
  const title = isApprovePosted ? "Approve Posted Opportunities" : "Approve New Users";

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = isApprovePosted ? "/api/admin/opportunities/pending" : "/api/admin/users/pending";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to load items");
      }
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  }, [isApprovePosted]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleApproval = async (itemId, approved) => {
    setProcessing(itemId);
    try {
      const endpoint = isApprovePosted
        ? `/api/admin/opportunities/${itemId}/approve`
        : `/api/admin/users/${itemId}/approve`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        // Remove the item from the list
        setItems(prev => prev.filter(item => item._id !== itemId));
      } else {
        console.error("Failed to process approval");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="content-card">
      <div className="d-flex align-items-baseline justify-content-between flex-wrap gap-2">
        <h2 className="mb-0">Admin Panel</h2>
        <span className="text-muted">{title}</span>
      </div>

      <hr />

      {items.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">No items pending approval</h5>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                {isApprovePosted ? (
                  <>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Posted By</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Year Graduated</th>
                    <th>Major</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  {isApprovePosted ? (
                    <>
                      <td className="fw-semibold">{item.title}</td>
                      <td className="text-capitalize">{item.type}</td>
                      <td>{item.description?.substring(0, 100)}{item.description?.length > 100 ? "..." : ""}</td>
                      <td>{item.postedBy?.username || item.postedBy?.email}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handleApproval(item._id, true)}
                            disabled={processing === item._id}
                          >
                            {processing === item._id ? "..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleApproval(item._id, false)}
                            disabled={processing === item._id}
                          >
                            {processing === item._id ? "..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="fw-semibold">{item.first_name} {item.last_name}</td>
                      <td>{item.email}</td>
                      <td>{item.year_graduated}</td>
                      <td>{item.major?.name || "N/A"}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handleApproval(item._id, true)}
                            disabled={processing === item._id}
                          >
                            {processing === item._id ? "..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleApproval(item._id, false)}
                            disabled={processing === item._id}
                          >
                            {processing === item._id ? "..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminPanel;

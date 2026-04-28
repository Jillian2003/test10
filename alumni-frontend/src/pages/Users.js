import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "";

function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const detailsRef = useRef(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);


  const normalizedUsers = useMemo(() => {
    return users
      .map(u => ({
        id: u._id,
        userName: u.username,
        firstName: u.first_name,
        lastName: u.last_name,
        yearGraduated: u.year_graduated,
        major: u.major?.name || "",
        company: u.company,
        title: u.title,
        email: u.email,
        linkedinLink: u.linkedin_link
      }))
      .filter(u => Boolean(u.id));
  }, [users]);

  const totalPages = Math.max(
    1,
    Math.ceil(normalizedUsers.length / itemsPerPage)
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * itemsPerPage;
  const currentUsers = normalizedUsers.slice(start, start + itemsPerPage);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="content-card">
      <div className="d-flex align-items-baseline justify-content-between flex-wrap gap-2">
        <h2 className="mb-0">Users</h2>
        <span className="text-muted">Showing {itemsPerPage} per page</span>
      </div>

      {selectedUser && (
        <div ref={detailsRef} className="mt-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <h5 className="card-title mb-1">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h5>
                  <div className="text-muted">@{selectedUser.userName}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>

              <div className="row mt-3 g-2">
                <div className="col-md-6">
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Year Graduated</span>
                    <span className="detail-value">
                      {selectedUser.yearGraduated}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Major</span>
                    <span className="detail-value">{selectedUser.major}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-row">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{selectedUser.company}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Title</span>
                    <span className="detail-value">{selectedUser.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">LinkedIn</span>
                    <span className="detail-value">
                      <a
                        href={selectedUser.linkedinLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {selectedUser.linkedinLink}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-3 g-3">
        {currentUsers.map(user => (
          <div className="col-md-6 col-lg-4" key={user.id}>
            <button
              type="button"
              className="card card-hover w-100 text-start"
              onClick={() => {
                setSelectedUser(user);
                setTimeout(() => {
                  detailsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }, 0);
              }}
            >
              <div className="card-body">
                <div className="fw-semibold">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-muted small">@{user.userName}</div>
                <div className="small mt-2">{user.major}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <nav aria-label="Users pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${canGoPrev ? "" : "disabled"}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => {
                  if (!canGoPrev) return;
                  setSelectedUser(null);
                  setPage(p => Math.max(1, p - 1));
                }}
                aria-label="Previous"
                disabled={!canGoPrev}
              >
                Prev
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNumber = idx + 1;
              const isActive = pageNumber === page;
              return (
                <li
                  key={pageNumber}
                  className={`page-item ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => {
                      setSelectedUser(null);
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            <li className={`page-item ${canGoNext ? "" : "disabled"}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => {
                  if (!canGoNext) return;
                  setSelectedUser(null);
                  setPage(p => Math.min(totalPages, p + 1));
                }}
                aria-label="Next"
                disabled={!canGoNext}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
export default Users;

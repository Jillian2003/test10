import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "";


function Opportunities() {
  const [ops, setOps] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedOp, setSelectedOp] = useState(null);
  const detailsRef = useRef(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/opportunities`)
      .then(res => res.json())
      .then(data => setOps(Array.isArray(data) ? data : []))
      .catch(() => setOps([]));
  }, []);

  const normalizedOps = useMemo(() => {
    return ops
      .map(op => ({
        id: op._id,
        title: op.title,
        postedBy: op.posted_by,
        type: op.type,
        description: op.description,
        isPaid: op.is_paid,
        amount: op.amount
      }))
      .filter(op => Boolean(op.id));
  }, [ops]);

  const totalPages = Math.max(1, Math.ceil(normalizedOps.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * itemsPerPage;
  const currentOps = normalizedOps.slice(start, start + itemsPerPage);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="content-card">
      <div className="d-flex align-items-baseline justify-content-between flex-wrap gap-2">
        <h2 className="mb-0">Opportunities</h2>
        <span className="text-muted">Showing {itemsPerPage} per page</span>
      </div>

      {selectedOp && (
        <div ref={detailsRef} className="mt-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <h5 className="card-title mb-1">{selectedOp.title}</h5>
                  <div className="text-muted">
                    Posted by {selectedOp.postedBy} • {selectedOp.type}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedOp(null)}
                >
                  Close
                </button>
              </div>

              <p className="mt-3 mb-2">{selectedOp.description}</p>
              <div className="text-muted small">
                {selectedOp.isPaid ? "Paid" : "Unpaid"}
                {selectedOp.isPaid && selectedOp.amount
                  ? ` — ${selectedOp.amount}`
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-3 g-3">
        {currentOps.map(op => (
          <div className="col-md-6 col-lg-4" key={op.id}>
            <button
              type="button"
              className="card card-hover w-100 text-start"
              onClick={() => {
                setSelectedOp(op);
                setTimeout(() => {
                  detailsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }, 0);
              }}
            >
              <div className="card-body">
                <div className="fw-semibold">{op.title}</div>
                <div className="text-muted small text-capitalize">
                  {op.type} • {op.postedBy}
                </div>
                <div className="small mt-2 clamp-2">{op.description}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <nav aria-label="Opportunities pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${canGoPrev ? "" : "disabled"}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => {
                  if (!canGoPrev) return;
                  setSelectedOp(null);
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
                      setSelectedOp(null);
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            <li className={`page-item ${canGoNext ? "" : "disabled"}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => {
                  if (!canGoNext) return;
                  setSelectedOp(null);
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

export default Opportunities;

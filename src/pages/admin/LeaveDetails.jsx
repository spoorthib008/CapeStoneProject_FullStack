import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function LeaveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/leave/${id}`);
    setLeave(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const setLeaveStatus = async (newStatus) => {
    await api.patch(`/leave/${id}`, { status: newStatus });
    load();
  };

  if (!leave) return <p>Loading...</p>;

  // ✅ Reason: show if present & non-empty; preserve line breaks; safe fallbacks
  const displayReason =
    (leave?.reason && String(leave.reason).trim()) ||
    (leave?.remarks && String(leave.remarks).trim()) ||
    (leave?.note && String(leave.note).trim()) ||
    "";

  return (
    <div className="container py-3">
      <h4 className="mb-3">Leave Details</h4>

      <div className="card p-3">
        <div className="row mb-2">
          <div className="col">
            <strong>Leave ID</strong>
            <div>{leave.id}</div>
          </div>
          <div className="col">
            <strong>Start</strong>
            <div>{leave.startDate}</div>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <strong>End</strong>
            <div>{leave.endDate}</div>
          </div>
          <div className="col">
            <strong>Type</strong>
            <div>{leave.leaveType}</div>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <strong>Status</strong>
            <div>{leave.status}</div>
          </div>
          <div className="col">
            <strong>Reason</strong>
            <div
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              className={displayReason ? "" : "text-muted"}
            >
              {displayReason || "No reason provided"}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn btn-outline-secondary" onClick={load}>
            Refresh
          </button>
          {leave.status === "PENDING" && (
            <>
              <button
                className="btn btn-success"
                onClick={() => setLeaveStatus("APPROVED")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setLeaveStatus("REJECTED")}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

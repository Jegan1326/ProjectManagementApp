import { useState } from "react";

export default function RejectModal({ open, setOpen, milestone, onReject }) {
  const [reason, setReason] = useState("");

  if (!open || !milestone) return null;

  const reject = () => {
    onReject(milestone._id, reason);
    setReason("");
    setOpen(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }}>
      <div style={{ background: "#fff", width: 420, margin: "120px auto", padding: 20, borderRadius: 8 }}>
        <h3>Reject Milestone</h3>
        <p>{milestone.title}</p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reject reason..."
          style={{ width: "100%", height: 90, marginTop: 10 }}
        />

        <div style={{ marginTop: 15 }}>
          <button onClick={reject} style={{ marginRight: 10 }}>
            Reject
          </button>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

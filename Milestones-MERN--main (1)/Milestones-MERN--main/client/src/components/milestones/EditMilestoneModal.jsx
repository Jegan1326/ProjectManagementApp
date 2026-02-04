import { useEffect, useState } from "react";

export default function EditMilestoneModal({ open, setOpen, milestone, onSave, onSubmit }) {
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");

  useEffect(() => {
    if (milestone) {
      setProgress(milestone.progress || 0);
      setDueDate(milestone.dueDate || "");
      setDescription(milestone.description || "");
      setLinks(milestone.links || "");
    }
  }, [milestone]);

  if (!open || !milestone) return null;

  const handleSave = async () => {
    await onSave(milestone._id, { progress, dueDate, description, links });
    setOpen(false);
  };

  const handleSubmit = async () => {
    // Save first to ensure latest data is committed
    await onSave(milestone._id, { progress, dueDate, description, links });
    // Then submit
    await onSubmit(milestone._id);
    setOpen(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: "#e5e7eb", fontSize: 20 }}>Update Milestone</h3>
          <span style={badgeStyle(milestone.status)}>{milestone.status}</span>
        </div>

        {milestone.status === "REJECTED" && milestone.adminComment && (
          <div style={rejectionBox}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Reason for Rejection:</div>
            {milestone.adminComment}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Progress: {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={input}
            />
          </div>
          <div>
            {/* Placeholder for layout balance or future expansions */}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Proof of Work (Link/URL)</label>
          <input
            placeholder="https://github.com/..."
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            style={input}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Notes / Description</label>
          <textarea
            placeholder="Describe what was done..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...input, height: 80, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button style={btnSoft} onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button style={btnSave} onClick={handleSave}>
            Save Draft
          </button>
          <button style={btnSubmit} onClick={handleSubmit}>
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
};

const modal = {
  width: 500, background: "#0b1220", border: "1px solid #374151", borderRadius: 16, padding: 24, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

const labelStyle = { display: "block", marginBottom: 8, fontSize: 13, color: "#9ca3af", fontWeight: 500 };

const input = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #374151", background: "#1f2937", color: "#e5e7eb", outline: "none", boxSizing: "border-box", fontSize: 14
};

const rejectionBox = {
  background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fca5a5", padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 20
};

const btnSoft = {
  padding: "10px 16px", borderRadius: 8, border: "1px solid #374151", background: "transparent", color: "#e5e7eb", fontWeight: 600, cursor: "pointer"
};

const btnSave = {
  padding: "10px 16px", borderRadius: 8, border: "1px solid #4b5563", background: "#4b5563", color: "#fff", fontWeight: 600, cursor: "pointer"
};

const btnSubmit = {
  padding: "10px 16px", borderRadius: 8, border: "1px solid #2563eb", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer"
};

const badgeStyle = (status) => {
  const base = { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 };
  if (status === "DRAFT") return { ...base, background: "#eef2ff", color: "#6366f1" };
  if (status === "REJECTED") return { ...base, background: "#fef2f2", color: "#ef4444" };
  return { ...base, background: "#f3f4f6", color: "#374151" };
};

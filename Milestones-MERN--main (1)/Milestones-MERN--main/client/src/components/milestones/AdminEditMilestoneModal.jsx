import { useEffect, useState } from "react";

export default function AdminEditMilestoneModal({ open, setOpen, milestone, onSave }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [phase, setPhase] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");

  useEffect(() => {
    if (open && milestone) {
      setTitle(milestone.title || "");
      setDueDate(milestone.dueDate || "");
      setAssignedTo(milestone.assignedTo || "");
      setPhase(milestone.phase || "");
      setDescription(milestone.description || "");
      setLinks(milestone.links || "");
    }
  }, [open, milestone]);

  if (!open) return null;

  const save = async () => {
    await onSave(milestone._id, {
      title,
      dueDate,
      assignedTo,
      phase
    });
    setOpen(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginTop: 0, color: "#e5e7eb" }}>Edit Milestone</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={input}
        />

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#9ca3af" }}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ ...input, marginBottom: 0 }}
          />
        </div>

        <input
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Assigned To"
          style={input}
        />

        <input
          list="admin-phase-options"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          placeholder="Phase"
          style={input}
        />
        <datalist id="admin-phase-options">
          <option value="Frontend" />
          <option value="Backend" />
          <option value="Testing" />
          <option value="Documentation" />
        </datalist>

        <div style={{ marginTop: 16, padding: 12, background: "#111827", border: "1px solid #374151", borderRadius: 8 }}>
          <label style={{ display: "block", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 }}>
            Member's Proof Links (Read-Only)
          </label>
          {links ? (
            <a
              href={links.startsWith("http") ? links : `https://${links}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#3b82f6", fontSize: 14, wordBreak: "break-all" }}
            >
              {links} ↗
            </a>
          ) : (
            <span style={{ color: "#6b7280", fontSize: 14, fontStyle: "italic" }}>No links provided</span>
          )}
        </div>

        <div style={{ marginTop: 12, padding: 12, background: "#111827", border: "1px solid #374151", borderRadius: 8 }}>
          <label style={{ display: "block", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 }}>
            Member's Description (Read-Only)
          </label>
          {description ? (
            <div style={{ color: "#e5e7eb", fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{description}</div>
          ) : (
            <span style={{ color: "#6b7280", fontSize: 14, fontStyle: "italic" }}>No description provided</span>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={btnSoft} onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button style={btnSave} onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const modal = {
  width: 420,
  background: "#0b1220",
  border: "1px solid #374151",
  borderRadius: 14,
  padding: 18
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #374151",
  background: "transparent",
  color: "#e5e7eb",
  outline: "none",
  marginBottom: 12,
  boxSizing: "border-box"
};

const btnSoft = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #374151",
  background: "transparent",
  color: "#e5e7eb",
  fontWeight: 700,
  cursor: "pointer"
};

const btnSave = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer"
};

import { useEffect, useState } from "react";

export default function CreateMilestoneModal({ open, setOpen, onCreate, initialPhase }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [phase, setPhase] = useState("");
  const [error, setError] = useState("");

  const isNewPhase = !initialPhase;

  useEffect(() => {
    if (open) {
      if (initialPhase) {
        setPhase(initialPhase);
      } else {
        setPhase(""); // Empty for new phase so user types it
      }
    } else {
      setTitle("");
      setDueDate("");
      setAssignedTo("");
      setPhase("");
      setError("");
    }
  }, [open, initialPhase]);

  if (!open) return null;

  const handleCreate = async () => {
    // If new phase, we need a phase name. If existing phase, phase is already set.
    if (!title || !dueDate || !assignedTo || (isNewPhase && !phase)) {
      setError(
        isNewPhase
          ? "Please fill in all fields (Phase Name, Milestone Title, Due Date, Assign To)."
          : "Please fill in all fields (Title, Due Date, Assign To)."
      );
      return;
    }
    setError("");
    await onCreate({ title, dueDate, assignedTo, phase });
    setOpen(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginTop: 0, fontSize: 20 }}>
          {isNewPhase ? "Start New Phase" : "Create Milestone"}
        </h3>
        {error && <div style={{ color: "#ef4444", marginBottom: 10, fontSize: 13 }}>{error}</div>}

        {isNewPhase && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>New Phase Name</label>
            <input
              list="phase-options"
              placeholder="e.g. Design, Development, Testing"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              style={input}
            />
            <datalist id="phase-options">
              <option value="Frontend" />
              <option value="Backend" />
              <option value="Testing" />
              <option value="Documentation" />
            </datalist>
          </div>
        )}

        {isNewPhase && <div style={{ borderTop: "1px solid #374151", margin: "16px 0", paddingTop: 16, fontSize: 13, color: "#9ca3af" }}>First Milestone Details</div>}

        <label style={labelStyle}>Milestone Title</label>
        <input
          placeholder="e.g. Initial Setup"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ ...input, marginBottom: 0 }}
          />
        </div>

        <label style={labelStyle}>Assign To</label>
        <input
          placeholder="employee id/name"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={input}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button style={btnSoft} onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button style={btnCreate} onClick={handleCreate}>
            {isNewPhase ? "Create Phase" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, color: "#9ca3af", fontWeight: 500 };

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
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
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

const btnCreate = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer"
};

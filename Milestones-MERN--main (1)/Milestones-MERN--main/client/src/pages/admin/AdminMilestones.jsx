import { useEffect, useState } from "react";
import MilestoneTable from "../../components/milestones/MilestoneTable";
import CreateMilestoneModal from "../../components/milestones/CreateMilestoneModal";
import {
  getAdminMilestones,
  approveMilestone,
  rejectMilestone,
  createAdminMilestone,
  deleteAdminMilestone,
  editAdminMilestone,
  renamePhase
} from "../../api/milestones";

export default function AdminMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [newPhaseName, setNewPhaseName] = useState("");

  const load = async () => {
    const data = await getAdminMilestones();
    setMilestones(data);
  };

  useEffect(() => {
    setSelectedPhase(null); // Ensure we start at the phases view
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const onApprove = async (id) => {
    const updated = await approveMilestone(id);
    setMilestones((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const onReject = async (id, reason) => {
    const updated = await rejectMilestone(id, reason);
    setMilestones((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const onCreate = async (payload) => {
    const created = await createAdminMilestone(payload);
    setMilestones((prev) => [created, ...prev]);
  };

  const onDelete = async (id) => {
    await deleteAdminMilestone(id);
    setMilestones((prev) => prev.filter((m) => m._id !== id));
  };

  const onAdminEdit = async (id, payload) => {
    const updated = await editAdminMilestone(id, payload);
    setMilestones((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const handleRenamePhase = async () => {
    if (!editingPhase || !newPhaseName) return;
    await renamePhase(editingPhase, newPhaseName);

    // Optimistic update
    setMilestones((prev) => prev.map((m) => (m.phase === editingPhase ? { ...m, phase: newPhaseName } : m)));
    if (selectedPhase === editingPhase) setSelectedPhase(newPhaseName);

    setEditingPhase(null);
    setNewPhaseName("");
  };

  const phases = [...new Set(milestones.map((m) => m.phase || "Phase 1"))].sort();

  return (
    <div style={{ padding: 22, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {selectedPhase && (
            <button style={btnBack} onClick={() => setSelectedPhase(null)} title="Back to All Phases">
              ←
            </button>
          )}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>
                {selectedPhase ? `${selectedPhase} Milestones` : "Admin Phases"}
              </h2>
              {selectedPhase && (
                <button
                  style={btnEditPhase}
                  onClick={() => {
                    setEditingPhase(selectedPhase);
                    setNewPhaseName(selectedPhase);
                  }}
                >
                  ✎
                </button>
              )}
            </div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 14 }}>
              {selectedPhase
                ? "Manage milestones within this phase"
                : "Select a phase to manage or create a new one"}
            </div>
          </div>
        </div>

        <button
          style={btnNew}
          onClick={() => {
            setOpenCreate(true);
          }}
        >
          {selectedPhase ? "+ New Milestone" : "+ New Phase"}
        </button>
      </div>

      {!selectedPhase ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {phases.length === 0 && <div style={{ color: "#9ca3af" }}>No phases yet. Create one!</div>}

          {phases.map((phase) => {
            const phaseMilestones = milestones.filter((m) => (m.phase || "Phase 1") === phase);
            const count = phaseMilestones.length;
            const completed = phaseMilestones.filter((m) => m.status === "APPROVED").length;
            const percentage = count > 0 ? Math.round((completed / count) * 100) : 0;

            return (
              <div key={phase} style={cardStyle} onClick={() => setSelectedPhase(phase)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#e5e7eb" }}>{phase}</h3>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>
                  <span>{count} Milestones</span>
                  <span>{percentage}% Approved</span>
                </div>

                <div style={{ width: "100%", height: 8, background: "#374151", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${percentage}%`, height: "100%", background: "#10b981", transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <MilestoneTable
          milestones={milestones.filter((m) => (m.phase || "Phase 1") === selectedPhase)}
          mode="admin"
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
          onAdminEdit={onAdminEdit}
        />
      )}

      <CreateMilestoneModal
        open={openCreate}
        setOpen={setOpenCreate}
        onCreate={onCreate}
        initialPhase={selectedPhase}
      />

      {editingPhase && (
        <div style={overlay}>
          <div style={modalSmall}>
            <h3 style={{ marginTop: 0, color: "#e5e7eb" }}>Rename Phase</h3>
            <input
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              style={input}
              placeholder="New phase name"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button style={btnSoft} onClick={() => setEditingPhase(null)}>
                Cancel
              </button>
              <button style={btnSave} onClick={handleRenamePhase}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
};

const modalSmall = {
  width: 320, background: "#0b1220", border: "1px solid #374151", borderRadius: 14, padding: 18
};

const input = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #374151", background: "transparent", color: "#e5e7eb", outline: "none", marginBottom: 12
};

const btnSoft = {
  padding: "8px 12px", borderRadius: 8, border: "1px solid #374151", background: "transparent", color: "#e5e7eb", fontWeight: 700, cursor: "pointer"
};

const btnSave = {
  padding: "8px 12px", borderRadius: 8, border: "1px solid #2563eb", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer"
};

const btnEditPhase = {
  background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 4
};

const btnNew = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  transition: "opacity 0.2s"
};

const cardStyle = {
  background: "#111827",
  border: "1px solid #374151",
  borderRadius: 14,
  padding: 24,
  cursor: "pointer",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.1s, border-color 0.2s"
};

const btnBack = {
  background: "#374151",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 36,
  height: 36,
  cursor: "pointer",
  fontSize: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s"
};

import { useEffect, useState } from "react";
import MilestoneTable from "../../components/milestones/MilestoneTable";
import { getMyMilestones, updateMilestone, submitMilestone } from "../../api/milestones";

export default function MyMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    getMyMilestones().then(setMilestones);
    const interval = setInterval(() => {
      getMyMilestones().then(setMilestones);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const onSaveEdit = async (id, data) => {
    const updated = await updateMilestone(id, data);
    setMilestones((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const onSubmit = async (id) => {
    const updated = await submitMilestone(id);
    setMilestones((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const phases = [...new Set(milestones.map((m) => m.phase || "Phase 1"))].sort();

  return (
    <div style={{ padding: 22, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {selectedPhase && (
          <button style={btnBack} onClick={() => setSelectedPhase(null)}>
            ←
          </button>
        )}
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>{selectedPhase ? selectedPhase : "My Phases"}</h2>
          <div style={{ marginTop: 6, color: "#6b7280", fontSize: 14 }}>
            {selectedPhase ? "Track your tasks and submit for admin review" : "Select a phase to view milestones"}
          </div>
        </div>
      </div>

      {!selectedPhase ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginTop: 24 }}>
          {phases.length === 0 && <div style={{ color: "#9ca3af" }}>No phases found (create milestones first)</div>}
          {phases.map((phase) => {
            const phaseMilestones = milestones.filter((m) => (m.phase || "Phase 1") === phase);
            const count = phaseMilestones.length;
            const completed = phaseMilestones.filter((m) => m.status === "APPROVED").length;
            const percentage = count > 0 ? Math.round((completed / count) * 100) : 0;

            return (
              <div key={phase} style={cardStyle} onClick={() => setSelectedPhase(phase)}>
                <h3 style={{ margin: "0 0 10px 0", color: "#e5e7eb" }}>{phase}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9ca3af", marginBottom: 12 }}>
                  <span>{count} Tasks</span>
                  <span>{percentage}% Done</span>
                </div>
                <div style={{ height: 6, background: "#374151", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${percentage}%`, height: "100%", background: "#2563eb" }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <MilestoneTable
          milestones={milestones.filter((m) => (m.phase || "Phase 1") === selectedPhase)}
          mode="member"
          onSaveEdit={onSaveEdit}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

const cardStyle = {
  background: "#111827",
  border: "1px solid #374151",
  borderRadius: 14,
  padding: 24,
  cursor: "pointer",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
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

import { useMemo, useState } from "react";
import EditMilestoneModal from "./EditMilestoneModal";
import RejectModal from "./RejectModal";
import AdminEditMilestoneModal from "./AdminEditMilestoneModal.jsx";
import ReviewMilestoneModal from "./ReviewMilestoneModal.jsx";


export default function MilestoneTable({
  milestones,
  mode,
  onSaveEdit,
  onSubmit,
  onApprove,
  onReject,
  onDelete,
  onAdminEdit
}) {
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openAdminEdit, setOpenAdminEdit] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return milestones;
    return milestones.filter((m) => {
      return (
        m.title.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q) ||
        (m.assignedTo || "").toLowerCase().includes(q)
      );
    });
  }, [milestones, query]);

  // Close menu when clicking outside (simple version: click anywhere else resets)
  // For now, toggle logic handles it per row. 

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const badgeStyle = (status) => {
    const base = { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, display: "inline-block" };
    if (status === "DRAFT") return { ...base, background: "#eef2ff", color: "#3730a3" };
    if (status === "SUBMITTED") return { ...base, background: "#fff7ed", color: "#9a3412" };
    if (status === "APPROVED") return { ...base, background: "#ecfdf5", color: "#065f46" };
    return { ...base, background: "#fef2f2", color: "#991b1b" };
  };

  const openEditModal = (m) => {
    setSelected(m);
    setOpenEdit(true);
  };

  const openRejectModal = (m) => {
    setSelected(m);
    setOpenReject(true);
  };

  const openAdminEditModal = (m) => {
    setSelected(m);
    setOpenAdminEdit(true);
  };

  const openReviewModal = (m) => {
    setSelected(m);
    setOpenReview(true);
  };

  return (
    <div style={{ marginTop: 14 }}>
      {/* ... (search bar) */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === "admin" ? "Search title/status/employee..." : "Search title/status..."}
          style={{ width: "100%", maxWidth: 420, padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", outline: "none" }}
        />
        {/* ... */}
        <div style={{ fontSize: 13, color: "#9ca3af" }}>
          Showing <b style={{ color: "#e5e7eb" }}>{filtered.length}</b>
        </div>
      </div>

      <div style={{ border: "1px solid #374151", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 10px rgba(0,0,0,0.25)", minHeight: 300 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* ... (thead) ... */}
          <thead style={{ background: "#111827" }}>
            <tr>
              {mode === "admin" && <th style={thStyle}>Employee</th>}
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Due</th>
              <th style={thStyle}>Progress</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Admin Comment</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody style={{ background: "#0b1220" }}>
            {filtered.map((m) => (
              <tr key={m._id} style={{ borderTop: "1px solid #374151" }}>
                {mode === "admin" && <td style={tdStyle}>{m.assignedTo}</td>}
                <td style={tdStyle}>{m.title}</td>
                <td style={tdStyle}>{m.dueDate}</td>
                <td style={tdStyle}>
                  {/* ... (progress bar) */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 120, height: 8, background: "#1f2937", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.max(0, m.progress))}%`, height: "100%", background: "#e5e7eb" }} />
                    </div>
                    <div style={{ fontSize: 13, color: "#e5e7eb", minWidth: 40 }}>{m.progress}%</div>
                  </div>
                </td>
                <td style={tdStyle}><span style={badgeStyle(m.status)}>{m.status}</span></td>
                <td style={tdStyle}>{m.adminComment || "-"}</td>

                <td style={{ ...tdStyle, position: "relative" }}> {/* Relative for dropdown */}
                  {mode === "member" && (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {(m.status === "DRAFT" || m.status === "REJECTED") && (
                        <button style={btnSoft} onClick={() => openEditModal(m)}>Edit / Submit</button>
                      )}
                    </div>
                  )}

                  {mode === "admin" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Primary Action */}
                      {m.status === "SUBMITTED" ? (
                        <button style={btnReview} onClick={() => openReviewModal(m)}>Review</button>
                      ) : (
                        <button style={btnEditAdmin} onClick={() => openAdminEditModal(m)}>Edit</button>
                      )}

                      {/* Menu */}
                      <div style={{ position: "relative" }}>
                        <button style={btnIcon} onClick={() => toggleMenu(m._id)}>⋮</button>

                        {openMenuId === m._id && (
                          <div style={dropdownMenu}>
                            {/* Items for SUBMITTED */}
                            {m.status === "SUBMITTED" && (
                              <>
                                <div style={{ ...menuItem, color: "#16a34a" }} onClick={() => { onApprove(m._id); setOpenMenuId(null); }}>Approve</div>
                                <div style={{ ...menuItem, color: "#ef4444" }} onClick={() => { openRejectModal(m); setOpenMenuId(null); }}>Reject</div>
                                <div style={menuItem} onClick={() => { openAdminEditModal(m); setOpenMenuId(null); }}>Edit</div>
                              </>
                            )}

                            <div style={{ ...menuItem, color: "#ef4444" }} onClick={() => { onDelete(m._id); setOpenMenuId(null); }}>Delete</div>
                          </div>
                        )}
                        {/* Overlay to close when clicking outside */}
                        {openMenuId === m._id && (
                          <div
                            style={{ position: "fixed", inset: 0, zIndex: 10, cursor: "default" }}
                            onClick={() => setOpenMenuId(null)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {/* ... */}
            {filtered.length === 0 && (
              <tr>
                <td style={{ padding: 18, color: "#9ca3af" }} colSpan={mode === "admin" ? 7 : 6}>
                  No milestones found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditMilestoneModal
        open={openEdit}
        setOpen={setOpenEdit}
        milestone={selected}
        onSave={(id, data) => onSaveEdit(id, data)}
        onSubmit={(id) => onSubmit(id)}
      />
      <RejectModal open={openReject} setOpen={setOpenReject} milestone={selected} onReject={(id, reason) => onReject(id, reason)} />
      <AdminEditMilestoneModal open={openAdminEdit} setOpen={setOpenAdminEdit} milestone={selected} onSave={(id, data) => onAdminEdit(id, data)} />
      <ReviewMilestoneModal open={openReview} setOpen={setOpenReview} milestone={selected} onApprove={onApprove} onReject={(id) => openRejectModal({ _id: id })} />
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "14px 14px", fontSize: 12, letterSpacing: 0.3, color: "#cbd5e1", fontWeight: 700 };
const tdStyle = { padding: "14px 14px", fontSize: 14, color: "#e5e7eb", verticalAlign: "top" };

const btnDark = { padding: "9px 12px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#e5e7eb", color: "#111827", fontWeight: 700, cursor: "pointer" };
const btnSoft = { padding: "9px 12px", borderRadius: 10, border: "1px solid #374151", background: "transparent", color: "#e5e7eb", fontWeight: 700, cursor: "pointer" };
const btnApprove = { padding: "9px 12px", borderRadius: 10, border: "1px solid #16a34a", background: "#16a34a", color: "#fff", fontWeight: 800, cursor: "pointer" };
const btnReview = { padding: "9px 12px", borderRadius: 10, border: "1px solid #8b5cf6", background: "#8b5cf6", color: "#fff", fontWeight: 800, cursor: "pointer" };
const btnDanger = { padding: "9px 12px", borderRadius: 10, border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 800, cursor: "pointer" };
const btnDelete = { padding: "9px 12px", borderRadius: 10, border: "1px solid #64748b", background: "transparent", color: "#cbd5e1", fontWeight: 800, cursor: "pointer" };
const btnEditAdmin = { padding: "9px 12px", borderRadius: 10, border: "1px solid #2563eb", background: "transparent", color: "#93c5fd", fontWeight: 800, cursor: "pointer" };
const disabledStyle = { opacity: 0.5, cursor: "not-allowed", filter: "grayscale(100%)" };

const btnIcon = {
  background: "transparent",
  border: "none",
  color: "#9ca3af",
  fontSize: 20,
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: 4,
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s"
};

const dropdownMenu = {
  position: "absolute",
  top: "100%",
  right: 0,
  background: "#1f2937",
  border: "1px solid #374151",
  borderRadius: 8,
  padding: "4px 0",
  minWidth: 120,
  zIndex: 20,
  marginTop: 4,
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
};

const menuItem = {
  padding: "8px 16px",
  fontSize: 13,
  color: "#e5e7eb",
  cursor: "pointer",
  transition: "background 0.1s",
  fontWeight: 500,
  display: "block",
  textAlign: "left"
};

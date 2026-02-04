import { useEffect } from "react";

export default function ReviewMilestoneModal({ open, setOpen, milestone, onApprove, onReject }) {
    if (!open || !milestone) return null;

    return (
        <div style={overlay}>
            <div style={modal}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ margin: 0, color: "#e5e7eb", fontSize: 20 }}>Review Submission</h3>
                    <span style={badgeStyle(milestone.status)}>{milestone.status}</span>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <div style={sectionTitle}>Wait, what needs to be reviewed?</div>
                    <div style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 16 }}>{milestone.title}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                        Assigned to: <span style={{ color: "#d1d5db" }}>{milestone.assignedTo}</span> • Due: <span style={{ color: "#d1d5db" }}>{milestone.dueDate}</span>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: "#1f2937", borderRadius: 999, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(100, Math.max(0, milestone.progress))}%`, height: "100%", background: "#2563eb" }} />
                        </div>
                        <span style={{ fontSize: 13, color: "#e5e7eb", fontWeight: 600 }}>{milestone.progress}% Complete</span>
                    </div>
                </div>

                <div style={{ borderTop: "1px solid #374151", paddingTop: 16, marginBottom: 20 }}>
                    <div style={sectionTitle}>Description & Notes</div>
                    <div style={contentBox}>
                        {milestone.description ? (
                            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{milestone.description}</div>
                        ) : (
                            <span style={{ color: "#6b7280", fontStyle: "italic" }}>No description provided.</span>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <div style={sectionTitle}>Proof of Work</div>
                    <div style={contentBox}>
                        {milestone.links ? (
                            <a
                                href={milestone.links.startsWith("http") ? milestone.links : `https://${milestone.links}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#3b82f6", textDecoration: "none", wordBreak: "break-all" }}
                            >
                                {milestone.links} ↗
                            </a>
                        ) : (
                            <span style={{ color: "#6b7280", fontStyle: "italic" }}>No links provided.</span>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #374151", paddingTop: 20 }}>
                    <button style={btnSoft} onClick={() => setOpen(false)}>
                        Close
                    </button>

                    {milestone.status === "SUBMITTED" && (
                        <>
                            <button style={btnDanger} onClick={() => { setOpen(false); onReject(milestone._id); }}>
                                Reject
                            </button>
                            <button style={btnApprove} onClick={() => { setOpen(false); onApprove(milestone._id); }}>
                                Approve
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
};

const modal = {
    width: 500, background: "#0b1220", border: "1px solid #374151", borderRadius: 16, padding: 24, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
};

const sectionTitle = {
    margin: "0 0 8px 0", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700
};

const contentBox = {
    background: "#111827", border: "1px solid #374151", borderRadius: 8, padding: 12, fontSize: 14, color: "#e5e7eb"
};

const btnSoft = {
    padding: "10px 16px", borderRadius: 8, border: "1px solid #374151", background: "transparent", color: "#e5e7eb", fontWeight: 600, cursor: "pointer"
};

const btnApprove = {
    padding: "10px 16px", borderRadius: 8, border: "1px solid #16a34a", background: "#16a34a", color: "#fff", fontWeight: 700, cursor: "pointer"
};

const btnDanger = {
    padding: "10px 16px", borderRadius: 8, border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer"
};

const badgeStyle = (status) => {
    const base = { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 };
    if (status === "DRAFT") return { ...base, background: "#eef2ff", color: "#6366f1" };
    if (status === "SUBMITTED") return { ...base, background: "#fff7ed", color: "#9a3412" };
    if (status === "APPROVED") return { ...base, background: "#ecfdf5", color: "#065f46" };
    if (status === "REJECTED") return { ...base, background: "#fef2f2", color: "#ef4444" };
    return { ...base, background: "#f3f4f6", color: "#374151" };
};

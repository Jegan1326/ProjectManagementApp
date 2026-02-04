import api from "./axios";

export const getMyMilestones = async () => {
  const res = await api.get("/milestones/my");
  return res.data;
};

export const updateMilestone = async (id, payload) => {
  const res = await api.put(`/milestones/${id}`, payload);
  return res.data;
};

export const submitMilestone = async (id) => {
  const res = await api.post(`/milestones/${id}/submit`);
  return res.data;
};

export const getAdminMilestones = async () => {
  const res = await api.get("/admin/milestones");
  return res.data;
};

export const approveMilestone = async (id) => {
  const res = await api.put(`/admin/milestones/${id}/approve`);
  return res.data;
};

export const rejectMilestone = async (id, reason) => {
  const res = await api.put(`/admin/milestones/${id}/reject`, { reason });
  return res.data;
};

export const createAdminMilestone = async (payload) => {
  const res = await api.post("/admin/milestones", payload);
  return res.data;
};

export const deleteAdminMilestone = async (id) => {
  const res = await api.delete(`/admin/milestones/${id}`);
  return res.data;
};

export const editAdminMilestone = async (id, payload) => {
  const res = await api.put(`/admin/milestones/${id}`, payload);
  return res.data;
};

export const renamePhase = async (oldName, newName) => {
  const res = await api.post("/admin/milestones/rename-phase", { oldName, newName });
  return res.data;
};

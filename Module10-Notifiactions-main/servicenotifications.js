import axios from "axios";

export const getNotifications = async (token) => {
  return axios.get("/api/notifications", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const markAsRead = async (id, token) => {
  return axios.put(`/api/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

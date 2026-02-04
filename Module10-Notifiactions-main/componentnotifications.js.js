import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";

export default function NotificationBell({ token }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications(token).then(res => setNotifications(res.data));
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const handleRead = async (id) => {
    await markAsRead(id, token);
    setNotifications(
      notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="relative">
      <button className="text-xl">🔔 {unread}</button>

      <div className="absolute right-0 mt-2 w-72 bg-white shadow rounded">
        {notifications.map(n => (
          <div
            key={n._id}
            className={`p-3 border-b cursor-pointer ${
              n.isRead ? "bg-gray-100" : "bg-white"
            }`}
            onClick={() => handleRead(n._id)}
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}

const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

exports.createNotification = async (req, res) => {
  const { userId, message, type, email } = req.body;

  const notification = await Notification.create({
    userId,
    message,
    type
  });

  if (email) {
    await sendEmail(email, "Notification Alert", message);
  }

  res.status(201).json(notification);
};

exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: "Notification marked as read" });
};

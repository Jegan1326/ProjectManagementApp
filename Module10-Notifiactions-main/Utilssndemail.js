const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "test@gmail.com",
    pass: "app-password"
  }
});

module.exports = async (to, subject, text) => {
  await transporter.sendMail({
    from: "test@gmail.com",
    to,
    subject,
    text
  });
};

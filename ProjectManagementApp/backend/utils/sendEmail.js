const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // strict check for SMTP vars, otherwise use console
    if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL) {
        console.log('---------------------------------------------------');
        console.log('EMAIL SERVICE (MOCKED) - Set SMTP_HOST to enable real emails');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('---------------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'ProjectManager'} <${process.env.FROM_EMAIL || 'noreply@example.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // could add html support later
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;

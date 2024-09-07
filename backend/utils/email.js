const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Configure nodemailer with your email service
    const transporter = nodemailer.createTransport({
      // ... (SMTP configuration)
    });
  
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, text });
};

module.exports = { sendEmail };

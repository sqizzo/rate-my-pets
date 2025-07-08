// Nodemailer for sending verification emails
const nodemailer = require("nodemailer");

// Helper function to send verification email
const sendVerificationEmail = async (email, token, username) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  const message = {
    from: '"RateMyPets Support" <support@ratemypets.com>',
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Welcome to RateMyPets, ${username}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(message);
};

module.exports = sendVerificationEmail;

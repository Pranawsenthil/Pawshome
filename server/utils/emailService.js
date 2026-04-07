const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"PawsHome" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email error:', error);
  }
};

const sendStageUpdateEmail = async ({ to, applicantName, petName, stage, status }) => {
  const stageNames = {
    1: 'Personal Info Received',
    2: 'Home Assessment Review',
    3: 'Reference Check',
    4: 'Final Decision'
  };

  const statusColors = {
    pending: 'orange',
    'under-review': 'blue',
    approved: 'green',
    rejected: 'red'
  };

  const html = `
    <h2>Hi ${applicantName},</h2>
    <p>There is an update on your adoption application for <strong>${petName}</strong>.</p>
    <p><strong>Current Stage:</strong> Stage ${stage} - ${stageNames[stage]}</p>
    <p><strong>Status:</strong> <span style="color: white; background-color: ${statusColors[status] || 'grey'}; padding: 4px 8px; border-radius: 4px;">${status.toUpperCase()}</span></p>
    <p>Thank you for choosing PawsHome.</p>
  `;

  await sendEmail({
    to,
    subject: 'PawsHome - Your Application Update',
    html,
  });
};

module.exports = { sendEmail, sendStageUpdateEmail };

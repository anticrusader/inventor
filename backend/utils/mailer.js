const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendPasswordResetEmail = async (newPassword) => {
  const mailOptions = {
    from: {
      name: 'Bangles Jewellers',
      address: process.env.EMAIL_USER
    },
    to: ['anticrusader@gmail.com', 'fawadkhalid916@gmail.com'],
    subject: 'New Password Generated - Bangles Jewellers',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #DAA520;
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .password-box {
            background-color: #f5f5f5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Bangles Jewellers</h1>
          </div>
          <div class="content">
            <h2>Password Reset</h2>
            <p>A new password has been generated for your account.</p>
            <div class="password-box">
              ${newPassword}
            </div>
            <p><strong>Important:</strong> For security reasons, please change this password after logging in.</p>
            <p>If you did not request this password reset, please contact your administrator immediately.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from Bangles Jewellers Inventory Management System.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
};

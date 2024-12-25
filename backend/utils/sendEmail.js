const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, '')
    }
  });
};

const sendEmail = async (mailOptions) => {
  try {
    console.log('Creating email transporter...');
    const transporter = createTransporter();
    
    console.log('Verifying transporter configuration...');
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('Transporter verification failed:', error);
          reject(error);
        } else {
          console.log('Transporter is ready to send emails');
          resolve(success);
        }
      });
    });

    console.log('Preparing to send email to:', mailOptions.to);
    mailOptions.from = process.env.EMAIL_USER;

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;

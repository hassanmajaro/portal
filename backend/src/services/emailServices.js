const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendActivationEmail = async (email, verificationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Activate Your Admission',
            html: `
               <h1>Email Verification<h1>
               <p>Thank you for registering. Use the code below to verify you email:</p>
               <h2>${verificationCode}</h2>
               <p>This code expires in 15min . Please do not share it.</p>
                `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verfication email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendActivationEmail };

const nodemailer = require('nodemailer')
require('dotenv').config();

// 1. Create Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,                 // Changed to 465 (SSL)
    secure: true,              // MUST be true for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // High timeout settings (30 seconds)
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: {
        rejectUnauthorized: false, // Prevents local SSL handshake rejections
        ciphers: 'DEFAULT@SECLEVEL=0',
        minVersion: 'TLSv1.2'      // Enforces modern security protocols
    },
});


//Verify Connection On Startup
transporter.verify((err, success) => {
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)
    if (err) console.log("api Mailer Error: ", err.message);
    else console.log('Mailer Ready To Send api')
})

// 2. Send Email Alert To The Site Owner
const sendMailToOwner = ({ name, email, topic, message }) => {
    return transporter.sendMail({
        from: `"Fieldwork" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `💼 New Lead: ${name} - ${topic}`,
        html: `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 30px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #4F46E5;">
                
                <!-- Header -->
                <div style="padding: 25px; background: #fafafa; border-bottom: 1px solid #eaeaea; text-align: center;">
                    <h2 style="margin: 0; color: #111827; font-size: 22px;">New Agency Inquiry</h2>
                    <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Submitted via Fieldwork contact form</p>
                </div>

                <!-- Content Body -->
                <div style="padding: 30px;">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 80px; font-weight: bold;">Lead Name:</td>
                            <td style="padding: 10px 0; color: #111827; font-size: 16px; font-weight: 500;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #6B7280; font-size: 14px; font-weight: bold;">Email:</td>
                            <td style="padding: 10px 0; color: #4F46E5; font-size: 16px;"><a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #6B7280; font-size: 14px; font-weight: bold;">Topic:</td>
                            <td style="padding: 10px 0; color: #111827; font-size: 16px;">${topic || 'General Inquiry'}</td>
                        </tr>
                    </table>

                    <div style="background: #F9FAFB; border-left: 4px solid #9CA3AF; padding: 15px; border-radius: 4px; margin-top: 10px;">
                        <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: #9CA3AF; font-weight: bold; letter-spacing: 1px;">Message Brief</p>
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <!-- Quick Reply Button -->
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="mailto:${email}?subject=Re: Your inquiry to Fieldwork" style="background-color: #4F46E5; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 15px; box-shadow: 0 2px 5px rgba(79, 70, 229, 0.3);">
                            Reply to Lead Instantly
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding: 20px; background: #F9FAFB; text-align: center; border-top: 1px solid #eaeaea;">
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">© ${new Date().getFullYear()} Fieldwork Digital Agency. All rights reserved.</p>
                </div>
            </div>
        </div>
        `
    });
};

// 3. Send Beautiful Acknowledgement Receipt To Customer
const sendAckToCustomer = ({ name, email }) => {
    return transporter.sendMail({
        from: `"Fieldwork" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✨ We received your message, ${name}!`,
        html: `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 30px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #10B981;">
                
                <!-- Hero Header -->
                <div style="padding: 40px 25px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Message Received!</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thanks for reaching out to Fieldwork.</p>
                </div>

                <!-- Content Body -->
                <div style="padding: 35px; line-height: 1.7; color: #4B5563;">
                    <h3 style="color: #111827; margin-top: 0; font-size: 18px;">Hi ${name},</h3>
                    <p style="font-size: 15px;">We wanted to confirm that your message landed safely in our system. Our team is already reviewing the details you provided.</p>
                    
                    <p style="font-size: 15px;"><strong>What happens next?</strong><br>
                    One of our project strategists will look over your scope and reach out to you via this email within <strong>48 hours</strong>.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 25px 0;">
                    
                    <p style="font-size: 14px; color: #6B7280; margin-bottom: 0;">If you forgot to add something or need urgent assistance, you can reply directly to this email to add notes to your request.</p>
                </div>

                <!-- Footer -->
                <div style="padding: 20px; background: #F9FAFB; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 5px 0; color: #4F46E5; font-weight: bold; font-size: 14px;">Fieldwork</p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">Building modern web realities.</p>
                </div>
            </div>
        </div>
        `
    });
};

module.exports = { sendMailToOwner, sendAckToCustomer };
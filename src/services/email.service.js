import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

/**
 * @desc Function to send email
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// export async function sendRegistrationEmail(userEmail,name) {
//   const subject = 'Welcome to Banking System!';
//   const text = `Hi ${name},\n\nThank you for registering with our banking system. We're excited to have you on board!\n\nBest regards,\nBanking System Team`;
//   const html = `<p>Hi ${name},</p><p>Thank you for registering with our banking system. We're excited to have you on board!</p><p>Best regards,<br/>Banking System Team</p>`;

//   await sendEmail(userEmail, subject, text, html);
// }

export async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Banking System – Your Account is Ready";

  const text = `Hi ${name},

Welcome to Banking System! Your account has been successfully created.

We're excited to have you onboard.

Best regards,
Banking System Team`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Banking System</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding: 30px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color:#0a1f44; padding: 30px;">
                <img src="https://ik.imagekit.io/PranavMittalJs/Todo_images/banking%20logo.jpg" alt="Banking System Logo" width="150" style="display:block; margin-bottom:15px;" />
                <h1 style="color:#ffffff; margin:0; font-size:24px;">Welcome to Banking System</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="color:#0a1f44; margin-top:0;">Hi ${name},</h2>
                
                <p style="font-size:16px; color:#333333; line-height:1.6;">
                  Thank you for registering with <strong>Banking System</strong>. 
                  Your account has been successfully created and is now ready to use.
                </p>

                <p style="font-size:16px; color:#333333; line-height:1.6;">
                  We are committed to providing you with secure, reliable, and seamless banking services.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="#" 
                     style="background-color:#0a1f44; color:#ffffff; padding:14px 30px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block;">
                    Access Your Account
                  </a>
                </div>

                <p style="font-size:14px; color:#777777; line-height:1.6;">
                  If you did not create this account, please contact our support team immediately.
                </p>

                <p style="font-size:16px; color:#333333;">
                  Best regards,<br/>
                  <strong>Banking System Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f1f3f6; padding:20px; text-align:center; font-size:12px; color:#777777;">
                © ${new Date().getFullYear()} Banking System. All rights reserved.<br/>
                Secure. Reliable. Trusted.
              </td>
            </tr>

          </table>
          
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

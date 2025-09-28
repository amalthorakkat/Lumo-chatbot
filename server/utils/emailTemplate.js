const LOGO_URL =
  "https://i.postimg.cc/RhqzpXz5/Gemini-Generated-Image-kyplvxkyplvxkypl-1.png";

const generateOTPEmail = (otp, appName = process.env.APP_NAME || "LUMO") => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${appName} OTP Verification</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Schibsted Grotesk', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 40px auto; overflow: hidden;">
        
        <!-- Clean Header -->
        <tr>
          <td style="padding: 40px 32px 24px 32px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
            <img src="${LOGO_URL}" alt="${appName} Logo" style="max-width: 60px; height: auto; margin-bottom: 16px;" />
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0; letter-spacing: -0.025em; font-family: 'Schibsted Grotesk', Arial, sans-serif;">${appName}</h1>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 32px;">
            <h2 style="color: #334155; font-size: 20px; font-weight: 500; margin: 0 0 16px 0; text-align: center; font-family: 'Schibsted Grotesk', Arial, sans-serif;">Verify your email</h2>
            
            <p style="color: #64748b; font-size: 16px; margin: 0 0 32px 0; text-align: center; font-family: 'Schibsted Grotesk', Arial, sans-serif;">
              Enter this verification code to complete your ${appName} setup:
            </p>
            
            <!-- Simple OTP Display -->
            <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
              <div style="font-size: 32px; font-weight: 700; color: #0f172a; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; letter-spacing: 0.1em; margin-bottom: 8px;">
                ${otp}
              </div>
              <p style="color: #64748b; font-size: 14px; margin: 0; font-family: 'Schibsted Grotesk', Arial, sans-serif;">Valid for 10 minutes</p>
            </div>
            
            <!-- Simple Notice -->
            <div style="background-color: #fef3cd; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #a16207; font-size: 14px; margin: 0; text-align: center; font-family: 'Schibsted Grotesk', Arial, sans-serif;">
                <strong>Keep this code private.</strong> We'll never ask for it over phone or email.
              </p>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; text-align: center; margin: 0; font-family: 'Schibsted Grotesk', Arial, sans-serif;">
              Didn't request this? You can safely ignore this email.
            </p>
          </td>
        </tr>
        
        <!-- Simple Footer -->
        <tr>
          <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0; font-family: 'Schibsted Grotesk', Arial, sans-serif;">
              © ${new Date().getFullYear()} ${appName} • All rights reserved
            </p>
          </td>
        </tr>
      </table>
      
      <!-- Mobile Styles -->
      <style>
        @media only screen and (max-width: 600px) {
          table[align="center"] {
            margin: 20px 16px !important;
          }
          .mobile-padding {
            padding: 24px 20px !important;
          }
        }
      </style>
    </body>
    </html>
  `;
};

module.exports = { generateOTPEmail };

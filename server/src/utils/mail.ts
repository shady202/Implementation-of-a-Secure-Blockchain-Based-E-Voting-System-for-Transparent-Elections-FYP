import nodemailer from "nodemailer";

// Email transporter - will auto-setup Ethereal if no SMTP configured
let transporter: nodemailer.Transporter;

async function createTransporter() {
  // Check if SMTP credentials are provided
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Use provided SMTP (Gmail, etc.)
    console.log("📧 Using configured SMTP server:", process.env.SMTP_HOST);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Auto-create Ethereal test account for development
    console.log("📧 No SMTP configured, creating Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();
    console.log("✅ Ethereal account created!");
    console.log("   User:", testAccount.user);
    console.log("   Pass:", testAccount.pass);

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
}

/**
 * Send OTP verification email to voter
 */
export async function sendOtpEmail(
  toEmail: string,
  otp: string,
  voterName?: string
): Promise<void> {
  // Ensure transporter is initialized
  if (!transporter) {
    transporter = await createTransporter();
  }

  const from =
    process.env.SMTP_FROM ||
    `"APU Voting System" <${
      process.env.SMTP_USER || "noreply@apuvoting.test"
    }>`;
  const subject = "🔐 Your APU Voting Verification Code";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; letter-spacing: 8px; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
        .info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗳️ APU Voting System</h1>
          <p>Email Verification</p>
        </div>
        <div class="content">
          <h2>Hello ${voterName || "Voter"},</h2>
          <p>Your verification code is:</p>
          
          <div class="otp-code">${otp}</div>
          
          <div class="info">
            <strong>⏱️ Important:</strong> This code expires in <strong>${
              process.env.OTP_TTL_MINUTES || 10
            } minutes</strong>.
          </div>
          
          <p>If you did not request this code, please ignore this email or contact support if you have concerns.</p>
          
          <p><strong>Security Tips:</strong></p>
          <ul>
            <li>Never share this code with anyone</li>
            <li>APU Voting will never ask for your code via phone or SMS</li>
            <li>Make sure you're on the official APU Voting website</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2025 APU Vote Chain. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Your APU Voting verification code is: ${otp}

This code expires in ${process.env.OTP_TTL_MINUTES || 10} minutes.

If you did not request this, please ignore this email.

Security: Never share this code with anyone.

© 2025 APU Vote Chain
  `.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log("\n✅ OTP email sent successfully!");
    console.log("📧 To:", toEmail);
    console.log("🔐 OTP Code:", otp);

    // If using Ethereal, show preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📨 Preview email: " + previewUrl);
      console.log(
        "\n💡 TIP: Copy the OTP code above or click the preview link\n"
      );
    }
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Failed to send verification email");
  }
}

/**
 * Send vote confirmation email to voter
 */
export async function sendVoteConfirmationEmail(
  toEmail: string,
  voterName: string,
  votes: Array<{ categoryName: string; candidateName: string }>,
  transactionHash: string,
  electionTitle?: string,
  electionDescription?: string
): Promise<void> {
  // Ensure transporter is initialized
  if (!transporter) {
    transporter = await createTransporter();
  }

  const from =
    process.env.SMTP_FROM ||
    `"APU Voting System" <${
      process.env.SMTP_USER || "noreply@apuvoting.test"
    }>`;
  const subject = "✅ Vote Confirmation - Your Vote Has Been Recorded";

  const votesList = votes
    .map(
      (v, idx) =>
        `<li><strong>${v.categoryName}:</strong> ${v.candidateName}</li>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .vote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .election-title { font-size: 18px; font-weight: bold; color: #0c4a6e; margin-bottom: 5px; }
        .election-desc { font-size: 14px; color: #64748b; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; }
        .tx-hash { font-family: monospace; font-size: 11px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        li:last-child { border-bottom: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗳️ Vote Confirmed!</h1>
          <p>Your vote has been successfully recorded on the blockchain</p>
        </div>
        <div class="content">
          <h2>Hello ${voterName},</h2>
          <p>Thank you for participating in the election! Your vote has been securely recorded.</p>
          
          <div class="vote-details">
            <h3>📋 ${electionTitle || "Your Votes"}</h3>
            ${
              electionDescription
                ? `<div class="election-desc">${electionDescription}</div>`
                : ""
            }
            <ul>
              ${votesList}
            </ul>
          </div>
          
          <div class="info">
            <strong>🔒 Blockchain Transaction:</strong>
            <div class="tx-hash">
              <a href="https://hoodi.etherscan.io/tx/${transactionHash}" target="_blank" style="color: #3b82f6; text-decoration: none;">
                ${transactionHash}
              </a>
            </div>
            <p style="margin: 10px 0 0 0; font-size: 13px;">
              You can verify your vote on the blockchain using this transaction hash. 
              <a href="https://hoodi.etherscan.io/tx/${transactionHash}" target="_blank" style="color: #3b82f6;">
                View on Hoodi Etherscan →
              </a>
            </p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul style="list-style: disc; padding-left: 20px;">
            <li>Your vote is now permanently recorded on the blockchain</li>
            <li>You can view your vote history anytime on the "My Votes" page</li>
            <li>Results will be published after the election ends</li>
          </ul>
          
          <p style="margin-top: 30px;">Your participation helps ensure a transparent and democratic election process.</p>
        </div>
        <div class="footer">
          <p>© 2025 APU Vote Chain. All rights reserved.</p>
          <p>This is an automated confirmation email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Vote Confirmation - APU Voting System

Hello ${voterName},

Your vote has been successfully recorded!

Your Votes:
${votes.map((v) => `- ${v.categoryName}: ${v.candidateName}`).join("\n")}

Blockchain Transaction Hash:
${transactionHash}

You can verify your vote on the blockchain using this transaction hash.

Thank you for participating!

© 2025 APU Vote Chain
  `.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log("\n✅ Vote confirmation email sent!");
    console.log("📧 To:", toEmail);

    // If using Ethereal, show preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📨 Preview email: " + previewUrl);
    }
  } catch (error) {
    console.error("❌ Failed to send vote confirmation email:", error);
    // Don't throw - vote is already saved, email is just a courtesy
  }
}

/**
 * Verify email service configuration
 */
export async function verifyEmailService(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error);
    return false;
  }
}

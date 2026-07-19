const nodemailer = require("nodemailer");

// Sirf yahan — HTML email templates ke andar — user-supplied text (naam)
// ko escape karte hain. Yeh ek non-React rendering surface hai (kuch mail
// clients raw HTML render karte hain), isliye yeh ek real HTML-injection
// risk hai agar koi apna naam "<img src=x onerror=...>" jaisa rakhe.
// (React app ke andar yeh zaroorat nahi — woh sab kuch already safely
// auto-escape karta hai.)
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

let cachedTransporter = null;

const isSmtpConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // 465 = SSL, 587 = STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return cachedTransporter;
};

/**
 * Email bhejta hai agar SMTP configure hai. Agar nahi hai (local dev me
 * common), to email bhejne ki koshish nahi karta — sirf console me poora
 * content log kar deta hai (link/OTP samet) taaki bina real SMTP ke bhi
 * poora signup/reset flow test kiya ja sake. Production me SMTP_HOST/
 * SMTP_PORT/SMTP_USER/SMTP_PASS zaroor set karo (.env.example dekho).
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!isSmtpConfigured()) {
    console.log("\n========== [DEV] EMAIL NOT SENT (SMTP not configured) ==========");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log("===================================================================\n");
    return { delivered: false };
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"CareerPilot" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });

  return { delivered: true };
};

const sendVerificationEmail = async (user, verifyUrl) => {
  const safeName = escapeHtml(user.name);

  await sendEmail({
    to: user.email,
    subject: "Verify your CareerPilot email",
    text: `Hi ${user.name}, verify your email: ${verifyUrl} (valid for 24 hours)`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to CareerPilot, ${safeName}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 22px;background:#7857e6;color:#fff;border-radius:8px;text-decoration:none;">
            Verify email
          </a>
        </p>
        <p>Or copy this link: ${verifyUrl}</p>
        <p style="color:#888;font-size:12px;">This link expires in 24 hours. If you didn't create this account, ignore this email.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, resetUrl, otp) => {
  await sendEmail({
    to: user.email,
    subject: "Reset your CareerPilot password",
    text: `Hi ${user.name}, reset your password: ${resetUrl} — or use OTP ${otp} (valid for 15 minutes)`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>Click the button below, or use the one-time code.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 22px;background:#7857e6;color:#fff;border-radius:8px;text-decoration:none;">
            Reset password
          </a>
        </p>
        <p>One-time code: <strong style="font-size:20px;letter-spacing:3px;">${otp}</strong></p>
        <p style="color:#888;font-size:12px;">This expires in 15 minutes. If you didn't request this, you can safely ignore this email — your password will not change.</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  isSmtpConfigured,
};
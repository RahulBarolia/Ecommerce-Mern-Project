import { client, sender } from "../config/mailtrap.config.js";

export const sendVerificationEmailOtp = async (
  email,
  username,
  verificationOtp
) => {
  try {
    const response = await client.send({
      from: sender,
      to: [{ email }],
      subject: "Verify Your Email",
      html: `<div>Hello ${username},<br><br>
              Thank you for signing up with Ecommerce! To complete your registration and verify your email address, please use the One-Time Password (OTP) provided below:<br><br>
              <strong>OTP:</strong> ${verificationOtp}<br><br>
              This OTP is valid for <strong>5 minutes</strong>. Please enter the code on the verification page to confirm your email.<br><br>
              Thank you!</div>`,
    });

    console.log("Email sent successfully:");
  } catch (error) {
    console.error("Error sending verification email:", error.message);
  }
};

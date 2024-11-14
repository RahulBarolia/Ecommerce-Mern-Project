import { client, sender } from "../config/mailtrap.config.js";

export const sendResetPasswordOtp = async (
  email,
  username,
  resetPasswordOtp
) => {
  try {
    const response = await client.send({
      from: sender,
      to: [{ email }],
      subject: "Verify Your Email",
      html: `<div>
                Hello ${username},<br></br>
                <br></br>
                To reset your password, please use the following One-Time Password (OTP):<br></br>
                <br></br>
                OTP: <strong>${resetPasswordOtp}</strong>
                <br></br>
                <p>
                    This OTP is valid for <strong>5 minutes</strong>.
                </p>
                <p>Thank you!</p>
            </div>`,
    });

    console.log("Email sent successfully:");
  } catch (error) {
    console.error("Error sending:", error.message);
  }
};

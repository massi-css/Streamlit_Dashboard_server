import nodemailer from "nodemailer";
import dotenv from "dotenv";


export const sendEmail = async (email, subject, text) => {
  try {
    dotenv.config();
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
    })
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.log("Error sending email", error);
    throw error;
  }
};

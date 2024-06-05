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
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
              body {
                  color: #E1DAD3;
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  width: 90% !important;
                  overflow-x: hidden;
              }
              .container {
                  border-radius: 10px;
                  background-color: #000000 !important;
                  color: #ffffff;
                  font-family: Arial, sans-serif;
                  width: 90%;
                  padding: 20px;
                  text-align: center;
                  overflow-x: hidden;
              }
              .image {
                  margin: 0 auto;
                  width: 340px;
                  height: auto;
                  display: block;
              }
              .text {
                  text-align: center;
                  margin-top: 10px;
                  background-color: #000000 !important;
                  border-radius: 10px;
                  font-weight: bold;
                  font-size: 28px;
                  padding: 10px;
                  color: #E1DAD3;
                  font-family: Arial, sans-serif;
              }
              h1{
                  color: #E1DAD3;
                  font: 700 40px/1.5 'Open Sans', sans-serif;
                  text-align: center;
                  padding-top: 20px;
                  padding-bottom: 20px;
                  margin-left: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Alert !</h1>
              <img src="https://i.imgur.com/7VAlgLG.png" alt="Email Image" class="image">
              <p class="text">${text}</p>
          </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    });
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.log("Error sending email", error);
    throw error;
  }
};

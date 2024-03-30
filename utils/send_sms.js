import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (message, phone) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.SENDER_PHONE,
      to: phone,
    });
    console.log("SMS sent successfully");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { sendSMS };

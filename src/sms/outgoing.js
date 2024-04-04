const twilio = require("twilio");
require("dotenv").config();
const db = require("../database/database");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

function sendSms(to, body) {
  return client.messages
    .create({
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: body,
    })
    .then((message) => {
      console.log(`Message sent: ${message.sid}`);
      return message;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
}

function sendDailyAmrut() {
  db.getAllPhoneNumbers().then((numbers) => {
    numbers.forEach((number) => {
      sendSms(
        number,
        "What is todays Amrut? \n\n End your message with :)  "
      )
        .then((response) => {
          console.log(`Message sent to ${number}`);
        })
        .catch((error) => {
          console.error(`Failed to send message to ${number}:`, error);
        });
    });
  });
}

module.exports = { sendSms, sendDailyAmrut };

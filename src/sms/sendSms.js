const twilio = require('twilio');
require("dotenv").config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


function sendSms(to, body) {
  client.messages
    .create({
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: body,
    })
    .then((message) => console.log(`Message sent: $(message.sid)`))
    .catch((error) => console.error(error));
}

module.exports = sendSms;

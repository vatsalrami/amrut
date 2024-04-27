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
      sendSms(number, "What is todays Amrut?\n\nEnd your message with :)")
        .then((response) => {
          console.log(`Message sent to ${number}`);
        })
        .catch((error) => {
          console.error(`Failed to send message to ${number}:`, error);
        });
    });
  });
}

function help() {
  const helpText =
    "Make sure to end your daily amrut with ':)' to save the entry.\n\nFor additional assistance, text 571-206-2288.";

  return Promise.resolve(helpText);
}

function signupName(messageBody, fromNumber) {
  const name = messageBody.substring(1).trim();
  return db
    .createUser(name, fromNumber)
    .then(() => {
      sendSms(fromNumber, "Welcome to Amrut!");
      sendSms(fromNumber, "Start off by adding me to your contacts.\n\nEveryday at 10pm, I will ask for that days Amrut. Simply reply and begin your journey of seeking Amrut :)\n\nFor more help, text '@help'.");
      return '';
    })
    .catch((error) => {
      console.error(error);
      reject("Failed to signup.");
    });
}

module.exports = { sendSms, sendDailyAmrut, help, signupName};

const db = require("../database/database");
const constants = require("../constants.js");
const moment = require("moment-timezone");

async function processIncomingSms(messageBody, fromNumber) {
  messageBody = messageBody.trim();

  if (await db.checkUserExists(fromNumber)) {
    if (messageBody.startsWith("@Help") || messageBody.startsWith("@help")) {
      return help();
    } else if (messageBody.endsWith(":)")) {
      return logAmrut(messageBody, fromNumber);
    } else {
      return Promise.resolve(
        "Hmm I don't understand... Text @Help for assistance."
      );
    }
  } else {
    if (messageBody.startsWith("@")) {
      return signupName(messageBody, fromNumber);
    }
    return Promise.resolve(
      "To finish signing up, please reply with '@' followed by your first name. Ex. (@Vatsal)"
    );
  }
}

function signupName(messageBody, fromNumber) {
  const name = messageBody.substring(1).trim();
  return db
    .createUser(name, fromNumber)
    .then(() => {
      return `Thank you, ${name}. Signup Successful!`;
    })
    .catch((error) => {
      console.error(error);
      reject("Failed to signup.");
    });
}

function logAmrut(messageBody, fromNumber) {
  const currentDateTimeEST = moment.tz(moment(), "America/New_York");
  const cutOff = constants.sendAmrutTime.substring(0, 2);

  if (currentDateTimeEST.hour() < cutOff) {
    currentDateTimeEST.subtract(1, "days");
  }

  const dateString = currentDateTimeEST.format("MM-DD-YYYY");

  messageBody = messageBody.substring(0, messageBody.length - 2).trim();

  return db
    .createNote(fromNumber, dateString, messageBody)
    .then(() => {
      return `${dateString} Amrut logged!`;
    })
    .catch((error) => {
      console.error(error);
      reject("Failed to log Amrut.");
    });
}

function help() {
  const helpText =
    "Make sure to end your daily amrut with ':)' to save the entry. \n\n For additional assistance, text 571-206-2288.";

  return Promise.resolve(helpText);
}

module.exports = { processIncomingSms };

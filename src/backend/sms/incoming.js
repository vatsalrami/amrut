const db = require("../database/database");
const constants = require("../constants.js");
const moment = require("moment-timezone");
const smsOutgoing = require("./outgoing");

async function processIncomingSms(messageBody, fromNumber) {
  messageBody = messageBody.trim();

  if (await db.checkUserExists(fromNumber)) {
    if (messageBody.startsWith("@Help") || messageBody.startsWith("@help")) {
      return smsOutgoing.help();
    } else if (messageBody == "@stop" || messageBody == "@Stop") {
      try {
        db.deleteUser(fromNumber);
        return Promise.resolve("Account successfully deactivated.");
      } catch (error) {
        console.error("Error deleting user:", error);
        return Promise.resolve(
          "Account could not be deactivated, please contact 571-206-2288"
        );
      }
    } else if (messageBody.endsWith(":)")) {
      return logAmrut(messageBody, fromNumber);
    } else {
      return Promise.resolve(
        "Hmm I don't understand... Text @Help for assistance."
      );
    }
  } else {
    if (messageBody.startsWith("@")) {
      return smsOutgoing.signupName(messageBody, fromNumber);
    }
    return Promise.resolve(
      "To finish signing up, please reply with '@' followed by your first name (Ex. @Vatsal)"
    );
  }
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

module.exports = { processIncomingSms };

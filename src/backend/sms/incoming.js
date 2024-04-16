const db = require("../database/database");

function processIncomingSms(messageBody, fromNumber) {
  messageBody = messageBody.trim();

  if (messageBody.startsWith("@Help") || messageBody.startsWith("@help")) {
    return help();
  } else if (messageBody.startsWith("@")) {
    return signupName(messageBody, fromNumber);
  } else if (messageBody.endsWith(":)")) {
    return logAmrut(messageBody, fromNumber);
  } else {
    return Promise.resolve(
      "Hmm I don't understand... Text @Help for assistance."
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
  const currentDateTime = new Date();
  const dateString = currentDateTime.toISOString().split("T")[0];
  messageBody = messageBody.substring(0, messageBody.length - 2);

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

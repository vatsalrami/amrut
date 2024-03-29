const { createUser } = require("../database/database");

function processIncomingSms(messageBody, fromNumber) {
  if (messageBody.startsWith("@")) {
    return signupName(messageBody, fromNumber);
  } else {
    return Promise.resolve("Message received but no action taken.");
  }
}

function signupName(messageBody, fromNumber) {
  const name = messageBody.substring(1).trim();
  return createUser(name, fromNumber)
    .then(() => {
      return `Thank you, ${name}. Signup Successful!`;
    })
    .catch((error) => {
      console.error(error);
      reject("Failed to signup.");
    });
}

module.exports = processIncomingSms;

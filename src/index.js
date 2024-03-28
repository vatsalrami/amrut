const sendSms = require("./sms/sendSms");
const { createUser } = require("./database/database.js");

const message = "Test text 1 2 3 4";
const phoneNumber = "+15712062288";

//sendSms(message, phoneNumber);
createUser('Jane', 'Doe', '1234567890')
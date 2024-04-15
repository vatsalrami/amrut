const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./database/database");
const smsIncoming = require("./sms/incoming");
const smsOutgoing = require("./sms/outgoing");
const twilio = require("twilio");
const cron = require("node-cron");
const moment = require("moment-timezone");
const app = express();

const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));
const MessagingResponse = twilio.twiml.MessagingResponse;

/* starts server on specified port */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:3000`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

/* cron job to send daily amrut */
const estTime = "23:10";
const utcTime = moment
  .tz(`${estTime}`, "HH:mm", "America/New_York")
  .utc()
  .format("HH:mm");
const [hour, minute] = utcTime.split(":");

cron.schedule(`${minute} ${hour} * * *`, () => {
  console.log("Sending Amrut @ 10PM EST");
  smsOutgoing.sendDailyAmrut();
});

/* post endpoint for frontend signup */
app.post("/submitPhoneNumber", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400).send("Phone number is required.");
  }
  if (db.checkUserExists(phoneNumber)) {
    res.status(400).send("Phone number already exists");
  } else {
    smsOutgoing.sendSms(
      phoneNumber,
      "Welcome to Amrut.\n\n To finish signing up, please reply with '@' followed by your first name. Ex. (@Vatsal)"
    );
    res.status(200).send(`Phone number ${phoneNumber} received and processed`);
  }
});

/* twilio webhook to handle incoming sms */
app.post("/sms/webhook", (req, res) => {
  const messageBody = req.body.Body;
  const fromNumber = req.body.From;

  console.log(`Incoming message from ${fromNumber}: ${messageBody}`);

  smsIncoming
    .processIncomingSms(messageBody, fromNumber)
    .then((responseMessage) => {
      const twiml = new MessagingResponse();
      twiml.message(responseMessage);
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    });
});

/* Endpoint to send Amrut Request*/
app.post("/sendAmrut", (req, res) => {
  smsOutgoing.sendDailyAmrut();
  res.status(200).send(`Amrut Text Sent`);
});

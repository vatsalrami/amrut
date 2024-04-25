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
const constants = require('./constants.js');
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
const estTime = constants.sendAmrutTime;
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
app.post("/submitPhoneNumber", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required.");
  }

  try {
    const userExists = await db.checkUserExists(phoneNumber);
    if (userExists) {
      return res.status(400).send("Phone number already exists");
    } else {
      smsOutgoing.sendSms(
        phoneNumber,
        "Welcome to Amrut.\n\n To finish signing up, please reply with '@' followed by your first name. Ex. (@Vatsal)"
      );
      return res
        .status(200)
        .send(`Phone number ${phoneNumber} received and processed`);
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).send("Error processing your request");
  }
});

app.post("/sms/webhook", (req, res) => {
  const messageBody = req.body.Body;
  const fromNumber = req.body.From;

  //validate request is from twilio
  const signature = req.headers["x-twilio-signature"];
  const url = "https://" + req.headers.host + req.originalUrl;
  const params = req.body;
  if (
    twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      signature,
      url,
      params
    )
  ) {
    console.log(`Incoming message from ${fromNumber}: ${messageBody}`);

    smsIncoming
      .processIncomingSms(messageBody, fromNumber)
      .then((responseMessage) => {
        const twiml = new MessagingResponse();
        twiml.message(responseMessage);
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
      });
  } else {
    res.status(403).send("Forbidden");
  }
});

/* Endpoint to send Amrut Request*/
app.post("/sendAmrut", (req, res) => {
  smsOutgoing.sendDailyAmrut();
  res.status(200).send(`Amrut Text Sent`);
});

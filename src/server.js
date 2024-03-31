const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/database");
const smsIncoming = require("./sms/incoming");
const smsOutgoing = require("./sms/outgoing");
const twilio = require("twilio");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("src/frontend"));
const MessagingResponse = twilio.twiml.MessagingResponse;

//starts server on specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//post endpoint for frontend signup
app.post("/submitPhoneNumber", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400).send("Phone number is required.");
  }
  smsOutgoing.sendSms(
    phoneNumber,
    "Welcome to Amrut.\n\n To finish signing up, please reply with '@' followed by your first name. Ex. (@Vatsal)"
  );
  res.status(200).send(`Phone number ${phoneNumber} received and processed`);
});

//twilio webhook to handle incoming sms
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


app.post("/sendAmrut", (req, res) => {
    smsOutgoing.sendDailyAmrut();
    res.status(200).send(`Amrut Text Sent`);
  });
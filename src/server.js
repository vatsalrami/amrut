const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("src/frontend"));
const { createUser } = require("./database/database");

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post("/submitPhoneNumber", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400).send("Phone number is required.");
  }

  createUser("John", "Doe", phoneNumber);
  res.status(200).send(`Phone number ${phoneNumber} received and processed`);
});

const admin = require("firebase-admin");

// Path to your JSON file
const serviceAccount = require("../../../firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

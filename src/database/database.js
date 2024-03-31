const db = require("./firebase.js");

function createUser(firstName, phoneNumber) {
  const userRef = db.collection("users");
  return userRef.add({
    firstName: firstName,
    phoneNumber: phoneNumber,
  });
}

function getUser(userId) {
  const userRef = db.collection("users").doc(userId);
  return userRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data();
    } else {
      console.log("No such User");
      return null;
    }
  });
}

function getAllPhoneNumbers() {
  return db
    .collection("users")
    .get()
    .then((snapshot) => {
      const numbers = [];
      snapshot.forEach((doc) => {
        numbers.push(doc.data().phoneNumber);
      });
      return numbers;
    })
    .catch((error) => {
      console.error("Error getting user phone numbers: ", error);
      return Promise.reject(error);
    });
}

function updateNote(userId, noteId, updatedContent) {
  const notesRef = db
    .collection("users")
    .doc(userId)
    .collection("notes")
    .doc(noteId);
  return notesRef.set(updatedContent);
}

function createNote(userId, date, message) {
  const notesRef = db.collection("users").doc(userId).collection("notes");
  return notesRef.add({
    date: date,
    message: message,
  });
}

module.exports = { createUser, getAllPhoneNumbers };

// function updateUser(userId, updatedInfo) {
//   const userRef = db.collection("users").doc(userId);
//   return userRef.set(updatedInfo);
// }

// function deleteUser(userId) {
//   const userRef = db.collection("users").doc(userId);
//   return userRef.delete();
// }

// function getNote(userId, date){
//     const notesRef = db.collection('users').doc(userId).collection('notes');
//     return notesRef.get().then(querySnapshot => {
//         const notes = [];
//         querySnapshot.forEach(doc => {
//             let note = doc.data();
//             note.id = doc.id; // Including the note ID in the data
//             notes.push(note);
//         });
//         return notes;
//     });
// }

// function deleteNote(userId, noteId) {
//   const notesRef = db
//     .collection("users")
//     .doc(userId)
//     .collection("notes")
//     .doc(noteId);
//   return notesRef.delete();
// }

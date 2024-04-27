const db = require("./firebase.js");

function createUser(firstName, phoneNumber) {
  const userRef = db.collection("users").doc(phoneNumber);
  return userRef.set({
    firstName: firstName,
    phoneNumber: phoneNumber,
  });
}

function getUser(phoneNumber) {
  try {
    return db.collection("users").doc(phoneNumber).get();
  } catch (error) {
    console.error("Error getting user: ", error);
    return Promise.reject(error);
  }
}

function checkUserExists(phoneNumber) {
  return db
    .collection("users")
    .doc(phoneNumber)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        return true;
      }
      return false;
    });
}

function getAllPhoneNumbers() {
  return db
    .collection("users")
    .get()
    .then((snapshot) => {
      const numbers = [];
      snapshot.forEach((doc) => {
        numbers.push(doc.id);
      });
      return numbers;
    })
    .catch((error) => {
      console.error("Error getting user phone numbers: ", error);
      return Promise.reject(error);
    });
}

function createNote(phoneNumber, date, message) {
  const notesRef = db
    .collection("users")
    .doc(phoneNumber)
    .collection("notes")
    .doc(date);

  return notesRef.get().then((doc) => {
    if (doc.exists) {
      return updateNote(notesRef, doc.data().message + " " + message);
    } else {
      return notesRef.set({
        date: date,
        message: message,
      });
    }
  });
}

function updateNote(notesRef, updatedMsg) {
  return notesRef.update({ message: updatedMsg });
}

module.exports = {
  createUser,
  getAllPhoneNumbers,
  createNote,
  checkUserExists,
  getUser,
};

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

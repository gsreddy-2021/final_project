const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyC2loWDaNS7FFKymeq3ryppOMPQ6B_BURI",
    authDomain: "kiei451-final-452f4.firebaseapp.com",
    projectId: "kiei451-final-452f4",
    storageBucket: "kiei451-final-452f4.appspot.com",
    messagingSenderId: "223326209430",
    appId: "1:223326209430:web:c6b5db5a314ed1a63b49b7",
    measurementId: "G-N8N9FWBJ5S"
} // replaced

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase
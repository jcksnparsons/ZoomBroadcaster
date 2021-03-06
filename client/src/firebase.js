import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  appId: process.env.VUE_APP_APP_ID,
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

if (location.hostname === "localhost") {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

// collection references
const usersCollection = db.collection("users");
const classroomsCollection = db.collection("classrooms");

const getRecordingsCollection = (cohortId) =>
  classroomsCollection.doc(cohortId).collection("recordings");

const googleProvider = new firebase.auth.GoogleAuthProvider();
const signIn = () => firebase.auth().signInWithPopup(googleProvider);

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  classroomsCollection,
  getRecordingsCollection,
  signIn,
};

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzAPQBVSMtqpR0UNlCtx_dlQKkOqH7-LI",
  authDomain: "harryconnectvalidation.firebaseapp.com",
  projectId: "harryconnectvalidation",
  storageBucket: "harryconnectvalidation.firebasestorage.app",
  messagingSenderId: "650421984578",
  appId: "1:650421984578:web:543cff21f60c0bb451bcdb",
  measurementId: "G-XXNQGQX20J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };

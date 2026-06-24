const { initializeApp } = require('firebase/app');
const { getAuth: getClientAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

const admin = require('./config/firebase');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCKpeWEC3AwwwZih9e5kQ3c8OKgG77oYdE",
  authDomain: "drivefleet-c8f98.firebaseapp.com",
  projectId: "drivefleet-c8f98"
};

const app = initializeApp(firebaseConfig);
const clientAuth = getClientAuth(app);

async function run() {
  try {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(clientAuth, 'test2@example.com', 'password123');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        userCredential = await signInWithEmailAndPassword(clientAuth, 'test2@example.com', 'password123');
      } else {
        throw e;
      }
    }
    const token = await userCredential.user.getIdToken();
    console.log("Got valid token. Length:", token.length);

    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      console.log("SUCCESS! Decoded token:", decoded.email);
    } catch (e) {
      console.log("FAIL! Firebase Admin error:", e.code, e.message);
    }
  } catch (err) {
    console.error("Fatal error:", err);
  }
}
run();

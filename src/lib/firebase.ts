// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcfBwodM0KEnL5HLPegokqs2A5nhbhHlY",
  authDomain: "main-website-93895.firebaseapp.com",
  projectId: "main-website-93895",
  storageBucket: "main-website-93895.firebasestorage.app",
  messagingSenderId: "741591827381",
  appId: "1:741591827381:web:cef6988d5a6edc926c8ffc"
};

// Initialize Firebase
let app;
console.log("--- Firebase Initialization Debug ---");
console.log("Target Project ID:", firebaseConfig.projectId);
console.log("Target API Key:", firebaseConfig.apiKey ? "Present (Starts with " + firebaseConfig.apiKey.substring(0, 5) + ")" : "MISSING");

try {
  if (getApps().length > 0) {
    const existingApp = getApp();
    console.log("Found existing app instance:", existingApp.name);
    // If the existing app is broken (missing API key), we delete it and start over
    if (!existingApp.options.apiKey || existingApp.options.apiKey === "dummy") {
      console.warn("Existing app is invalid/dummy. Re-initializing...");
      app = initializeApp(firebaseConfig);
    } else {
      app = existingApp;
    }
  } else {
    console.log("No existing app. Initializing [DEFAULT]...");
    app = initializeApp(firebaseConfig);
  }
} catch (e) {
  console.error("Firebase Initialization Critical Error:", e);
  // Fallback to avoid complete crash
  if (getApps().length > 0) app = getApp();
  else app = initializeApp(firebaseConfig);
}

console.log("Final App Configuration:", app.options.projectId);
console.log("-------------------------------------");

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

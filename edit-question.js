import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrZ9U2m7nv8aHCBBN7mUCNHMiB2J8ATIw",
  authDomain: "quizdb-ffc85.firebaseapp.com",
  databaseURL: "https://quizdb-ffc85-default-rtdb.firebaseio.com",
  projectId: "quizdb-ffc85",
  storageBucket: "quizdb-ffc85.appspot.com",
  messagingSenderId: "890541011519",
  appId: "1:890541011519:web:d6bcd1ea8f88ae15157e8a",
  measurementId: "G-EZK98N7CJ8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

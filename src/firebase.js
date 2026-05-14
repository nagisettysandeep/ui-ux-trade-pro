import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBsdv6-fpl6zn9oTZFQ4lq_1jL0heyS3z4",
  authDomain: "grow-app-internship.firebaseapp.com",
  projectId: "grow-app-internship",
  storageBucket: "grow-app-internship.firebasestorage.app",
  messagingSenderId: "831001948507",
  appId: "1:831001948507:web:d5a8c818c57161cf56aa7e",
  measurementId: "G-GC68VTLQXS"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBQNkYY2K1FjlQH6-w0Q04fzW_esJbSK2E",
  authDomain: "twitter-reloaded-67572.firebaseapp.com",
  projectId: "twitter-reloaded-67572",
  storageBucket: "twitter-reloaded-67572.appspot.com",
  messagingSenderId: "1077327019497",
  appId: "1:1077327019497:web:736cdd299da7c993815f78"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
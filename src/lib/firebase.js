import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDruiglrFlBmmAERH854sj86xigJ-VEXr4",
  authDomain: "abnehm-challange.firebaseapp.com",
  projectId: "abnehm-challange",
  storageBucket: "abnehm-challange.firebasestorage.app",
  messagingSenderId: "671338458322",
  appId: "1:671338458322:web:701c1f6e497ee10822510b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);



import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_qFQ3sfYueqZ8SLHNnn0ZieugAAjvl10",
  authDomain: "mddw-app.firebaseapp.com",
  projectId: "mddw-app",
  storageBucket: "mddw-app.firebasestorage.app",
  messagingSenderId: "553099343991",
  appId: "1:553099343991:web:6f5cbef598fc40c410ee72",
  measurementId: "G-9CRVLHRFEF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

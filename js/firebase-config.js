// Firebase SDK 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // 여기에 Firebase 설정 코드 붙여넣기
  apiKey: "AIzaSyA9-TRpYJ5H9s77BaYNIZw_fAJ29VG0VWk",
  authDomain: "hamster-encyclopedia.firebaseapp.com",
  projectId: "hamster-encyclopedia",
  storageBucket: "hamster-encyclopedia.firebasestorage.app",
  messagingSenderId: "608701207009",
  appId: "1:608701207009:web:c22a401b7ee934593ac2a0"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 및 Auth 서비스 내보내기
export const db = getFirestore(app);
export const auth = getAuth(app);
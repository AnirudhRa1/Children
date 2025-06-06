import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnfsVHwGcGlg7cxWZJH32tdm7Id62mjdo",
  authDomain: "crud-dc3c9.firebaseapp.com",
  projectId: "crud-dc3c9",
  storageBucket: "crud-dc3c9.firebasestorage.app",
  messagingSenderId: "342520694289",
  appId: "1:342520694289:web:620637ae4c5260037613b0",
  measurementId: "G-NV8Z4XS5WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
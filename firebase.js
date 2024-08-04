// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNcMHWXAPlgjXf-HWWmzyHfbm-1qnqPZs",
  authDomain: "inventory-management-2-49ce5.firebaseapp.com",
  projectId: "inventory-management-2-49ce5",
  storageBucket: "inventory-management-2-49ce5.appspot.com",
  messagingSenderId: "523189384178",
  appId: "1:523189384178:web:c3d793bb1df15a8cb6716b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
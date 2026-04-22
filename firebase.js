
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAJQuoLBYGSZ8_sqZT2lbQd7JidZx2QVM4",
    authDomain: "project-i01-c3424.firebaseapp.com",
    projectId: "project-i01-c3424",
    storageBucket: "project-i01-c3424.firebasestorage.app",
    messagingSenderId: "373225700253",
    appId: "1:373225700253:web:307cbdce4eb182830d0d74",
    measurementId: "G-X8S76HJFTD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

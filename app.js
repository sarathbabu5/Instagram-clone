// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_BZ9Y3dWykEDSNdo_CGiKaenJMGzUMPo",
  authDomain: "instagram-clone55.firebaseapp.com",
  databaseURL: "https://instagram-clone55-default-rtdb.firebaseio.com",
  projectId: "instagram-clone55",
  storageBucket: "instagram-clone55.appspot.com",
  messagingSenderId: "740432944595",
  appId: "1:740432944595:web:9636871180603608792326",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
document.getElementById("register").addEventListener("click", function () {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let name = document.getElementById("name").value;
  const auth = getAuth(app);
  createUserWithEmailAndPassword(auth, email, password, name)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;

      const db = getDatabase();
      set(ref(db, "users/" + user.uid), {
        password: password,
        email: email,
        name: name,
      }).then(() => {
        alert("Registered successfully");
        // Redirect to login page
        window.location.href = "login.html"; // Change to your login page URL
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode, errorMessage);
      console.log(errorCode);
    });
});

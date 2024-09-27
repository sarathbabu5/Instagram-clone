import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  onValue,
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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase();

document.getElementById("login").addEventListener("click", function () {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      const user_ref = ref(db, "users/" + user.uid);
      onValue(user_ref, (snapshot) => {
        const data = snapshot.val();
        console.log("data", data);
      });

      console.log("user", user);
      alert("login successfully");
      window.location.href = "./main.html";
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

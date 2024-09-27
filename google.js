import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

const auth = getAuth(app);

document.getElementById("button").addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      window.location.href = "main.html";
      console.log(user);

      //   document.getElementById("logout").style.display = "block";

      //   document.getElementById("logout").innerText = `logout `;

      //   alert("registered");
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});

// document.getElementById("logout").addEventListener("click", function () {
//   signOut(auth)
//     .then(() => {
//       // Sign-out successful.
//       console.log("sign-out successful");
//       alert("sign- out successful");
//       document.getElementById("logout").style.display = "none";
//     })
//     .catch((error) => {
//       alert(error);
//     });
// });

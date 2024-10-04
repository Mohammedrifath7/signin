import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDR8TFJn4zPxPYrutgolX3lpcKxUf_u5tA",
    authDomain: "resume-login-a31fd.firebaseapp.com",
    projectId: "resume-login-a31fd",
    storageBucket: "resume-login-a31fd.appspot.com",
    messagingSenderId: "165043189350",
    appId: "1:165043189350:web:bbad36da1ddbcf95fa9fa7",
    measurementId: "G-06DR3GGMVY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

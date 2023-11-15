//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyDY8eSK7PuXCbapYXKbw5xE8gZYRTHV330",
    authDomain: "comp1800-vanwater-202330.firebaseapp.com",
    projectId: "comp1800-vanwater-202330",
    storageBucket: "comp1800-vanwater-202330.appspot.com",
    messagingSenderId: "1026086169921",
    appId: "1:1026086169921:web:a2b110e7a549ec035045c0"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


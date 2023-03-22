import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, } from "firebase/firestore";
import { Analytics, getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, 
  signInWithPopup, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, sendEmailVerification,
  setPersistence, browserLocalPersistence, 
  UserCredential, User, 
  onAuthStateChanged, onIdTokenChanged } from "firebase/auth";

import * as admin from "firebase-admin";

import AuthError from "./AuthErrorCode";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Initialize Cloud Firestore and get a reference to the service
//const firestore: Firestore = getFirestore(app);
//const analytics: Analytics = getAnalytics(app);
let auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });



const signInWithGoogle = async () => {
  let persist = await setPersistence(auth, browserLocalPersistence).then(() => {
    return true;
  }).catch((error) => {
    return false;
  });
  const res = await signInWithPopup(auth, provider);
  
  return res;
};

const signOut = () => {
  return auth.signOut();
};

const connectWithEmailAndPassword = async (isSignin: boolean, email: string, password: string) => {
  
  let connect = null;
  try{
    if (isSignin) {
       connect = await signInWithEmailAndPassword(auth, email, password)
    } else{
      connect = await createUserWithEmailAndPassword(auth, email, password);
    }

    return connect;

  } catch (error: any) {

    let message = AuthError[error.code];
    throw message;
  }

  

}

const sendVerifEmail = async () => {
  const user = auth.currentUser;
  if (user) {
    let mail = await sendEmailVerification(user)
  }
};


const db = getFirestore(app);




export { signInWithGoogle, connectWithEmailAndPassword, sendVerifEmail, signOut };
export {onAuthStateChanged, onIdTokenChanged}
export { firebaseConfig, auth, db };
export type { UserCredential, User };

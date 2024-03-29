import { useState, createContext, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";

//client credentials
const firebaseConfig = {
  apiKey: "AIzaSyCSEHh9WZ_YC3INeQsG2Tqm5iv9YpiBMIA",
  authDomain: "asynclearning-e216e.firebaseapp.com",
  databaseURL: "https://asynclearning-e216e.firebaseio.com",
  projectId: "asynclearning-e216e",
  storageBucket: "asynclearning-e216e.appspot.com",
  messagingSenderId: "665630737781",
  appId: "1:665630737781:web:6e699c3642fa1fbf343f3c",
};

export const FirebaseContext = createContext();

export default function FirebaseProvider({ children }) {
  //whole app
  const [firebaseApp, setFirebaseApp] = useState();
  //the DB
  const [db, setDb] = useState();
  //authentication
  const [auth, setAuth] = useState();
  //load current user
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    //check if app is already running
    if (!firebaseApp && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //check if analytics is up
    if ("measurementId" in firebaseConfig) {
      firebase.analytics();
    }
    setFirebaseApp(firebase);
    setDb(firebase.firestore());
    setAuth(firebase.auth());

    firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const { uid, displayName, email } = user;
          setUser({ uid, displayName, email });
          setLoadingUser(true);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ firebaseApp, db, auth, user, setUser, loadingUser }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

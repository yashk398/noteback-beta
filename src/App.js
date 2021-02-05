import './App.css';
import React from 'react'
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app' 
import Navbar from './components/navbar'
import SignIn from './components/signin'

// CONFIG
firebase.initializeApp({
  apiKey: "AIzaSyCr9dpueAisQXJFqx8R0GfuyouMkjtNsaI",
    authDomain: "noteback-react.firebaseapp.com",
    databaseURL: "https://noteback-react-default-rtdb.firebaseio.com",
    projectId: "noteback-react",
    storageBucket: "noteback-react.appspot.com",
    messagingSenderId: "536228499712",
    appId: "1:536228499712:web:59908afe5b84c7d6e0a3e5"
});
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
        <section>
          {user ? <Navbar auth={auth} store={firestore}/>:<SignIn auth={auth}/>}
        </section>
    </div>
  );
}

export default App;

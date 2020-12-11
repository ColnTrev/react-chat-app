import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCYvRu213dh46ENNCZSQkr173n_te0vKRY",
  authDomain: "learn-fbase.firebaseapp.com",
  projectId: "learn-fbase",
  storageBucket: "learn-fbase.appspot.com",
  messagingSenderId: "856865854956",
  appId: "1:856865854956:web:8939187fe75ff6647e5cc9",
  measurementId: "G-PQTRYG6TKL"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <header>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return(<>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
    </div>
    <div ref={dummy}></div>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit">Submit</button>
    </form>
  </>)
}

function ChatMessage(props){
  const {text, uid} = props.message;
  return <p>{text}</p>
}

export default App;

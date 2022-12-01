import React, {useEffect,useState, useRef} from 'react';
import {Route, Link, Routes, useParams} from 'react-router-dom';
import ReactDOM from "react-dom/client";
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import {Login} from './Login';
import {Register} from './Register';
import { createPortal } from 'react-dom';



let chosenPlaylist = '';
let chosenTracks = [];
function App() {
  const ref = useRef();
  const params = useParams();
  const[currentForm,setCurrentForm] = useState('Login')
console.log(params)

const [track,setMessage] = useState('')

const handleChange = e=>{
  setMessage(e.target.value)

  console.log('Value is: ', e.target.value);
}

  const toggleForm = (formName) =>{
      setCurrentForm(formName);
  }
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(track);
  }

  const addToPlaylist = (track)=> {
    let currentPlaylist = '';
    const t = document.getElementById('addTracks');
    const row = document.createElement('tr');
    const item = document.createElement('th');

    if(currentPlaylist != chosenPlaylist) {
        chosenTracks = [];
        currentPlaylist = chosenPlaylist;
    }

    item.appendChild(document.createTextNode(`Track_id is: ${track}`));
    row.appendChild(item);
    t.appendChild(row);

    chosenTracks.push(track);
    
}


// const handleClick = e=>{
//   // 👇️ update input value
//    setMessage(e.target.value);

//   // // 👇️ access input value
//    console.log(e.target.value);
// }

  const [backendData, setBackendData] = useState([{}])

  const getByTrackName = useEffect(() => {
    
    const input = document.getElementById('track').value
    let list = document.getElementById('inventory')
    list.replaceChildren('')
    
    fetch(`/api/track/trackTitle/${track}`)
    .then(res => res.json()
    .then(data => {
        const l = document.getElementById('inventory');
        
        console.log(data)       
        data.forEach(element =>{
          fetch(`/api/tracks/${element}`)
            .then(res => res.json()
            .then(trackData => {
              trackData.forEach(e => {
                const item = document.createElement('li');//need to add a list
                item.appendChild(document.createTextNode(`Track_ID: ${e.track_id}, Track_Title: ${e.track_title}`));     
                l.appendChild(item)
              })
            })
          )
        })
       
    })
    )
    
    
  },[track])

  

  return (
    <div>
       <Header />
      {
        currentForm == "Login" ? <Login onFormSwitch = {toggleForm} /> : <Register onFormSwitch = {toggleForm}/>
        &&
        currentForm == "Body" ? <Body onFormSwitch = {toggleForm}/> : <Register onFormSwitch = {toggleForm}/>
      }
      {
        <div className = "app">
      <span>
<<<<<<< HEAD
      <input type = "text" id = "track" placeholder = "Search by Track Name" className = "search" name ="track"  onChange={handleChange} value = {track}></input>
      <button className = "trackBtn" id = "searchTrack">Search</button>
=======
      <input type = "text" id = "track" placeholder = "Search by Track Name" className = "search" name ="track" onChange={handleChange} value = {track} />
      <button className = "trackBtn" id ="searchTrack" onClick={handleSubmit}>Search</button>
>>>>>>> 0dc4c5151434ee4d6f7bb0ff665483e28f6c05e6
      <ol id = "inventory"></ol>
      </span>
      </div>
}
      {/* onClick = {getByTrackName}
       it works*/}
     
     
    
      <Footer />
    </div>
  );
}

export default App;
{/* <Body />
{(typeof backendData.title === 'undefined') ?(
 <p>loading</p>
):(
 backendData.title.map((user,i)=>(
   <p key = {i}>{user}</p>
 ))
)}  */}
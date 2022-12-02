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

  const [backendData, setBackendData] = useState([{}])

  const getByTrackName = useEffect(() => {
    let list = document.getElementById('playlistTracks')
    list.replaceChildren('')
    
    if(track != '') {
      fetch(`/api/track/trackTitle/${track}`)
      .then(res => res.json()
      .then(data => {
          populateTable(data);
      })
      )
    }
  },[track])

  


  function populateTable(data) {
    const l = document.getElementById('playlistTracks');     
    data.forEach(element =>{
      fetch(`/api/tracks/${element}`)
        .then(res => res.json()
        .then(data => {
          const row = document.createElement('tbody');
          const tr = document.createElement('tr');
          tr.classList = "data";
          const itemHeading = document.createElement('td');
          const itemImage = document.createElement('td');
          const itemTitle = document.createElement('td');
          const itemAlbum = document.createElement('td');
          const itemDuration = document.createElement('td');
          const itemAdd = document.createElement('td');
          itemHeading.className = "heading_num2";
          itemHeading.appendChild(document.createTextNode(`${data.track_id}`));     
          itemImage.className = "heading_image2";
          itemImage.appendChild(document.createTextNode('')); 
          itemTitle.className = "heading_title2";
          itemTitle.appendChild(document.createTextNode(`${data.track_title}`)); 
          itemAlbum.className = "heading_album2";
          itemAlbum.appendChild(document.createTextNode(`${data.album_title}`)); 
          itemDuration.className = "heading_duration2";
          itemDuration.appendChild(document.createTextNode(`${data.track_duration}`)); 
          itemAdd.className = "heading_add";
          itemAdd.appendChild(document.createTextNode('+')); 
          tr.appendChild(itemHeading);
          tr.appendChild(itemImage);
          tr.appendChild(itemTitle);
          tr.appendChild(itemAlbum);
          tr.appendChild(itemDuration);
          tr.appendChild(itemAdd);
          row.appendChild(tr);
          l.appendChild(row);
        })
      )
    })
  }

  return (
    <div>
       <Header />
      {
        currentForm === "Login" ? <Login onFormSwitch = {toggleForm} /> : <Register onFormSwitch = {toggleForm}/>
        &&
        currentForm === "Body" ? <Body onFormSwitch = {toggleForm}/> : <Register onFormSwitch = {toggleForm}/>
      }
      {
        <div className = "app">
      <span>
      <input type = "text" id = "track" placeholder = "Search by Track Name" className = "search" name ="track" onChange={handleChange} value = {track} />
      <button className = "trackBtn" id ="searchTrack" onClick={handleSubmit}>Search</button>
      <ol id = "inventory"></ol>
      </span>
      </div>
}
      <Footer />
    </div>
  );
}

export default App;
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

let chosenTracks = [];
let chosenPlaylist = '';

function App() {
  const params = useParams();
  const[currentForm,setCurrentForm] = useState('Login')
  //console.log(params)

  const [track,setMessageTrack] = useState('');
  const [artist,setMessageArtist] = useState('');
  const [album,setMessageAlbum] = useState('');
  const listNameRef = useRef(null);
  

  const handleChangeTrack = e=>{
    setMessageTrack(e.target.value);
  }

  const handleChangeArtist = e=>{
    setMessageArtist(e.target.value);
  }

  const handleChangeAlbum = e=>{
    setMessageAlbum(e.target.value);
  }

  const toggleForm = (formName) =>{
      setCurrentForm(formName);
  }
  
  const handleSubmit = (e) =>{
    e.preventDefault();
  }

  useEffect(() => {
    showAllPlaylists();
  }, [currentForm === "Body" || listNameRef])



  //Shows list of all playlists
  function showAllPlaylists() {
    if(currentForm === "Body") {
      const t = document.getElementById('allPlaylists');
      t.replaceChildren('');
    
      fetch('/api/playlist')
        .then(res => res.json()
        .then(data => {
          data.forEach(e => {
            const row = document.createElement('tr');
            const item = document.createElement('th');

            item.classList = "playlistCenter";

            item.addEventListener("click", function(){
              chosenPlaylist = (item.innerText.substring(0, item.innerText.indexOf(' •')));
              getPlaylistData(chosenPlaylist);
            });

            item.appendChild(document.createTextNode(`${e.name} • ${e.counter} songs, ${e.timer} duration`));
            row.appendChild(item);
            t.appendChild(row);
          })
        })
        )
    }
  }

  //Gets all tracks and their info from given playlist
  function getPlaylistData(playlist) {
    const list = document.getElementById('currentList');
    list.replaceChildren('');

    const h = document.createElement('h1');

    h.appendChild(document.createTextNode(`Current Playlist: ${chosenPlaylist}`));
    list.appendChild(h);

    fetch(`/api/playlist/tracks/${playlist}`)
      .then(res => res.json() 
      .then(data => {
        let temp = [];
        data.forEach(e => {
            temp.push(e.track_id)
        })
        populateTable(temp);
      })
      )
  }

  //Adds a new playlist
  function addNewPlaylist() {
    const newList = listNameRef.current.value;

    fetch(`/api/playlist/secure/${newList}`, {
      method: 'PUT'
    })
      .then(res => {
        res.json()
        .then(data => console.log(data))
        .catch(console.log('Failed to get json object'))
      })
      .catch()
  }
  
  //Update tracks in a playlist
  function updatePlaylist() {
    fetch(`/api/playlist/${chosenPlaylist}`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(chosenTracks)
    })
      .then(res => {
        if(res.ok)
        res.json()
          .then(data => console.log(data))
          .catch(console.log('Failed to get json objects'))
      })
      .catch()

      const t = document.getElementById('addTracks');
      t.replaceChildren('');

      chosenTracks = [];
  }

  //Adds track ids to an array
  function addToPlaylist(track) {
    let alreadyAdded = false;

    const t = document.getElementById('addTracks');
    const row = document.createElement('tr');
    const item = document.createElement('th');

    chosenTracks.forEach(e => {
      if (track == e){
        alreadyAdded = true;
      }
    })

    if(alreadyAdded == false) {
      item.appendChild(document.createTextNode(`Track_id is: ${track}`));
      row.appendChild(item);
      t.appendChild(row);
  
      chosenTracks.push(track);
      console.log(JSON.stringify(chosenTracks))
    } 
  }

  const getByTrackName = useEffect(() => {
    if(track !== '') {
      fetch(`/api/track/trackTitle/${track}`)
      .then(res => res.json()
      .then(data => {
          changeHeadings("track");
          populateTable(data);
      })
      )
    } else if(track === '' && currentForm === "Body") {
      let list = document.getElementById('playlistTracks')
      list.replaceChildren('')
    }
  },[track])

  const getByArtistName = useEffect(() => {
    if(artist !== '') {
      fetch(`/api/artists/artist/${artist}`)
      .then(res => res.json()
      .then(data => {
          changeHeadings("artist");
          populateTableArtist(data);
      })
      )
    } else if(artist === '' && currentForm === "Body") {
      let list = document.getElementById('playlistTracks')
      list.replaceChildren('')
    }
  },[artist])

  const getByAlbumName = useEffect(() => {
    if(album !== '') {
      fetch(`/api/tracks/album/${album}`)
      .then(res => res.json()
      .then(data => {
          changeHeadings("album");
          populateTable(data);
      })
      )
    } else if(album === '' && currentForm === "Body") {
      let list = document.getElementById('playlistTracks')
      list.replaceChildren('')
    }
  },[album])

  
  function changeHeadings (type) {
    if (type === "track" || type === "album") {
      let list = document.getElementById('playlistHeadings')
      list.replaceChildren('')

      const row = document.createElement('thead');
      const tr = document.createElement('tr');
      tr.id = "heading";

      const itemHeading = document.createElement('th');
      const itemImage = document.createElement('th');
      const itemTitle = document.createElement('th');
      const itemAlbum = document.createElement('th');
      const itemDuration = document.createElement('th');
      const itemAdd = document.createElement('th');

      itemHeading.className = "heading_num";
      itemImage.className = "heading_image";
      itemTitle.className = "heading_title";
      itemAlbum.className = "heading_album";
      itemDuration.className = "heading_duration";
      itemAdd.className = "heading_add";

      itemHeading.appendChild(document.createTextNode('#')); 
      itemImage.appendChild(document.createTextNode('')); 
      itemTitle.appendChild(document.createTextNode('Title')); 
      itemAlbum.appendChild(document.createTextNode('Album')); 
      itemDuration.appendChild(document.createTextNode('Duration')); 
      itemAdd.appendChild(document.createTextNode('')); 

      tr.appendChild(itemHeading);
      tr.appendChild(itemImage);
      tr.appendChild(itemTitle);
      tr.appendChild(itemAlbum);
      tr.appendChild(itemDuration);
      tr.appendChild(itemAdd);

      row.appendChild(tr);
      list.appendChild(row);

    } else if (type === "artist") {
      let list = document.getElementById('playlistHeadings')
      list.replaceChildren('')

      const row = document.createElement('thead');
      const tr = document.createElement('tr');
      tr.id = "heading";

      const itemHeading = document.createElement('th');
      const itemImage = document.createElement('th');
      const itemTitle = document.createElement('th');
      const itemAlbum = document.createElement('th');
      const itemDuration = document.createElement('th');
      const itemAdd = document.createElement('th');

      itemHeading.className = "heading_artistid";
      itemImage.className = "heading_artistimg";
      itemTitle.className = "heading_artistfav";
      itemAlbum.className = "heading_artistname";
      itemDuration.className = "heading_artisthandle";
      itemAdd.className = "heading_artistadd";

      itemHeading.appendChild(document.createTextNode('Artist ID')); 
      itemImage.appendChild(document.createTextNode('')); 
      itemTitle.appendChild(document.createTextNode('Artist Favorites')); 
      itemAlbum.appendChild(document.createTextNode('Artist Name')); 
      itemDuration.appendChild(document.createTextNode('Artist Handle')); 
      itemAdd.appendChild(document.createTextNode('')); 

      tr.appendChild(itemHeading);
      tr.appendChild(itemImage);
      tr.appendChild(itemTitle);
      tr.appendChild(itemAlbum);
      tr.appendChild(itemDuration);
      tr.appendChild(itemAdd);

      row.appendChild(tr);
      list.appendChild(row);
    }
  }

  function populateTable(data) {
    let list = document.getElementById('playlistTracks')
    list.replaceChildren('')

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
          itemImage.className = "heading_image2";
          itemTitle.className = "heading_title2";
          itemAlbum.className = "heading_album2";
          itemDuration.className = "heading_duration2";
          itemAdd.className = "heading_add";

          itemAdd.addEventListener("click", function() {
            addToPlaylist(data.track_id);
          })

          itemHeading.appendChild(document.createTextNode(`${data.track_id}`));
          itemImage.appendChild(document.createTextNode('')); 
          itemTitle.appendChild(document.createTextNode(`${data.track_title}`)); 
          itemAlbum.appendChild(document.createTextNode(`${data.album_title}`)); 
          itemDuration.appendChild(document.createTextNode(`${data.track_duration}`)); 
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

  function populateTableArtist(data) {

    let list = document.getElementById('playlistTracks')
    list.replaceChildren('')

    const l = document.getElementById('playlistTracks');  
       
    data.forEach(element =>{
      fetch(`/api/artists/${element}`)
        .then(res => res.json()
        .then(data => {

          const row = document.createElement('tbody');
          const tr = document.createElement('tr');

          tr.classList = "data";

          const itemID = document.createElement('td');
          const itemIMG = document.createElement('td');
          const itemFav = document.createElement('td');
          const itemName = document.createElement('td');
          const itemHandle = document.createElement('td');
          const itemAdd = document.createElement('td');

          itemID.className = "heading_artistid2";
          itemIMG.className = "heading_artistimg";
          itemFav.className = "heading_artistfav2";
          itemName.className = "heading_artistname2";
          itemHandle.className = "heading_artisthandle2";
          itemAdd.className = "heading_artistadd";

          itemID.appendChild(document.createTextNode(`${data.artist_id}`));     
          itemIMG.appendChild(document.createTextNode('')); 
          itemFav.appendChild(document.createTextNode(`${data.artist_favorites}`)); 
          itemName.appendChild(document.createTextNode(`${data.artist_name}`)); 
          itemHandle.appendChild(document.createTextNode(`${data.artist_handle}`)); 
          itemAdd.appendChild(document.createTextNode('')); 

          tr.appendChild(itemID);
          tr.appendChild(itemIMG);
          tr.appendChild(itemFav);
          tr.appendChild(itemName);
          tr.appendChild(itemHandle);
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
        currentForm === "Body" ? <Body onFormSwitch = {toggleForm} /> : <Register onFormSwitch = {toggleForm}/>
      }
      
      
      {
        currentForm === "Body" &&
            <div className = "app">
              <span>
                <input type = "text" id = "track" placeholder = "Search by Track Name" className = "search" name ="track" onChange={handleChangeTrack} value = {track} onBlur = {() => this.inputField.value = ""} />
                <button className = "trackBtn" id ="searchTrack" onClick={handleSubmit}>Search</button>
              </span>
              <span>
                  <input type = "text" id = "artist" placeholder="Search by Artist Name" className = "search" name = "artist" onChange={handleChangeArtist} value = {artist} onBlur = {() => this.inputField.value = ""} />
                  <button type="submit" className = "artistBtn" id = "searchArtist" onClick={handleSubmit}>Search</button>
              </span>
              <span>
                  <input type = "text" id = "album" placeholder="Search by Album Name" className = "search" name = "album" onChange={handleChangeAlbum} value = {album} onBlur = {() => this.inputField.value = ""} />
                  <button type="submit" className = "albumBtn" id = "searchAlbum" onClick={handleSubmit}>Search</button>
              </span>

              <button type="submit" className = "refreshPlaylists" id = "refreshPlaylists" onClick = {showAllPlaylists}>Refresh Playlists</button>

              <div>
                  <span>
                      <input type = "text" id = "newplaylist" placeholder="New playlist name" className = "search" name = "newplaylist" ref = {listNameRef}/>
                      <button type="submit" className = "playlistBtn" id = "addPlaylist" onClick = {addNewPlaylist}>Add</button>
                  </span>
              </div>

              <button type="submit" className = "addToPlaylist" id = "addToPlaylist" onClick = {updatePlaylist}>Add to Playlist</button>
              <button type="submit" className = "deletePlaylist" id = "deletePlaylist">Delete Playlist</button>

              <div id = 'currentList'><h1>Current Playlist: </h1>
              </div>

            </div>
        
      }

      <Footer />
    </div>
  );
}

export default App;
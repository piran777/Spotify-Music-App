import React, { useEffect, useState } from 'react'

let chosenPlaylist = '';

export default function SeePublicPlaylists() {
    const [review,setReview] = useState('');

    useEffect(() => {
        showAllPlaylists();
    }, [])

    const handleReview = e=>{
        setReview(e.target.value);
    }


    //Shows list of up to 10 public playlists
    function showAllPlaylists() {
        const t = document.getElementById('allPlaylists');
        t.replaceChildren('');
    
        fetch('/api/playlist/unauth')
        .then(res => res.json()
        .then(data => {
            data.forEach(e => {
            const row = document.createElement('tr');
            const item = document.createElement('th');

            item.classList = "playlistCenter";

            item.addEventListener("click", function(){
                chosenPlaylist = (item.innerText.substring(0, item.innerText.indexOf(' •')));
                getPlaylistData(e.name, e.creator);
            });

            item.appendChild(document.createTextNode(`${e.name} • ${e.counter} songs, ${e.timer} duration`));
            item.appendChild(document.createElement('br'));
            item.appendChild(document.createTextNode(`Creator Name: ${e.creator}`))
            item.appendChild(document.createElement('br'));
            item.appendChild(document.createTextNode(`Playlist Rating: ${e.rating}`))
            row.appendChild(item);
            t.appendChild(row);
            })
        })
        )
    }

    //Gets all tracks and their info from given playlist
    function getPlaylistData(playlist, creator) {
    let temp = playlist + "_" + creator;
    const list = document.getElementById('currentList');
    list.replaceChildren('');

    const h = document.createElement('h1');

    h.appendChild(document.createTextNode(`Current Playlist: ${chosenPlaylist}`));
    list.appendChild(h);

    fetch(`/api/playlist/tracks/${temp}`)
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

  function newReview() {
    fetch(`/api/playlist/secure/rating/${chosenPlaylist}`, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: {
            email: localStorage.getItem('email'),
            rating: review
        }
    })
        .then(res => res.json()
        .then(data => {
            alert(data);
        })
        )
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
          const itemTitle = document.createElement('td');
          const itemAlbum = document.createElement('td');
          const itemDuration = document.createElement('td');
          const itemAdd = document.createElement('td');

          const linkName = `https://www.youtube.com/results?search_query=${data.track_title.split(' ').join('+')}`;
          const link = document.createElement('a');
          link.href = linkName;
          link.target = "_blank";

          itemHeading.className = "heading_num2";
          link.className = "heading_image2";
          itemTitle.className = "heading_title2";
          itemAlbum.className = "heading_album2";
          itemDuration.className = "heading_duration2";
          itemAdd.className = "heading_add";


          itemAdd.addEventListener("click", function() {
            getDetails(data);
          })

          itemHeading.appendChild(document.createTextNode(`${data.track_id}`));
          link.appendChild(document.createTextNode('►')); 
          itemTitle.appendChild(document.createTextNode(`${data.track_title}`)); 
          itemAlbum.appendChild(document.createTextNode(`${data.album_title}`)); 
          itemDuration.appendChild(document.createTextNode(`${data.track_duration}`)); 
          itemAdd.appendChild(document.createTextNode('+')); 

          tr.appendChild(itemHeading);
          tr.appendChild(link);
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


  function getDetails(data) {
    let list = document.getElementById('trackDetails');
    list.replaceChildren(''); 

    const rows = document.createElement('tbody');
    const tr = document.createElement('tr');
    const linkName = `https://www.youtube.com/results?search_query=${data.track_title.split(' ').join('+')}`;
    const link = document.createElement('a');
    link.href = linkName;
    link.target = "_blank";
    link.innerText = 'Play on Youtube: ►';

    tr.appendChild(document.createTextNode(`Track ID: ${data.track_id}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(document.createTextNode(`Track Name: ${data.track_title}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(document.createTextNode(`Artist ID: ${data.artist_id}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(document.createTextNode(`Artist Name: ${data.artist_name}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(document.createTextNode(`Track Duration: ${data.track_duration}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(document.createTextNode(`Album ID: ${data.album_id}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(document.createTextNode(`Album Title: ${data.album_title}`));
    tr.appendChild(document.createElement('br'));
    tr.appendChild(link);
    
    rows.appendChild(tr);
    
    list.appendChild(rows);
}


    return(<>
    <div className = "playlist">
            <div>
                <table id = "playlistHeadings">
                    <thead>
                        <tr id = "heading">
                            <th className = "heading_num">#</th>
                            <th className = "heading_image"></th>
                            <th className = "heading_title">Title</th>
                            <th className = "heading_album">Album</th>
                            <th className = "heading_duration">Duration</th>
                            <th className = "heading_add"></th>
                        </tr>
                    </thead>
                </table>
                <table id = "playlistTracks">
                    <tbody>
                        <tr id = "data">
                        </tr>
                    </tbody>
                </table>
            </div>
            <ol id = "songs"></ol>
        </div>

        <div className = "playlists">
            <table id = "allPlaylists">
            </table>
        </div>

        <div className = "trackList">
              <table id = "trackDetails">
              </table>
        </div>

        <div className = 'newReview'>
            <p>Select a number below as a review for this playlist:</p>
            <select name= "review" id="review" onChange={handleReview}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            <br></br>
            <br></br>
            <button className = "button buttonReview"  onClick = {newReview}>Submit Review</button>
        </div>

        <div id = 'currentList'><h1>Current Playlist: </h1>
        </div>
    </>)
}
import React, { useEffect, useState } from 'react'
import './search.css';

export default function SearchTracks() {
    const [track, setTrack] = useState('');

    const handleChangeTrack = e => {
        setTrack(e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
    }

    useEffect(() => {
        if(track !== '') {
            fetch(`/api/track/trackTitle/${track}`)
            .then(res => res.json()
            .then(data => {
                populateTable(data);
            })
            )
        } else if (track === '') {
            let list = document.getElementById('allTracks')
            list.replaceChildren('')
        }
    }, [track])


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


    function populateTable(data) {
        let list = document.getElementById('allTracks');
        list.replaceChildren(''); 
    
        data.forEach(element =>{
          fetch(`/api/tracks/${element}`)
            .then(res => res.json()
            .then(data => {
    
              const row = document.createElement('tbody');
              const tr = document.createElement('tr');
              tr.classList = "data";
    
              const itemSong = document.createElement('td');
              const itemArtist = document.createElement('td');
              const linkName = `https://www.youtube.com/results?search_query=${data.track_title.split(' ').join('+')}`;
              const itemYoutube = document.createElement('a');
              itemYoutube.href = linkName;
              itemYoutube.target = "_blank";
              itemYoutube.innerText = '►';
    
              itemSong.className = "heading_song2";
              itemArtist.className = "heading_artist2";
              itemYoutube.className = "heading_youtube2";
    
              tr.addEventListener("click", function() {
                getDetails(data);
              })
    
              itemSong.appendChild(document.createTextNode(`${data.track_title}`));
              itemArtist.appendChild(document.createTextNode(`${data.artist_name}`));
    
              tr.appendChild(itemSong);
              tr.appendChild(itemArtist);
              tr.appendChild(itemYoutube);
              
              row.appendChild(tr);
              list.appendChild(row);
            })
          )
        })
      }


    return (<>
        <span>
            <input type = "text" className = "searchName" placeholder = "Search for Track" onChange={handleChangeTrack} value = {track} />
            <button className = "button buttonName" onClick={handleSubmit}>Search</button>
        </span>

        
        <div className = "track">
            <table id = "patientHeadings">
                <thead>
                    <tr id = "heading">
                        <th className = "heading_song">Song</th>
                        <th className = "heading_artist">Artist</th>
                        <th className = "heading_youtube">Play on Youtube►</th>
                    </tr>
                </thead>
            </table>
            <table id = "allTracks">
                <tbody>
                    <tr id = "data">
                    </tr>
                </tbody>
            </table>
        </div>

        <div className = 'trackInfo'>
            <table id = 'trackDetails'>
            </table>
        </div>
    </>)
}
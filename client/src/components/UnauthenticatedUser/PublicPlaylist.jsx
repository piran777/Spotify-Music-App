import React, { useEffect, useState } from 'react'

let chosenPlaylist = '';

export default function SeePublicPlaylists() {


    useEffect(() => {
        showAllPlaylists();
      }, [])

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
                getPlaylistData(chosenPlaylist);
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
        //populateTable(temp);
      })
      )
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
              <table id = "addTracks">
              </table>
        </div>

        <div id = 'currentList'><h1>Current Playlist: </h1>
        </div>
    </>)
}
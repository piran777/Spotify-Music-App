import React from 'react';
const handleSubmit = (e) =>{
    e.preventDefault();
  
  }
function Body() {
    return (
        <form onSubmit = {handleSubmit}>
        <div>
            <div className = "admin">
                {/* <span>
                    <input type = "text" id = "track" placeholder="Search by Track Name" className = "search" name = "track" />
                    <button className = "trackBtn" id = "searchTrack">Search</button>
                </span> */}
                <span>
                    <input type = "text" id = "artist" placeholder="Search by Artist Name" className = "search" name = "artist" />
                    <button type="submit" className = "artistBtn" id = "searchArtist">Search</button>
                </span>
                <span>
                    <input type = "text" id = "album" placeholder="Search by Album Name" className = "search" name = "album" />
                    <button type="submit" className = "albumBtn" id = "searchAlbum">Search</button>
                </span>
            </div>
            

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

            <button type="submit" className = "refreshPlaylists" id = "refreshPlaylists">Refresh Playlists</button>

            <div>
                <span>
                    <input type = "text" id = "newplaylist" placeholder="New playlist name" className = "search" name = "newplaylist" />
                    <button type="submit" className = "playlistBtn" id = "addPlaylist">Add</button>
                </span>
            </div>

            <div className = "trackList">
                <table id = "addTracks">
                </table>
            </div>

            <button type="submit" className = "addToPlaylist" id = "addToPlaylist">Add to Playlist</button>
            <button type="submit" className = "deletePlaylist" id = "deletePlaylist">Delete Playlist</button>

            <script defer src = "App.js"></script>
        </div>
        </form>
    )
}

export default Body;
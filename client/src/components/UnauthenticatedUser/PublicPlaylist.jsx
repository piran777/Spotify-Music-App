import React, { useEffect, useState } from 'react'

export default function SeePublicPlaylists() {

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
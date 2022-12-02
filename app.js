const express = require('express');
const mysql = require('mysql2');
const sanitizeHtml = require('sanitize-html');
const app = express();
const port = 3000;
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');

//Creates Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'martin123',
    database: 'playlistdata'
});

//Connect to MySQL
db.connect(err =>  {
    if (err) throw err;
    console.log("Connected to MySQL");
});


let genreDataFinal, genreDataInitial = [];
let artistDataFinal, artistDataInitial = [];
let trackDataFinal, trackDataInitial = [];

let playlists;
let sqlCheck = 'SELECT * FROM playlistnames';
let query = db.query(sqlCheck, (err, results) => {
    if(err) throw err;
    playlists = results;
})



fs.createReadStream('lab3-data/raw_artists.csv')
.pipe(csv())
.on('data', (rows) => {
    artistDataInitial.push(rows)
    artistDataFinal = artistDataInitial.map((rows) => {
        return {
            'artist_id':rows.artist_id,
            'artist_handle':rows.artist_handle,
            'artist_name':rows.artist_name,
            'artist_date_created':rows.artist_date_created,
            'artist_location':rows.artist_location,
            'artist_favorites':rows.artist_favorites,
            'tags':rows.tags
        }
    });
})
.on ('end', () => {
});

fs.createReadStream('lab3-data/genres.csv')
.pipe(csv())
.on('data', (rows) => {
    genreDataInitial.push(rows)
    genreDataFinal = genreDataInitial.map((rows) => {
        return {
            'genre_id':rows.genre_id,
            'parent_id':rows.parent,
            'title':rows.title
        }
    });
})
.on ('end', () => {
});

fs.createReadStream('lab3-data/raw_tracks.csv')
.pipe(csv())
.on('data', (rows) => {
    trackDataInitial.push(rows)
    trackDataFinal = trackDataInitial.map((rows) => {
        return {
            'track_id':rows.track_id,
            'album_id':rows.album_id,
            'album_title':rows.album_title,
            'artist_id':rows.artist_id,
            'artist_name':rows.artist_name,
            'tags':rows.tags,
            'track_date_created':rows.track_date_created,
            'track_date_recorded':rows.track_date_recorded,
            'track_duration':rows.track_duration,
            'track_genres':rows.track_genres,
            'track_number':rows.track_number,
            'track_title':rows.track_title
        }
    });
})
.on ('end', () => {
});


//Setup serving front-end code
app.use('/', express.static('client'));

//Setup middleware to do logging
app.use((req, res, next) => { //For all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); //Keep going
});

//Parse data in body as JSON
router.use(express.json());

//Create Database
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE playlistdata';
    db.query(sql, err => {
        if (err) throw err;
        res.send('Database Created');
    })
})

//Create Table to store playlistnames
app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE playlistnames(playlistname VARCHAR(30) NOT NULL, id int AUTO_INCREMENT NOT NULL, PRIMARY KEY(id))';
    db.query(sql, err => {
        if (err) throw err;
        res.send('Table Created');
    })
})

//Gets genres
app.get('/api/genres', (req, res) => {
    res.send(genreDataFinal);
});

//Gets artist from artist ID
app.get('/api/artists/:artist_id', (req, res) => {
    const id = req.params.artist_id;
    const artist = artistDataFinal.find(p => p.artist_id === id);
    if(artist) {
        res.send(artist);
    } else {
        res.status(404).send(`Artist with ID ${id} was not found`);
    }
});

//Get track details from track ID
app.get('/api/tracks/:track_id', (req, res) => {
    const id = req.params.track_id;
    const track = trackDataFinal.find(p => p.track_id === id);
    if(track) {
        res.send(track);
    } else {
        res.status(404).send(`Track with ID ${id} was not found`);
    }
});

//Get track ID from album name
app.get('/api/tracks/album/:album_title', (req, res) => {
    const title = String.prototype.toLowerCase.call(req.params.album_title);
    let max = 0;
    let trackArray = [];

    trackDataFinal.forEach(track => {
        if((String.prototype.toLowerCase.call(track.album_title)).includes(title)){
            if(max < 8) {
                trackArray.push(track.track_id);
                max++;
            } 
        }
    })
    
    if(trackArray != []) {
        res.send(trackArray);
    } else {
        res.status(404).send(`Track from album: ${id} was not found`);
    }
});

//Get track ID from track title
app.get('/api/track/trackTitle/:track_title', (req, res) => {
    const title = String.prototype.toLowerCase.call(req.params.track_title);
    let max = 0;
    let trackArray = [];

    trackDataFinal.forEach(track => {
        if((String.prototype.toLowerCase.call(track.track_title)).includes(title)){
            if(max < 8) {
                trackArray.push(track.track_id);
                max++;
            } 
        }
    })
    
    if(trackArray != []) {
        res.send(trackArray);
    } else {
        res.status(404).send(`Track with name: ${id} was not found`);
    }
});

//Get artist ID from artist name
app.get('/api/artists/artist/:artist_name', (req, res) => {
    const name = String.prototype.toLowerCase.call(req.params.artist_name);
    let nameArray = [];
    let max = 0;

    artistDataFinal.forEach(artist => {
        if((String.prototype.toLowerCase.call(artist.artist_name)).includes(name)){
            if(max < 8) {
               nameArray.push(artist.artist_id);
               max++; 
            }
        }
    })
    
    if(nameArray != []) {
        res.send(nameArray);
    } else {
        res.status(404).send(`Artist with name: ${id} was not found`);
    }
});

//Create new Playlist
router.put('/admin/:name', (req, res) => {
    res.send("Admin playlist");
});

router.put('/secure/:name', (req, res) => {
    res.send("Secure playlist");
});

router.put('/open/:name', (req, res) => {
    res.send("Open playlist");
});

//Convert to full time format
function timeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


//Add playlist name to table
function addPlaylist(newList) {
    let sql = `
    INSERT INTO playlistnames(
        playlistname
    )
    VALUES(
        '${newList}'
    )`;
    db.query(sql, err => {
        if (err) throw err;
    })
    return;
}

//Install the router at /api/parts
app.use('/api/playlist', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}); 
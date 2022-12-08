require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const sanitizeHtml = require('sanitize-html');
const app = express();
const port = 3000;
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer');
var validator = require("email-validator");

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
let sqlCheck = 'SELECT * FROM playlistnames ORDER BY lastModified';
let query = db.query(sqlCheck, (err, results) => {
    if(err) throw err;
    playlists = results;
})


let loginInfos = [] ;
let sqlCheck2 = 'SELECT * FROM logininfo';
let query2 = db.query(sqlCheck2, (err, results) => {
    if(err) throw err;
    loginInfos = results;
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
    let sql = 'CREATE TABLE playlistnames(playlistname VARCHAR(100) NOT NULL, id int AUTO_INCREMENT NOT NULL, visibility VARCHAR(10) DEFAULT "False", rating VARCHAR(100) default "No Ratings Available", lastModified DATE DEFAULT (curdate()), creator VARCHAR(100) default "Unknown", PRIMARY KEY(id))';
    db.query(sql, err => {
        if (err) throw err;
        res.send('Table Created');
    })
})

app.get('/createtableLogin', (req, res) => {
    let sql = 'CREATE TABLE logininfo(name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, AccessToken VARCHAR(400), RefreshToken VARCHAR(400), deactivate VARCHAR(100), admin VARCHAR(100), id int AUTO_INCREMENT NOT NULL, PRIMARY KEY(id))';
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

    artistDataFinal.forEach(artist => {
        if((String.prototype.toLowerCase.call(artist.artist_name)).includes(name)){
            nameArray.push(artist.artist_id);
        }
    })
    
    if(nameArray != []) {
        res.send(nameArray);
    } else {
        res.status(404).send(`Artist with name: ${id} was not found`);
    }
});

//Create new Playlist
router.put('/secure/:name', async (req, res) => {
    const newPlaylist = String.prototype.toLowerCase.call(req.params.name) + "_" + req.body.email;
    const name = req.body.email + '_playlists';

    console.log("Playlist:", newPlaylist);

    let sqlCheckCount = 'SELECT COUNT(playlistnames) AS noOfPlaylists FROM `' + name + '`';
    db.query(sqlCheckCount, (err, data) => {
        if (err) throw err

        if(data[0].noOfPlaylists == 20) {
            res.send('Already reached max amount of creatable playlists')
        } else {

            let identical = false;
            let sqlCheckExists = 'SELECT playlistnames FROM `' + name + '`';
            db.query(sqlCheckExists, (err, results) => {
                if (err) throw err;
                for(let i = 0; i < results.length; i++) {
                    if(String.prototype.toLowerCase.call(results[i].playlistnames) === newPlaylist) {
                        identical = true;
                    }
                }

                if(identical == false) {
                    console.log('Creating new playlist');
                    let sql = 'CREATE TABLE `' + newPlaylist + '`(track_id VARCHAR(100) NOT NULL, track_duration VARCHAR(50) NOT NULL, id int AUTO_INCREMENT NOT NULL, PRIMARY KEY(id))';
                    db.query(sql, err => {
                        if (err) throw err;

                        addToUserPlaylists(newPlaylist, req.body.email);

                        let sqlCreator = 'SELECT creator from `' + name + '`';
                        db.query(sqlCreator, (err, result) => {
                            if (err) throw err;
                            addPlaylist(newPlaylist, result[0].creator);
                        })
                    })
                    
                    let sqlUpdate = 'SELECT * FROM playlistnames';
                    query = db.query(sqlUpdate, (err, results) => {
                        if(err) throw err;
                        let newListToAdd = {
                            playlistname: newPlaylist,
                            id: playlists[playlists.length - 1].id + 1
                        }
                        playlists.push(newListToAdd);
                        res.send(newPlaylist + ' playlist created')
                    })
                    
                } else if(identical == true) {
                    console.log('Playlist already exists');
                    res.sendStatus(400);
                }
            })
        }
    })
});

router.put('/open/:name', (req, res) => {
    res.send("Open playlist");
});

async function isEmailValid(email) {
    return emailValidator.validate(email)
  }
  

 router.post('/secure/register/unauth', async (req,res) =>{ //standard registration with no auth.
   //Authenticate User
  // const user = users.find(user => user.name === req.body.name)
  const salt = await bcrypt.genSalt()
  const hashedPass = await bcrypt.hash(req.body.password, salt)
  console.log(salt)
  console.log(hashedPass)

  const user = `SELECT * FROM logininfo WHERE name = "${req.body.name}" && email = "${req.body.email}" && password = "${hashedPass}"` ;
  db.query(user, err => {
      if (err) throw err;
  }); 
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    const newlogin = String.prototype.toLowerCase.call(req.body.email);
    let identical = false;
    const {valid, reason, validators} = await isEmailValid(req.body.email);
    
    if(user == null){
        return res.status(400).send("Cannot find the user")
    }  
     
    try{ 
        for(let i = 0; i < loginInfos.length; i++) {
        //Check if login exists
        if(String.prototype.toLowerCase.call(loginInfos[i].email) === newlogin) {
            identical = true;
        }
    } 
        if (await bcrypt.compare(req.body.password, hashedPass) && identical == false && validator.validate(req.body.email) // true
){  //need to ctrl s for it to not break for some reason
          
            let sql = ` INSERT INTO logininfo(
                        name,
                        email,
                        password 
                        )
                        VALUES(
                        '${req.body.name}',
                        '${req.body.email}',
                        '${hashedPass}'
                        )`;
                        db.query(sql, err => {
                        if (err) throw err;
                        })
                        loginInfos.push(sql);
                        identical == true;

            let name = req.body.email + '_playlists'
            let sql2 = 'CREATE TABLE `'+name+'` (playlistnames VARCHAR(100) NOT NULL, description VARCHAR(1000) DEFAULT "N/A", visibility VARCHAR(10) DEFAULT "False", rating VARCHAR(100) default "No Ratings Available", lastModified DATE default (curdate()), creator VARCHAR(100) default "' + req.body.name + '" PRIMARY KEY(playlistnames))';
            db.query(sql2, err => {
                if(err) throw err;
            }) 
                        res.send("valid email")
        
        }
        else if(identical === true){
            res.send('Email already in use')
        } 
        
        else{
            res.status(500).send('Not a Valid Email')
        }
       
    
    }
    catch{
        res.status(500).send("Not a Valid Email")
    }
 });

 


 let mailTransporter = nodemailer.createTransport({
    service: "gmail" ,
    auth: {
        user: "emailverify3316@gmail.com",
        pass: "hvdaetpavlsjelsh"
    }
 })
// using a predefined file

router.post('/deactivate', (req,res)=>{

        let sqler = `UPDATE logininfo
        SET 
        deactivate = 'True'
        WHERE
        email = "${req.body.email}"`;
        db.query(sqler, err => {
           if (err) throw err;      
       });

res.send('Your account is deactivated')
});

router.post('/admin', (req,res)=>{

    let sqler = `UPDATE logininfo
    SET 
    admin = 'True'
    WHERE
    email = "${req.body.email}"`;
    db.query(sqler, err => {
       if (err) throw err;      
   });

res.send('Your account is now an Admin')
});

 router.post('/verify/email', (req,res)=>{
   

    let details = {
        from: "emailverify3316@gmail.com",
        to: `${req.body.email}`,
        subject: "Your email is now verified",
        text: "You have verified your email!"
    }
   const user = `SELECT email FROM logininfo WHERE email = "${req.body.email}"`;
  
   const accessToken = generateAccessToken(user)
   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
      

    db.query(user, (err,results) => {
        if (err) throw err;
        console.log(results[0])
                  mailTransporter.sendMail(details, (err) => {
                 if(results[0] === undefined) {
                     res.status(500).send('No account with that email')
                 }
                 else{
                    let sqler = `UPDATE logininfo
                                 SET 
                                 AccessToken = '${accessToken}',
                                 RefreshToken = '${refreshToken}'
                                 WHERE
                                 email = "${req.body.email}"`;
                                 db.query(sqler, err => {
                                    if (err) throw err;
                                        
                                });

                     res.send('Email is now verified')
                 }
              
             })
         
    
    }); 
})

router.post('/secure/login', async (req,res) =>{
    
    const user = `SELECT password, deactivate FROM logininfo WHERE email = "${req.body.email}"`;
    db.query(user, async (err,results) => {
        if (err) throw err;
          if(user == null){
            return res.status(400).send("No User")    
        }
    
        try{
           
            if(await bcrypt.compare(req.body.password, results[0].password.toString()) && results[0].deactivate == null){
                res.send('Success')
            }
            else if(results[0].deactivate =="True"){
                res.send('Your account has been deactivated. Please contact an admin to get it back')
            }
            else if((err)) throw err;
            else{
                
                res.status(400).send('Incorrect password')
            }
        }
        catch{
            return res.status(500).send("You have entered an inccorect Email")
        }
    
    }); 
   
    
}); //for testing if it works


router.post('/secure/updatePassword', async (req,res) =>{ 

    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(req.body.password, salt)
  
    const user = `SELECT email, password, AccessToken FROM logininfo WHERE email = "${req.body.email}" AND AccessToken IS NOT NULL` ;
    console.log(user)
       db.query(user, (err,results) => {
           if (err) throw err;

            try{
           if(results[0].AccessToken){
           let sqler = `UPDATE logininfo
                                SET 
                                password = "${hashedPass}"
                                WHERE
                                email = "${req.body.email}"`;
                                 db.query(sqler, err => {
                                    if (err) throw err;
                                        
                                });

                     res.send('Password is changed')
                            }
                        }catch{
                            res.status(400).send('Not authenticated');
                        }
       }); 
    


});









// router.post('/secure/register/Auth', async (req,res) => {
//     //Authenticate User
//   // const user = users.find(user => user.name === req.body.name)
//   const salt = await bcrypt.genSalt()
//   const hashedPass = await bcrypt.hash(req.body.password, salt)
//   console.log(salt)
//   console.log(hashedPass)

  

//   const user = `SELECT * FROM logininfo WHERE name = "${req.body.name}" && email = "${req.body.email}" && password = "${hashedPass}"` ;
//   db.query(user, err => {
//       if (err) throw err;
//   }); 
//     const accessToken = generateAccessToken(user)
//     const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//     const newlogin = String.prototype.toLowerCase.call(req.body.email);
//     let identical = false;
    
//     if(user == null){
//         return res.status(400).send("Cannot find the user")
//     }  
     
//     try{ 
//         for(let i = 0; i < loginInfos.length; i++) {
//         //Check if playlist exists
//         if(String.prototype.toLowerCase.call(loginInfos[i].email) === newlogin) {
//             identical = true;
//         }
//     } 
//         if (await bcrypt.compare(req.body.password, hashedPass) && identical === false ){  //need to ctrl s for it to not break for some reason
          
//             let sql = ` INSERT INTO logininfo(
//                         name,
//                         email,
//                         password,
//                         AccessToken,
//                         RefreshToken
//                         )
//                         VALUES(
//                         '${req.body.name}',
//                         '${req.body.email}',
//                         '${hashedPass}',
//                         '${accessToken}',
//                         '${refreshToken}'
//                         )`;db.query(sql, err => {
//                         if (err) throw err;
//                         })
//                         loginInfos.push(sql)
//                         identical == true;
//             res.send({acessToken: accessToken, refreshToken: refreshToken})
        
//         } else if(identical ==true){
//             res.send('Email already in use')
//         }
    
//     }catch{
//         res.status(500).send("There was an error")
//     }

// }); probably not needed

    router.post('/token',(req, res) =>{
        const refreshToken = req.body.token
        if(refreshToken == null)return res.sendStatus(401)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) =>{
            if(err)return res.sendStatus(403)
            const accessToken = generateAccessToken( {name: user.name})
            res.json({accessToken: accessToken})
        })
    });



function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'] 
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        return res.status(401)
    }    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}


//Add tracks to playlist
router.post('/:name', (req, res) => {
    const newtracks = req.body;
    console.log("Tracks: ", newtracks);

    let sqlDelete = 'TRUNCATE TABLE ' + req.params.name;
    db.query(sqlDelete, err => {
        if (err) throw err;
    })

    newtracks.forEach(t => {
        const track = trackDataFinal.find(p => p.track_id === t);
        let sql = `
            INSERT INTO ` + req.params.name + `(
                track_id,
                track_duration
            )
            VALUES(
                '${t}',
                '${track.track_duration}'
            )`;
        db.query(sql, err => {
            if (err) throw err;
                
        })
    }) 
    
    res.send('Tracks added')
})

//Deletes list with a given name
router.delete('/:name', (req, res) => {
    const newPlaylist = String.prototype.toLowerCase.call(req.params.name);
    console.log("Playlist:", newPlaylist);

    let temp;
    let identical = false;
    for(let i = 0; i < playlists.length; i++) {
        //Check if playlist exists
        if(String.prototype.toLowerCase.call(playlists[i].playlistname) === newPlaylist) {
            identical = true;
            temp = playlists[i].id;
            playlists.splice((i), (1));
        }
    } 

    if(identical == false) {
        console.log('Playlist not found');
        res.sendStatus(404);
    } else if(identical == true) {
        let sql = 'DROP TABLE ' + req.params.name;
        let sqlDeleteRow = 'DELETE FROM playlistnames WHERE id =' + temp;
        let query = db.query(sqlDeleteRow, (err) => {
            if(err) throw err;
            res.send("Deleted playlist " + req.params.name);
        })
        query = db.query(sql, (err) => {
            if(err) throw err;
        })
        
    }
})

//Get ID's of all tracks in playlist
router.get('/tracks/:name', (req, res) => {
    const getPlaylistTracks = String.prototype.toLowerCase.call(req.params.name);
    console.log("Playlist:", getPlaylistTracks);

    let identical = false;
    for(let i = 0; i < playlists.length; i++) {
        //Check if playlist exists
        if(String.prototype.toLowerCase.call(playlists[i].playlistname) == getPlaylistTracks) {
            identical = true;
        }
    } 

    if(identical == false) {
        console.log('Playlist not found');
        res.sendStatus(404);
    } else if(identical == true) {
        let sql = 'SELECT * FROM ' + req.params.name;
        let query = db.query(sql, (err, results) => {
            if(err) throw err;
            res.send(results);
        })
    }   
})

//Get 10 playlists with # of tracks and total play time
router.get('/unauth', (req, res) => {
    let finalArray = [];
    let tempArray = {
        name: '',
        counter: '',
        timer: '',
        rating: '',
        creator: ''
    };
    let timer = 0;
    let go = 0;

    let visCount = 0;
    for(let i = 0; i < playlists.length && i < 10; i++){
        let trackStorage;
        
        if(playlists[i].visibility == 'True') {
            let listName = playlists[i].playlistname;
            let finalName = listName.split('_')[0];
    
            let sqlCount = 'SELECT COUNT(*) AS track_amount FROM `' + listName + '`';
            let sqlTracks = 'SELECT track_duration FROM `' + listName + '`';
    
            let query = db.query(sqlCount, (err, results) => {
                if(err) throw err;
                tempArray.counter = results[0].track_amount;
            })
            query = db.query(sqlTracks, (err, results) => {
                if(err) throw err;
                if(timer != 0) {
                    timer = 0;
                }
                trackStorage = results;
    
                for(let j = 0; j < trackStorage.length; j++) {
                    timer += hmsToSecondsOnly(trackStorage[j].track_duration);
                } 
                            
                finalArray.push({
                    name: finalName,
                    counter: tempArray.counter,
                    timer: timeFormat(timer),
                    rating: playlists[i].rating,
                    creator: playlists[i].creator
                })
                go += 1;
                
                if(go == playlists.length || ((go + visCount) == playlists.length)) {
                    res.send(finalArray);
                }
            })
        } else if (playlists[i].visibility == 'False'){
            visCount += 1;
        } else {
            res.sendStatus(400);
        }
    }

    if(visCount == playlists.length || visCount == 10) {
        res.send("No playlists available");
    }
})

//Change visibility of playlist
router.put('/secure/visibility/:name', (req, res) => {
    const playlistToChangeVisibility = String.prototype.toLowerCase.call(req.params.name) + '_' + req.body.email;
    const name = req.body.email + "_playlists"
    
    let sql = 'UPDATE `' + name + '` SET visibility = "' + req.body.visibility + '" WHERE playlistnames = "' + playlistToChangeVisibility + '"';
    let sql2 = 'UPDATE playlistnames SET visibility = "' + req.body.visibility + '" WHERE playlistname = "' + playlistToChangeVisibility + '"';

    db.query(sql, err => {
        if (err) throw err;
        db.query(sql2, err => {
            if (err) throw err;
            res.send("Playlist " + req.params.name + " visibility was set to " + req.body.visibility);
        })
    })
})

//Change rating of playlist
router.put('/secure/rating/:name', (req, res) => {
    const playlistToChangeRating = String.prototype.toLowerCase.call(req.params.name) + '_' + req.body.email;
    const name = req.body.email + "_playlists"

    let sqlSelectRating = 'SELECT rating FROM `' + name + '` WHERE playlistnames = "' + playlistToChangeRating + '"';
    db.query(sqlSelectRating, (err, result) => {
        if (err) throw err;
        if(result[0].rating == "No Ratings Available") {
            let sql = 'UPDATE `' + name + '` SET rating = "' + req.body.rating + '" WHERE playlistnames = "' + playlistToChangeRating + '"';
            let sql2 = 'UPDATE playlistnames SET rating = "' + req.body.rating + '" WHERE playlistname = "' + playlistToChangeRating + '"';
        
            db.query(sql, err => {
                if (err) throw err;
                db.query(sql2, err => {
                    if (err) throw err;
                    res.send("Playlist " + req.params.name + " rating is now " + req.body.rating);
                })
            })
        } else {
            let newRating = ((parseFloat(result[0].rating) + req.body.rating)/2)

            let sql = 'UPDATE `' + name + '` SET rating = "' + newRating + '" WHERE playlistnames = "' + playlistToChangeRating + '"';
            let sql2 = 'UPDATE playlistnames SET rating = "' + newRating + '" WHERE playlistname = "' + playlistToChangeRating + '"';

            db.query(sql, err => {
                if (err) throw err;
                db.query(sql2, err => {
                    if (err) throw err;
                    res.send("Playlist " + req.params.name + " rating is now " + newRating);
                })
            })
        }
    })


    
})



//Convert to seconds
function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

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
function addPlaylist(newList, creator) {
    let sql = `
    INSERT INTO playlistnames(
        playlistname,
        creator
    )
    VALUES(
        '${newList}',
        '${creator}'
    )`;
    db.query(sql, err => {
        if (err) throw err;
    })
    return;
}

function addToUserPlaylists(playlist, email) {
    let name = email + '_playlists';
    let sql = 'INSERT INTO `' + name + '` (playlistnames) VALUES( "'+ playlist + '")';
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
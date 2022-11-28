import React, {Component} from 'react';

class App extends Component{

constructor(props){
  super(props);
  this.state={
    items: [],
    isLoaded: false,
  
  }
}
componentDidMount(){
  const t = document.getElementById('allPlaylists');
    t.replaceChildren('');

    fetch('/api/playlist')
    .then(res => res.json()
    .then(data => {
        data.forEach(e => {
            const row = document.createElement('tr');
            const item = document.createElement('th');
            item.classList.add("playlistCenter");
            item.addEventListener("click", function(){
                chosenPlaylist = (item.innerText.substring(0, item.innerText.indexOf(' •')));
                getPlaylistData(chosenPlaylist);
            });
            item.appendChild(document.createTextNode(`${e.name} • ${e.counter} songs, ${e.timer} duration`));
            row.appendChild(item);
            t.appendChild(row);
        });
    })
    )



}

render() {
  return (
    <div className="App">
    
    
    </div>
  ); //parenthesis returns everything inside the parenthesis
}
}

export default App;

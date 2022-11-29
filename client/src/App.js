import React, {useEffect,useState} from 'react';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

function App() {
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch('/api/genres').then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  },[])

  return (
    <div>
      <Header />
      <Body />
      {(typeof backendData.title === 'undefined') ?(
        <p>loading</p>
      ):(
        backendData.title.map((user,i)=>(
          <p key ={i}>{user}</p>
        ))
      )}
      <Footer />
    </div>
  );
}

export default App;

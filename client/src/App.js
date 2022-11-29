import React, {useEffect,useState} from 'react';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import {Login} from './Login';
import {Register} from './Register';

function App() {

  const[currentForm,setCurrentForm]=useState('Login')

  const toggleForm = (formName) =>{
      setCurrentForm(formName);
  }

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
      {
        currentForm == "Login" ? <Login onFormSwitch={toggleForm} /> : <Register />
      }
     
     
     
    
      <Footer />
    </div>
  );
}

export default App;
{/* <Body />
{(typeof backendData.title === 'undefined') ?(
 <p>loading</p>
):(
 backendData.title.map((user,i)=>(
   <p key = {i}>{user}</p>
 ))
)}  */}
import React, {useEffect,useState} from 'react';
import {Route, Link, Routes, useParams} from 'react-router-dom';
import ReactDOM from "react-dom/client";
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import {Login} from './Login';
import {Register} from './Register';

function App() {


  const params = useParams();
  const[currentForm,setCurrentForm]=useState('Login')
console.log(params)

  const toggleForm = (formName) =>{
      setCurrentForm(formName);
  }
 

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    
        fetch(`/api/genres`)
        .then(res => res.json()
        .then(data => {
            setBackendData(data);
        })
        )
    
  },[])

  return (
    <div>
       <Header />
      {
        currentForm == "Login" ? <Login onFormSwitch = {toggleForm} /> : <Register onFormSwitch = {toggleForm}/>
        &&
        currentForm == "Body" ? <Body onFormSwitch = {toggleForm}/> : <Register onFormSwitch = {toggleForm}/>
      }
      {(typeof backendData.title === 'undefined') ?(
 <p>loading</p>
):(
 backendData.title.map((user,i)=>(
   <p key = {i}>{user}</p>
 ))
)} 
     
     
     
    
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
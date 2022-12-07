import React from 'react'
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {Route} from "react-router-dom";
import axios from 'axios';
export default function Login(props) {
  const[email,setEmail] = useState(""); //set email initally empty
  const[pass,setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(email + pass);
  }


  const change = async (e) =>{
    e.preventDefault();
    try{
        setTimeout(function() {
        navigate ('/register')
      }, 1000);
    }
    catch(error){
        setError(error.response.data.error);
    }
}

  
  return(
    <div className = "auth-container"> 
      <h2 className = "loginTitle"> Login</h2>
      <form className ="authForm" onSubmit={handleSubmit}>
          <label htmlFor = "email">email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type = "email" placeholder ="youremail@example.com" id="email" name="email"/>
          <label htmlFor = "password">password</label>
          <input value={pass} onChange={(e)=>setPass(e.target.value)} type = "password" placeholder ="*******" id="password" name="password"/>
          <button type = "submit" onClick={() => props.onFormSwitch('Body')}>Log In</button> 
          <button className="linkBtn" onClick = {change}>Don't have an account? Register</button>
      </form>
    </div>
  )
}
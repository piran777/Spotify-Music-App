import React from 'react'
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
export default function Login(props) {
    
    
    
    
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const change = async (e) =>{
        e.preventDefault();
        try{
            setTimeout(function() {
            navigate ('/login')
          }, 1000);
        }
        catch(error){
            setError(error.response.data.error);
        }
    }
    const changePass = async (e) =>{
        e.preventDefault();
        try{
            setTimeout(function() {
            navigate ('/updatePassword')
          }, 1000);
        }
        catch(error){
            setError(error.response.data.error);
        }
    }
  
  return(
    <div className = "auth-container"> 
      <h2 className = "Verification"> You Are Now Verified! </h2>
      <button className="linkBtn" onClick = {change}> Return to Login</button>
      <button className="linkBtn" onClick = {changePass}> Want a new Password?</button>
    </div>
  )
}
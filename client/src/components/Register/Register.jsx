import React from 'react'
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {Route} from "react-router-dom";
import axios from 'axios';

export default function Register(props) {
    const[email,setEmail] = useState(""); //set email initally empty
    const[pass,setPass] = useState("");
    const[name,setName] = useState("");
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
            navigate ('/login')
          }, 1000);
        }
        catch(error){
            setError(error.response.data.error);
        }
    }


    return( 
        <div className = "auth-container">
            <h2 className = "registerTitle"> Register</h2>
            <form className ="authFormReg" onSubmit={handleSubmit}>
                <label htmlFor = "name">Full Name</label>
                <input value={name}  onChange={(e)=>setName(e.target.value)} placeholder ="Enter Your Name" id="name" name="name"/>
                <label htmlFor = "email">email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type = "email" placeholder ="youremail@example.com" id="email" name="email"/>
                <label htmlFor = "password">password</label>
                <input value={pass} onChange={(e)=>setPass(e.target.value)} type = "password" placeholder ="*******" id="password" name="password"/>
                <button type = "submit" onSubmit={handleSubmit} >Log In</button> 
                <button className="linkBtn" onClick = {change} >Have an Account? Login</button>
                
               
            </form>
        </div>
    )
}
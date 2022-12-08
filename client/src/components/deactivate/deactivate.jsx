import React from 'react'
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
export default function Login(props) {
  const[email,setEmail] = useState(""); //set email initally empty
  const[pass,setPass] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

      const path = `api/playlist/deactivate`;

     try{ 
      
        const res = await axios.post(path,{
        email: data.email 
      },{
        method: "POST",
        "Access-Control-Allow-Origin": null,
        "Content-type": "application/json"
      },
      ).then(function (response) {
        console.log(response);
        setError("Deactivated")
        alert("Your Account has been deactivated")
        setTimeout(function() {
          navigate('/register')
        }, 1000);  
       
      })
      .catch(function (error) {
        console.log(error);
        alert("Incorrect email")
       
       
      })
      localStorage.setItem("email", res.data[0].email);
      setTimeout(function() {
        navigate('/login')
      }, 1000);
    }
      catch{
        setError(error.response.data.error);
        alert("email")
        
      }
    }

    const handleChange = ({currentTarget: input}) => {
      setData({...data,[input.name]: input.value });
    };
       
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
      <h2 className = "loginTitle"> Deactivate your Account</h2>
      <form className ="authForm" onSubmit={handleSubmit}>
          <label htmlFor = "email">email</label>
          <input required value={data.email} onChange={handleChange} type = "email" placeholder ="youremail@example.com" id="email" name="email"/>
          {error && <div>{error}</div>}
          <button type = "submit" >Log In</button> 
          <button className="linkBtn" onClick = {change}>Change your mind? Log in!</button>
      </form>
    </div>
  )
}
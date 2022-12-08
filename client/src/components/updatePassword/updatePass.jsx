import React from 'react'
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
export default function Login(props) {
  const[email,setEmail] = useState(""); //set email initally empty
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

      const path = `api/playlist/secure/updatePassword`;

     try{ 
      
        const res = await axios.post(path,{
        email: data.email,
        password: data.password
        
      },{
        method: "POST",
        "Access-Control-Allow-Origin": null,
        "Content-type": "application/json"
      },
      ).then(function (response) {
        console.log(response);
        alert("Password has been changed")
        setTimeout(function() {
          navigate('/login')
        }, 1000);  
      })
      .catch(function (error) {
        console.log(error);
       
        alert("Incorrect or email")
      })
      localStorage.setItem("email", res.data[0].email);
      setTimeout(function() {
        navigate('/login')
      }, 1000);
    }
      catch{
        setError(error.response.data.error);
        alert("Incorrect or email")
        
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

        const changePass = async (e) =>{
          e.preventDefault();
          try{
              setTimeout(function() {
              navigate ('/account/update/password')
            }, 1000);
          }
          catch(error){
              setError(error.response.data.error);
          }
      }
    
  
  return(
    <div className = "auth-container"> 
      <h2 className = "loginTitle"> Update your Password</h2>
      <form className ="authForm" onSubmit={handleSubmit}>
          <label htmlFor = "email">email</label>
          <input value={data.email} onChange={handleChange} type = "email" placeholder ="youremail@example.com" id="email" name="email" required/>
          <label htmlFor = "password">password</label>
          <input value={data.password} onChange={handleChange} type = "password" placeholder ="*******" id="password" name="password" required/>
          {error && <div>{error}</div>}
          <button type = "submit" >Change</button> 
          <button className="linkBtn" onClick = {change}> Don't have an account? Register</button>
          <button className = "linkBtn" onClick = {changePass}>Update your password if your verified </button>
      </form>
    </div>
  )
}
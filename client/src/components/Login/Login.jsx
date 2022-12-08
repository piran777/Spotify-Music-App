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

      const path = `api/playlist/secure/login`;

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
        
        setError(data.response)
        setTimeout(function() {
          navigate('/secure')
        }, 1000);  
       
      })
      .catch(function (error) {
        console.log(error);
        setError(JSON.stringify(data))
       
       
      })
      localStorage.setItem("email", res.data[0].email);
      setTimeout(function() {
        navigate('/secure')
      }, 1000);
    }
      catch{
        setError(error.response.data.error);
        alert("Incorrect password or email")
        
      }
    }

    const handleChange = ({currentTarget: input}) => {
      setData({...data,[input.name]: input.value });
    };
       
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

        const changeVerify = async (e) =>{
          e.preventDefault();
          try{
              setTimeout(function() {
              navigate ('/verify')
            }, 1000);
          }
          catch(error){
              setError(error.response.data.error);
          }
      }

      const deactivate = async (e) =>{
        e.preventDefault();
        try{
            setTimeout(function() {
            navigate ('/deactivate')
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
          <input required value={data.email} onChange={handleChange} type = "email" placeholder ="youremail@example.com" id="email" name="email"/>
          <label htmlFor = "password">password</label>
          <input required value={data.password} onChange={handleChange} type = "password" placeholder ="*******" id="password" name="password" />
          {error && <div>{error}</div>}
          <button type = "submit" >Log In</button> 
          <button className="linkBtn" onClick = {change}>Don't have an account? Register</button>
          <button className = "linkBtn" onClick = {changeVerify}>Verify your account </button>
          <button className = "linkBtn" onClick = {deactivate}>Want to deactivate your account? </button>
      </form>
    </div>
  )
}
import React from 'react'
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

export default function Register(props) {
    const[email,setEmail] = useState(""); //set email initally empty
    const[pass,setPass] = useState("");
    const[name,setName] = useState("");
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    

    const handleSubmit = async (e) =>{
      e.preventDefault();

     
        const path = `api/playlist/secure/register/unauth`;

       try{ 
        const res = await axios.post(path,{
          name: data.name,
          email: data.email,
          password: data.password
        },{
          method: "POST",
          "Access-Control-Allow-Origin": null,
          "Content-type": "application/json"
        },
        ).then(function (response) {
          console.log(response);
          setTimeout(function() {
            navigate('/login')
          }, 1000);
        })
        .catch(function (error) {
          console.log(error);
          alert("Not valid email")
        });
        setError("Succesfully Logged In");
      }
        catch{
          setError(error.response.data.error);
          alert("Not valid email")
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
          }, 2000);
        }
        catch(error){
            setError(error.response.data.error);
        }
    }


    return( 
        <div className = "auth-container">
            <h2 className = "registerTitle"> Register</h2>
            <form className ="authFormReg" >
                <label htmlFor = "name">Full Name</label>
                <input value={data.name}  onChange={handleChange} placeholder ="Enter Your Name" id="name" name="name"/>
                <label htmlFor = "email">email</label>
                <input value={data.email} onChange={handleChange } type = "email" placeholder ="youremail@example.com" id="email" name="email" required/>
                <label htmlFor = "password">password</label>
                <input value={data.password} onChange={handleChange} type = "password" placeholder ="*******" id="password" name="password" required/>
                {error && <div>{error}</div>}
                <button type = "submit" onClick={handleSubmit} >Register</button> 

                <button className="linkBtn" onClick = {change} >Have an Account? Login</button>
                
               
            </form>
        </div>
    )
}
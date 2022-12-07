import React, {useState} from 'react';

export default function Login(props) {
  const[email,setEmail] = useState(""); //set email initally empty
  const[pass,setPass] = useState("");
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(email + pass);
  }
  
  return(
    <div className = "auth-container"> 
      <h2 className = "loginTitle"> Login</h2>
      <p> This application allows users to register for an account. Once an account is 
        registered it can be verified and authenticated or a user can log in without doing so. When logging in without authentication and verification the user has access to less functionality.
        When a user is authenticated they have increased functionality on top of the functionality given for unauthenticated users. There is also admin functionalities which are used for site maintence. 
        This site is overall an upgraded spotify which allows people to add music to the placelists and search for songs by album, song title, or artist and have more or less functionality based on authentication and verification status.
        </p>
      <form className ="authForm" onSubmit={handleSubmit}>
          <label htmlFor = "email">email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type = "email" placeholder ="youremail@example.com" id="email" name="email"/>
          <label htmlFor = "password">password</label>
          <input value={pass} onChange={(e)=>setPass(e.target.value)} type = "password" placeholder ="*******" id="password" name="password"/>
          <button type = "submit" onClick={() => props.onFormSwitch('Body')}>Log In</button> 
          <button className="linkBtn" onClick={() => props.onFormSwitch('Register')}>Don't have an account? Register</button>
      </form>
    </div>
  )
}
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
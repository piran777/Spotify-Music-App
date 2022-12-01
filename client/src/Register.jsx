import React, {useState} from 'react';
export const Register = (props) =>{
    const[email,setEmail] = useState(""); //set email initally empty
    const[pass,setPass] = useState("");
    const[name,setName] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(email + pass);
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
                <button type = "submit" onClick={() => props.onFormSwitch('Body')}>Log In</button> 
                <button className="linkBtn" onClick={() => props.onFormSwitch('Login')}>Have an Account? Login</button>
            </form>
        </div>
  )}
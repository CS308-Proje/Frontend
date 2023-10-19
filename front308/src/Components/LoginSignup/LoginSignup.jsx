import React, { useState } from 'react'
import './LoginSignup.css'
import user_icon from "../Assets/person.png"
import email_icon from "../Assets/email.png"
import password_icon from "../Assets/password.png"

const LoginSignup = () => {

const [action,setAction] = useState("Sign up to SRS");


  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">

        {action==="Log in to SRS"? <div></div>:<div className="input">
          <img src={user_icon} alt="" />
          <input type="text" placeholder='Name' />
        </div>}
        
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder='Email Id'/>
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder='Password'/>
        </div>
      </div>
      <div className="submit-container">
        <div className={action==="Log in to SRS"?"submit gray":"submit"} onClick={()=>{setAction("Sign up to SRS")}} >Sign Up</div>
        <div className={action==="Sign up to SRS"?"submit gray":"submit"} onClick={()=>{setAction("Log in to SRS")}}>Log In</div>
      </div>
    </div>
  )
}

export default LoginSignup

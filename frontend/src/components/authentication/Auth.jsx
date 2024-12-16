import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';


const Auth = () => {

  //no need to create states on redux for this page
  const dispatch = useDispatch();
  const [loginMode, setLoginMode] = useState(false);

  const emailRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();


  const submitHandler = async (e) => {
      e.preventDefault();

      const enteredMail = emailRef.current.value;

      if(loginMode){
        const enteredPass = passRef.current.value;

        console.log(enteredPass);
      }
      else{
        const enteredPass = passRef.current.value;
        const enteredConfPass = confirmPassRef.current.value;

        if(enteredConfPass !== enteredPass){
          return alert("Password must be same, try again.")
        }
        
      }
  }


  return (
    <>
    <div className='w-full -mt-20 pt-20 bg-gray-900 h-screen'>
        <div className='ml-auto mr-auto w-[500px] p-5 border-2 border-stone-200 mt-20'>
            <h2 className='text-3xl font-bold text-center text-stone-100'>{loginMode ? "Login" : 'Sign up'}</h2>
            <br />
            <form onSubmit={submitHandler}>
                <label className='font-medium text-stone-100' htmlFor="email">Email</label><br />
                <input className='w-full h-10 p-2 font-sans outline-double' type="email" name='email' id='email' ref={emailRef} required/> <br /> <br />

                <label className='font-medium text-stone-100' htmlFor="password">Password</label> <br />
                <input className='w-full h-10 p-2 font-sans outline-double' type="password" ref={passRef} name="password" id="password" required/> <br />

                {!loginMode && <>
                    <br />
                  <label className='font-medium text-stone-100' htmlFor="confpassword">Confirm Password</label> <br />
                  <input className='w-full h-10 p-2 font-sans outline-double' type="password" ref={confirmPassRef} name="password" id="confpassword" required/>
                </> 
                }
                
                <button type='submit' className='w-full hover:bg-yellow-400 mt-5 bg-yellow-300 font-medium text-lg p-3 '>{loginMode ? "Login" : "Sign Up"}</button> <br /> 
                <p onClick={() => setLoginMode((prev) => !prev)} className=' hover:underline mt-3 cursor-pointer text-stone-100 text-center'>{loginMode ? "Create an account" : "Already have an account? Login"}</p>
            </form>
        </div>
    </div>
    </>
  )
}

export default Auth;
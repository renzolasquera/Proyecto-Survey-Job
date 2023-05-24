import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Job from "../assets/job.png";
import "../css/login.css"; //ver si hay que agregar export default
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import '@sweetalert2/themes/bulma/bulma.css'
import {login} from '../helpers/AuthAPI'
import {register} from '../helpers/UserAPI'

const LoginScreen = ({dark}) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    loginEmail:'',
    loginPassword:''
  })
  const [registerData, setRegisterData] = useState({
    registerUsername:'',
    registerEmail:'',
    registerPassword:'',
    confirmPassword:''
  })

  const handleLoginInputs=(e)=>{
    setLoginData({
      ...loginData,
      [e.target.name]:e.target.value
    })
  }

  const handleRegisterInputs=(e)=>{
    setRegisterData({
      ...registerData,
      [e.target.name]:e.target.value
    })
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const loginUser=async(loginRequestData)=>{
    const loginResp=await login(loginRequestData)
    if(loginResp?.token){
      localStorage.setItem('x-token',JSON.stringify(loginResp.token))
      Toast.fire({
        icon: 'success',
        title: loginResp.msg,
        text: 'Iniciando sesión...'
      })
      setTimeout(() => {
        navigate('/')
      }, 1000);
    }else{
      Swal.fire({
        icon: 'error',
        title: loginResp.msg,
      })
    }
  }

  const loginSubmit=async(e)=>{
    e.preventDefault()
    const loginRequestData={
      email:loginData.loginEmail,
      password:loginData.loginPassword
    }

    loginUser(loginRequestData)
  }

  const registerSubmit=async(e)=>{
    e.preventDefault()
    const registerRequestData={
      username:registerData.registerUsername,
      email:registerData.registerEmail,
      password:registerData.registerPassword,
    }
    const registerResp=await register(registerRequestData)
    if(registerResp?.newUser){
      const loginRequestData={
        email:registerData.registerEmail,
        password:registerData.registerPassword
      }
      loginUser(loginRequestData)
    }else{
      console.log(registerResp)
      Swal.fire({
        icon: 'error',
        text: registerResp.errors[0].msg
      })
    }
  }

  return (
    <>
      <div className={`bodylog ${dark?'login__bg--dark':'login__bg--light'}`}>
        <div className="main">
          <input type="checkbox" id="chk" aria-hidden="true" />

          <div className={`signup ${dark?'signup__bg--dark':'signup__bg--light'}`}>
            <form onSubmit={loginSubmit}>
              <label htmlFor="chk" className="login__label" aria-hidden="true">
                Iniciar sesión
              </label>
              <div className="d-flex h-100 align-items-center flex-column pt-3">
              <input
                className="mt-1 login__input"
                type="email"
                name="loginEmail"
                value={loginData.loginEmail}
                placeholder="Email"
                required={true}
                onChange={handleLoginInputs}
                />
              <input
                className="mt-1 login__input"
                type="password"
                name="loginPassword"
                value={loginData.loginPassword}
                placeholder="Contraseña"
                required={true}
                onChange={handleLoginInputs}
                />
              <button className="mt-3 login__btn">Iniciar sesión</button>
              {/* <input type="submit" value="Iniciar Sesion" className="mt-3 login__btn" /> */}
              <a href="" className={`fs-xs ${!dark&&'text-light'} text-decoration-none`}> <small>Olvide mi contraseña</small> </a>

              </div>
            </form>
          </div>

          <div className={`login ${dark&&'login--dark'}`}>
          <form onSubmit={registerSubmit}>
              <label htmlFor="chk" className="login__label" aria-hidden="true">
                Regístrate{" "}
              </label>
              <div className="container">
                <input
                  className={`mt-1 login__input ${dark&&'login__input--dark'}`}
                  type="text"
                  name="registerUsername"
                  value={registerData.registerUsername}
                  onChange={handleRegisterInputs}
                  placeholder="Usuario"
                  required=""
                  />
                <input
                  className={`mt-1 login__input ${dark&&'login__input--dark'}`}
                  type="email"
                  name="registerEmail"
                  value={registerData.registerEmail}
                  onChange={handleRegisterInputs}
                  placeholder="Email"
                  required=""
                />
                <input
                  className={`mt-1 login__input ${dark&&'login__input--dark'}`}
                  type="password"
                  name="registerPassword"
                  value={registerData.registerPassword}
                  onChange={handleRegisterInputs}
                  placeholder="Contraseña"
                  required=""
                />
                <input
                  className={`mt-1 login__input ${dark&&'login__input--dark'}`}
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputs}
                  placeholder="Contraseña"
                  required=""
                />
                <small className="login__password__small">Tu contraseña debe tener almenos 1 mayúscula, 1 minúscula, 1 número y almenos 1 símbolo.</small>
              </div>
              <button className={`mt-3 login__btn`}>Registrate</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;

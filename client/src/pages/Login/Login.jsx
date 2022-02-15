import './Login.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate()

  const [name, setName] = useState()
  const [pass, setPass] = useState()
  const [button, setButton] = useState('login')
  const [submit, setSubmit] = useState(false)

  const host = window.location.origin === 'http://localhost:3000' ? 'http://localhost:3001' : window.location.origin

  function takeName(e) {
    setName(e.target.value)
  }

  function takePass(e) {
    setPass(e.target.value)
  }

  useEffect(() => {
    if (name && pass && submit && button === 'login') {
      setSubmit(false)
        ; (async () => {
          const res = await axios.post(host+'/login', {
            name,
            pass
          })
          if (res?.data?.token) {
            localStorage.setItem('token', res?.data?.token)
            navigate('/user')
          }
        })()
      setName()
      setPass()
    }
  }, [name, pass, submit, button, navigate, host])

  useEffect(() => {
    if (name && pass && submit && button === 'sign up') {
      setSubmit(false)
        ; (async () => {
          const res = await axios.post(host+'/signup', {
            name,
            pass
          })
          if (res?.data?.token) {
            localStorage.setItem('token', res?.data?.token)
            navigate('/user')
          }
        })()
      setName()
      setPass()
    }
  }, [name, pass, submit, button, navigate, host])

  return (
    <>
      <div className='login'>
        <form className='forma' onSubmit={e => {
          e.preventDefault()
          e.target.reset()
        }}>
          <input type="text" onChange={takeName} placeholder='name' />
          <input type="text" onChange={takePass} placeholder='password' />
          <button onClick={() => setSubmit(true)}>{button}</button>
        </form>
      <div>
        <button onClick={e => setButton(e.target.innerHTML)}>sign up</button>
        <button onClick={e => setButton(e.target.innerHTML)}>login</button>
      </div>
      </div>
    </>
  );
}

export default Login;
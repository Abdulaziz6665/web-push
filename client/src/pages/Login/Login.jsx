import './Login.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useNewUser } from '../context'

function Login() {

  const navigate = useNavigate()

  const [socket, setSocket] = useState(null)

  const [name, setName] = useState()
  const [pass, setPass] = useState()
  const [button, setButton] = useState('login')
  const [submit, setSubmit] = useState(false)
  const [check, setCheck] = useState()

  const [setNewUser] = useNewUser(true)

  const host = window.location.origin === 'http://localhost:3000' ? 'http://localhost:3001' : window.location.origin

  function takeName(e) {
    setName(e.target.value)
  }

  function takePass(e) {
    setPass(e.target.value)
  }

  useEffect(() => {
    const newSocket = io(host)
    setSocket(newSocket);
  }, [host]);

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
          } else {
            setCheck('User not found')
          }
        })()
      setName()
      setPass()
    }
  }, [name, pass, submit, button, navigate, host])

  useEffect(() => {
    if (name && pass && submit && button === 'sign up') {
      setSubmit(false)

      socket.emit('new_user', {name, pass})
      socket.on('new_user', (data) => {
        if (data?.token) {
          localStorage.setItem('token', data?.token)
          setNewUser(data?.newUser)
          navigate('/user')
        } else {
          setCheck(data)
        }
      })
        // ; (async () => {
        //   const res = await axios.post(host+'/signup', {
        //     name,
        //     pass
        //   })
        //   if (res?.data?.token) {
        //     localStorage.setItem('token', res?.data?.token)
        //     navigate('/user')
        //   } else {
        //     setCheck(res?.data)
        //   }
        // })()
      setName()
      setPass()
    }
  }, [name, pass, submit, button, navigate, host, socket, setNewUser])

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
          {check && <div>{check}</div>}
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
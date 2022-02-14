import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [name, setName] = useState()
  const [pass, setPass] = useState()
  const [button, setButton] = useState('login')
  const [submit, setSubmit] = useState(false)

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
          const res = await axios.post('http://localhost:3001/login', {
            name,
            pass
          })
        })()
      setName()
      setPass()
    }
  }, [name, pass, submit, button])

  useEffect(() => {
    if (name && pass && submit && button === 'sign up') {
      setSubmit(false)
        ; (async () => {
          const res = await axios.post('http://localhost:3001/signup', {
            name,
            pass
          })
        })()
      setName()
      setPass()
    }
  }, [name, pass, submit, button])

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

export default App;

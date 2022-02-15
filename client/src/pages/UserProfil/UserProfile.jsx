import './UserProfile.css'
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client';


function UserProfile() {

  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)

  const [user, setUser] = useState()
  const [userID, setUserID] = useState()
  const [selectedUser, setSelectedUser] = useState()
  const [text, setText] = useState()
  const [doc, setDoc] = useState()
  const [submit, setSubmit] = useState(false)

  const [chats, setChat] = useState([])
  const [notify, setNotify] = useState(false)

  useEffect(() => {
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    ; (async () => {
      const res = await axios.get('http://localhost:3001/user', {
        params: {
          token: localStorage.getItem('token')
        }
      })
      if (res?.data?.user) {
        setUser(res.data)
        setUserID(res?.data?.user.user_id)
      }
    })()
  }, [])

  useEffect(() => {
    if (socket && submit && userID && selectedUser && (text || doc)) {
      socket.emit('message', { userID, selectedUser: selectedUser?.user_id, text, senderUser: user?.user?.user_name })
      setSubmit(false)
      setText()
      setDoc()
    }
  }, [socket, submit, userID, selectedUser, text, doc, user])

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        let check = data.sender_user_id === userID || data.taked_user_id === userID
        if (data && check) {
          setChat(prev => [...prev, data])
        }
      })
    }
  }, [socket, userID])

  useEffect(() => {
    if (userID && selectedUser) {
      ; (async () => {
        const res = await axios.get('http://localhost:3001/chats-get', {
          params: {
            userID,
            selectedUser: selectedUser?.user_id
          }
        })
        if (res?.data) {
          setChat(res.data)
        }
      })()
    }
  }, [userID, selectedUser])

  function logOut() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  async function register () {
    console.log('lll')
    if (notify) {
      const worker = await window.navigator.serviceWorker.ready
  
      const pushManager = await worker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BDmzBWX_ZVY86pXthfcqsox_HET1M0ijNFmFeiMCTxnOoPrun9OVXGZMr_p-JqZnkSUrULNboygSOvlyyMDgoAU',
      })
  
      const res = await axios.post('http://localhost:3001/sub', {
        pushManager,
        userID
      })

      console.log(res.data)
      if (res.data === 'created') {
        localStorage.setItem('notify', true)
      }
      setNotify(false)
    }
  }

  // async function unRegister() {
  //   const worker = await window.navigator.serviceWorker.ready

  //   const subscription = await worker.pushManager.getSubscription()

  //   await subscription.unsubscribe()
  // }

  return (
    <>
      <button onClick={logOut}>log out</button>
      {!localStorage.getItem('notify') && <button onClick={() => {
        register()
        setNotify(true)
      }}>notification</button>}
      {/* <button onClick={unRegister}>turn off notification</button> */}
      <div className="main-div">
        <div>
          <div>Welcome {user && user?.user?.user_name}</div>

          <div>All your friends</div>
          <ul>
            {
              user?.anothers && user?.anothers.map((e, idx) => (
                <li key={idx}>
                  <button onClick={() => {
                    setSelectedUser({ user_id: e.user_id, user_name: e.user_name })
                  }}>
                    {e.user_name}
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        {selectedUser && <div>
          <div className='block'>chat with {selectedUser?.user_name}</div>

          {
            chats && chats.map((e, idx) => (
              <li className={e.sender_user_id === user?.user?.user_id ? 'chats chat-right' : 'chats'} key={idx}>
                <span>{e.sender_user_id === user?.user?.user_id ? user?.user?.user_name : selectedUser?.user_name}</span>
                <p>{e.chat}</p>
              </li>
            ))
          }
          <ul>
          </ul>
          <form onSubmit={e => {
            e.preventDefault()
            e.target.reset()
          }}>
            <input type="file" accept='.jpg, .jpeg, .png, .xlsx, .docx' onChange={e => setDoc(e.target.files)} />
            <input type="text" onChange={e => setText(e.target.value)} />
            <button onClick={() => {
              setSubmit(true)
            }}>send</button>
          </form>
        </div>}
      </div>
    </>
  )
}

export default UserProfile
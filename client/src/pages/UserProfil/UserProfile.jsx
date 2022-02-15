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
  const [ttt, tttt] = useState(false)

  const [chats, setChat] = useState([])

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
      socket.emit('message', { userID, selectedUser: selectedUser?.user_id, text })
      setSubmit(false)
      setText()
      setDoc()
    }
  }, [socket, submit, userID, selectedUser, text, doc])

  // useEffect(() => {
  //   if (userID && selectedUser && ttt) {
  //     socket.emit('chats', { userID, selectedUser: selectedUser?.user_id })
  //     socket.on('chats', data => {
  //       setChat(data)
  //     })
  //     tttt(false)
  //   }
  // }, [userID, selectedUser, socket, ttt])

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


  // useEffect(() => {
  //   if (submit && userID && selectedUser && (text || doc)) {
  //     let data = new FormData()
  //     if (doc && doc[0]) {
  //       data.append('file', doc[0])
  //       console.log(data)
  //     }
  //     ; (async () => {
  //       await axios.post('http://localhost:3001/chat', data, {
  //         headers: {
  //           userID,
  //           selectedUser: selectedUser?.user_id,
  //           text
  //         }
  //       })
  //     })()
  //     setText()
  //     setDoc()
  //     setSubmit(false)
  //   }
  // }, [userID, selectedUser, text, doc, submit])


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

  return (
    <>
      <button onClick={logOut}>log out</button>
      <div className="main-div">
        <div>
          <div>Welcome {user && user?.user?.user_name}</div>

          <div>All your friends</div>
          <ul>
            {
              user?.anothers && user?.anothers.map((e, idx) => (
                <li key={idx}>
                  <button onClick={() => {
                    tttt(true)
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
            <button onClick={() => setSubmit(true)}>send</button>
          </form>
        </div>}
      </div>
    </>
  )
}

export default UserProfile
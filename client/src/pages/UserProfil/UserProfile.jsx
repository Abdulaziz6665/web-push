import './UserProfile.css'
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload'
// import { useNewUser } from '../context'


function UserProfile() {

  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [socketFile, setSocketFile] = useState(null)

  const inputRef = useRef()

  const [user, setUser] = useState()
  const [userID, setUserID] = useState()
  const [selectedUser, setSelectedUser] = useState()
  const [text, setText] = useState()
  const [doc, setDoc] = useState()
  const [submit, setSubmit] = useState(false)
  const [edit, setEdit] = useState(false)
  const [uptOrDel, setUptOrDel] = useState()
  const [editable, setEditable] = useState(false)
  const [editText, setEditText] = useState()


  const [imgUrl, setImgUrl] = useState()
  const [videoUrl, setVideoUrl] = useState()
  const [audioUrl, setAudioUrl] = useState()

  const [chats, setChat] = useState([])
  const [notify, setNotify] = useState(false)

  const [hasNotify, setHasNotify] = useState()

  // const [signedUser, setNewUser] = useNewUser()
  const a = inputRef.current

  const host = window.location.origin === 'http://localhost:3000' ? 'http://localhost:3001' : window.location.origin

  useEffect(() => {
    const newSocket = io(host)
    setSocket(newSocket);
    // setSocketFile(siofu)
  }, [host]);

  useEffect(() => {
    if (doc && submit) {
      ;(async () => {
        let formData = new FormData()
        formData.append('file', doc[0])
        const res = await axios.post(host + '/file-upload', formData, {
          headers: {
            userID, selectedUser: selectedUser?.user_id,
          }
        })
        if (res.data) {
          socket.emit('new-file', res.data)
        }

      })()
      setImgUrl()
      setAudioUrl()
      setVideoUrl()
      setDoc()
      setSubmit(false)
    }
  }, [doc, host, submit, userID, selectedUser, socket])

  useEffect(() => {
    if (socket) {
      socket.on('new-filee', data => {
        setChat(prev => [...prev, data])
      })
    }
  }, [socket])

  useEffect(() => {
    if (doc) {
      const type = (doc[0].type).split('/')[0]
      const url = URL.createObjectURL(doc[0])
      if (type === 'video') return setVideoUrl(url)
      if (type === 'image') return setImgUrl(url)
      if (type === 'audio') return setAudioUrl(url)
    }
  }, [doc])

  // useEffect(() => {

  //   if (a && doc) {
  //       const siofu = new SocketIOFileUpload(socket);
  //       siofu.listenOnInput(inputRef.current)
  //       let formData = new FormData()
  //       formData.append('files', inputRef.current.files)
  //       console.log(formData)
  //       // Do something on upload progress:
  //       siofu.addEventListener("progress", function (event) {
  //         const percent = (event.bytesLoaded / event.file.size) * 100;
  //         console.log("File is", percent.toFixed(2), "percent loaded");
  //       });

  //       siofu.addEventListener("complete", function (event) {
  //         console.log(event)
  //       })
  //       // console.log('ok', siofu)

  //     }
  // }, [a, doc, socket])

  useEffect(() => {
    ; (async () => {
      const res = await axios.get(host + '/user', {
        params: {
          token: localStorage.getItem('token')
        }
      })
      if (res?.data?.user) {
        setUser(res.data)
        setUserID(res?.data?.user.user_id)
      }
    })()
  }, [host])

  useEffect(() => {
    if (socket && uptOrDel) {
      socket.emit('delete', {del: uptOrDel})
      setUptOrDel()
    }
  }, [socket, uptOrDel])

  useEffect(() => {
    if (socket) {
      socket.on('delete', ({chat_id}) => {
        setChat(prev => [...prev.filter(c => c.chat_id !== chat_id)])
      })
    }
  }, [socket])


  useEffect(() => {
    if (socket && submit && userID && selectedUser && text) {
      socket.emit('message', { userID, selectedUser: selectedUser?.user_id, text, senderUser: user?.user?.user_name })
      setSubmit(false)
      setText()
      setDoc()
    }
  }, [socket, submit, userID, selectedUser, text, user,])

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
        const res = await axios.get(host + '/chats-get', {
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
  }, [userID, selectedUser, host])

  function logOut() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  function reloadPage() {
    navigate('/')
  }


  useEffect(() => {
    if (notify) {
      ; (async () => {
        const worker = await window.navigator.serviceWorker.ready

        const pushManager = await worker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BDmzBWX_ZVY86pXthfcqsox_HET1M0ijNFmFeiMCTxnOoPrun9OVXGZMr_p-JqZnkSUrULNboygSOvlyyMDgoAU',
        })

        const res = await axios.post(host + '/sub', {
          pushManager,
          userID
        })

        if (res.data === 'created') {
          localStorage.setItem(userID, true)
        }
      })()
      setNotify(false)
    }

  }, [notify, userID, host])

  useEffect(() => {
    setHasNotify(localStorage.getItem(userID))
  }, [userID])

  function truncate() {
    setImgUrl()
    setVideoUrl()
    setAudioUrl()
  }

  function types(link) {
    let a = link.split('.')
    a = a[a.length - 1]
    if (a === 'mp3' || a === 'ogg') return <audio src={host + link} controls></audio>
    if (a === 'mp4' || a === 'avi' || a === 'mkv') return <video src={host + link} width={300} height={150} controls></video>
    if (a === 'jpg' || a === 'jpeg' || a === 'png') return <img src={host + link} width={200} height={100} alt='img' />
  }

  useEffect(() => {
    if (socket && editText && submit) {
      socket.emit('edit-text', {text: editText, chat_id: editable.chat_id})
      setSubmit(false)
      setEditable()
      setEditText()
    }
    if (submit) {
      setSubmit(false)
      setEditable()
      setEditText()
    }
  }, [socket, editable, editText, submit])

  useEffect(() => {
    if (socket) {
      socket.on('edit-text', data => {
        setChat(prev => [...prev.map(e => {
          if (e.chat_id === data.chat_id) {
            return data
          } else {
            return e
          }
        })])
      })
    }
  }, [socket, chats])

  // async function unRegister() {
  //   const worker = await window.navigator.serviceWorker.ready

  //   const subscription = await worker.pushManager.getSubscription()

  //   await subscription.unsubscribe()
  // }

  return (
    <>
    
      <button onClick={reloadPage}>reload page</button>
      <button onClick={logOut}>log out</button>
      {!hasNotify && <button onClick={() => {
        setNotify(true)
        setHasNotify(true)
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
        {selectedUser && <div className='second'>
          <div className='block'>chat with {selectedUser?.user_name}</div>

          {
            chats && chats.map((e, idx) => (
              <li className={e.sender_user_id === user?.user?.user_id ? 'chats chat-right' : 'chats'} key={idx}>
                
                <span>{e.sender_user_id === user?.user?.user_id ? user?.user?.user_name : selectedUser?.user_name}</span>
                <div onMouseEnter={() => setEdit(e.chat_id)} onMouseLeave={() => setEdit(false)}>
                  {e.chat && <p>{e.chat}</p>}
                  {e.file_link && types(e.file_link)}
                  {edit === e.chat_id && <div>
                    {!e.file_link && <span onClick={() => setEditable({chat: e.chat, chat_id: e.chat_id})}>edit</span>}
                    <span onClick={() => setUptOrDel(e.chat_id)}>delete</span>
                  </div>}
                </div>
              </li>
            ))
          }
          <ul>
          </ul>
          <form onSubmit={e => {
            e.preventDefault()
            e.target.reset()
          }}>
            {imgUrl && <img src={imgUrl} width={200} height={100} alt='img'/>}
            {videoUrl && <video src={videoUrl} width={400} height={200} controls></video>}
            {audioUrl && <audio src={audioUrl} controls></audio>}
            {(imgUrl || videoUrl || audioUrl) && <button onClick={truncate}>delete</button>}

            <input type="file" onChange={e => setDoc(e.target.files)} />
            {!editable && <input type="text" onChange={e => setText(e.target.value)} />}
            {editable && <input type="text" onChange={e => setEditText(e.target.value)} defaultValue={editable.chat} />}
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
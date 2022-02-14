import './UserProfile.css'
import axios from "axios"
import { useEffect, useState } from "react"


function UserProfile() {

  const [user, setUser] = useState()
  const [userID, setUserID] = useState()
  const [selectedUser, setSelectedUser] = useState()
  const [text, setText] = useState()
  const [doc, setDoc] = useState()
  const [submit, setSubmit] = useState(false)

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
    if (submit && userID && selectedUser && (text || doc)) {
        let data = new FormData()
        if (doc[0]) {
          data.append('file', doc[0])
          console.log(data, doc)
        }
      ;(async () => {
        const res = await axios.post('http://localhost:3001/chat', data, {
          headers: {
            userID,
            selectedUser: selectedUser?.user_id,
            text
          }
        })
        console.log(res)
      })()
      setText()
      setDoc()
      setSubmit(false)
    }
  }, [userID, selectedUser, text, doc, submit])

  return (
    <>
      <div  className="main-div">
        <div>
          <div>Welcome {user && user?.user?.user_name}</div>

          <div>All your friends</div>
          <ul>
            {
              user?.anothers && user?.anothers.map((e, idx) => (
                <li key={idx}>
                  <button onClick={() => setSelectedUser({user_id: e.user_id, user_name: e.user_name})}>
                    {e.user_name}
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        {selectedUser && <div>
          <div>{selectedUser?.user_name}</div>
          <ul>
            <li>
              <span>{selectedUser?.user_name}</span>
              <p>salam</p>
            </li>
          </ul>
          <form onSubmit={e => e.preventDefault()}>
            <input type="file" accept='.jpg, .jpeg, .png, .xlsx, .docx' onChange={e => setDoc(e.target.files)}/>
            <input type="text" onChange={e => setText(e.target.value)}/>
            <button onClick={() => setSubmit(true)}>send</button>
          </form>
        </div>}
      </div>
    </>
  )
}

export default UserProfile
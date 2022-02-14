import axios from "axios"
import { useEffect, useState } from "react"


function UserProfile () {

  const [user, setUser] = useState()

  useEffect(() => {
    ;(async () => {
      const res = await axios.get('http://localhost:3001/user', {
        params: {
          token: localStorage.getItem('token')
        }
      })
      res?.data?.user && setUser(res.data)
    })()
  }, [])

  console.log(user)

  return (
    <>
     <div>Welcome {user && user.user.user_name}</div>

      <div>All your friends</div>
      <ul>
        {
          user?.anothers && user?.anothers.map((e, idx) => (
            <li key={idx}>
              <button>
                {e.user_name}
              </button>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default UserProfile
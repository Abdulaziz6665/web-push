module.exports = {
  LOGIN: (req, res) => {
    res.send('okay')
  },
  LOGIN_POST: (req, res) => {
    console.log(req.body)
    // res.send('okay')
  },
  SIGN_UP: (req, res) => {
    console.log(req.body)
    // res.send('okay')
  },
}
const { Pool } = require('pg')

const host = {
  host: 'localhost',
  database: 'contacts',
  user: 'postgres',
  password: '6665',
  port: 5432
}
const devConfig = `postgresql://${host.user}:${host.password}@${host.host}:${host.port}/${host.database}`
// elephant db
const proConfig = 'postgres://binbbywu:aRsOFdlo7JesJrd1yUanrmKQgzO9mnJc@batyr.db.elephantsql.com/binbbywu'

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'production' ? proConfig : devConfig
})


const pg = async (SQL, ...params) => {
  const client = await pool.connect()

  try {
      const { rows }  = await pool.query(SQL, params)
      return rows

  } finally {
      client.release()
  }
}

module.exports.pg = pg
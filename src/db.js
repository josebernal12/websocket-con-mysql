const knex = require('knex')
const configMariaDB = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'websocket'
    },
    pool: { min: 0, max: 7 }
}

const configSQLite3 = {
    client: 'sqlite3',
    connection: {
      filename: './src/database/ecommerce.sqlite'
    },
    useNullAsDefault: true
}
const database = knex(configMariaDB)
const databaseSqlite = knex(configSQLite3)

module.exports = {
databaseSqlite,
database
}
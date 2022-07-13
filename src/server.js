//SETTINGS
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const puerto = process.env.PORT
const { Server: IOServer } = require('socket.io')
const database = require('./db')
const databaseSqlite = require('./db')
const expressServer = app.listen(puerto, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log(`Servidor escuchando puerto: ${puerto}`)
    }
})


const io = new IOServer(expressServer)
// DECLARATION OF VARIABLES
const messages = []
const product = []


//CONFIGURATION 
app.use(express.static(path.join(__dirname, '/public')))

const databaseMariadb = async () => {
    try {
        if (!database) {

            await database.schema.createTable('productos', (articulo) => {
                articulo.string("producto", 20).notNullable();
                articulo.float("precio");
                articulo.string("thumbnail", 20).notNullable();


            })
            console.log('table created');
            database.destroy();
        }
          


        

    } catch (error) {
        console.log(error)
    }
}

const databasesqlite = async () => {
    try {
        if (!databaseSqlite) {
            await databaseSqlite.schema.createTable('mensajes', (message) => {
                message.string("username", 20).notNullable();
                message.string("mensaje", 20).notNullable();
                message.float("resultado", 20).notNullable();
                message.float("time", 20).notNullable();


            })
            console.log('table created');
            databaseSqlite.destroy();
        }
     

    } catch (error) {
        console.log(error)
    }
}

const connection = () => {
    io.on('connection', socket => {
        console.log('Se conecto un usuario:', socket.id)
        io.emit('server:mensaje', messages)
        io.emit('server:producto', product)

        socket.on('cliente:producto', async products => {
            product.push(products)
            await database('productos').insert(product)
            io.emit('server:producto', product)

        })

        socket.on('cliente:mensaje', async message => {
            messages.push(message)
            await databaseSqlite('mensajes').insert(messages)
            io.emit('server:mensaje', messages)
        })

    })

}

databaseMariadb()
databasesqlite()
connection()
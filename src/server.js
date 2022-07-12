//SETTINGS
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const puerto = process.env.PORT
const { Server: IOServer } = require('socket.io')
const MariaDatabase = require('./db')
//const database = require('./db')
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

        if (!MariaDatabase) {

            await MariaDatabase.schema.createTable('productos', (articulo) => {
                articulo.string("producto", 20).notNullable();
                articulo.float("precio");
                articulo.string("thumbnail", 20).notNullable();


            })
            console.log('table created');
            MariaDatabase.destroy();
        }
      
      // Cuando le agrego esta parte para que me almacene los mensajes me manda un error me dice que enable to open database file, desde que le agrego el database a este archivo me tira ese error
        /*
        else if(!database){
            await database.schema.createTable('mensajes', (message) => {
                message.string("username", 20).notNullable();
                message.string("mensaje" ,20).notNullable();
                message.float("resultado", 20).notNullable();
                message.float("time", 20).notNullable();
            })
            console.log('table created');
            database.destroy();
        }
*/

        else{
         io.on('connection', socket => {
            console.log('Se conecto un usuario:', socket.id)
            io.emit('server:mensaje', messages)
            io.emit('server:producto', product)

            socket.on('cliente:producto', async products => {
           product.push(products)
               await MariaDatabase('productos').insert(product)
                io.emit('server:producto', product)

            })

            socket.on('cliente:mensaje', async message => {
                messages.push(message)
                // await database('mensajes').insert(messages)
                io.emit('server:mensaje', messages)
            })
        
        })
    }
    } catch (error) {
        console.log(error)
    }
}


databaseMariadb()
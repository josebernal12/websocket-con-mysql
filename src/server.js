//SETTINGS
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const Products = require('./producto/producto')
const Messages = require('./chat/chat')
const puerto = process.env.PORT
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(puerto, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log(`Servidor escuchando puerto: ${puerto}`)
    }
})


const io = new IOServer(expressServer)
// DECLARATION OF VARIABLES




//CONFIGURATION 
app.use(express.static(path.join(__dirname, '/public')))

Products.CreateTableProductos()
Messages.CreateTableChat()

//CONNECTIONS 
io.on('connection', async socket => {
    console.log('Se conecto un usuario:', socket.id)
    io.emit('server:mensaje', await Messages.getAll())
    io.emit('server:producto', await Products.getAll())

    socket.on('cliente:producto', async data => {
      await Products.insertProductos(data)
       const productos = await Products.getAll()
        io.emit('server:producto',productos)

    })

    socket.on('cliente:mensaje', async message => {
        await Messages.insertMessages(message)
        const mensaje = await Messages.getAll()
        io.emit('server:mensaje', mensaje)
    })

})
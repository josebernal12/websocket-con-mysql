//SETTINGS
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const Products = require('./producto/producto')
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
const messages = []



//CONFIGURATION 
app.use(express.static(path.join(__dirname, '/public')))

//CONNECTIONS 

io.on('connection', async socket => {
    console.log('Se conecto un usuario:', socket.id)
    io.emit('server:mensaje', messages)
    io.emit('server:producto', await Products.getProducts())

    socket.on('cliente:producto', async data => {
        const {producto, precio,thumbnail} = data
       await Products.insertProductos(producto, precio,thumbnail)
       const productos = await Products.getProducts()
        io.emit('server:producto',productos)

    })

    socket.on('cliente:mensaje', message => {
        messages.push(message)
        io.emit('server:mensaje', messages)
    })

})
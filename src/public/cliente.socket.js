
const socket = io()
// CHAT
const formMessage = document.querySelector('#formMessage')
const usernameInput = document.querySelector('#usernameInput')
const messageInput = document.querySelector('#messageInput')
const messagePool = document.querySelector('#messagePool')
const formProducto = document.querySelector('#formProducto')


//PRODUCT
const productoInput = document.querySelector('#productoInput')
const precioInput = document.querySelector('#precioInput')
const ProductoPool = document.querySelector('#ProductoPool')
const thumbnailInpunt = document.querySelector('#thumbnailInpunt')
const botonInput = document.querySelector('#botonInput')


// PRODUCT CONFIGURATION
botonInput.onclick = () => {


  const producto = productoInput.value
  const precio = precioInput.value
  const thumbnail = thumbnailInpunt.value
  socket.emit('cliente:producto', { producto, precio, thumbnail })

}
//SUBMIT PRODUCT
socket.on('server:producto', newData => {
  const html = `
  {{#each newData}}
      <tr>
          <th scope="row" class="text-center">{{ producto }}</th>
          <td class="text-center">$ {{ precio }}</td>
          <td class="text-center">
              <img height="80px" width="150px" src={{ url }} alt={{ producto }} />
          </td>
      </tr>
  {{/each}}
`;

  const template = Handlebars.compile(html);
  const data = template({ newData });

  ProductoPool.innerHTML = data;
})

//SUBMIT CHAT
formMessage.addEventListener('submit', event => {
  event.preventDefault()

  const username = usernameInput.value
  const message = messageInput.value
  const hours = new Date()
  const fecha = ([hours.getDate(), hours.getMonth(), hours.getFullYear()])
  const time = ([hours.getHours(), hours.getMinutes()])
  const resultado = fecha.join("/")




  socket.emit('cliente:mensaje', { username, message, resultado, time })
})


socket.on('server:mensaje', data => {
  messagePool.innerHTML = ""

  data.forEach(message => {
    messagePool.innerHTML += `<h2>  <b style= 'color: blue'> ${message.username}:  <b style= 'color: red'> [${message.resultado}]:  [${message.time}]:  <b style= 'color: green'> ${message.message} </h2>`

  })


})
const http = require('node:http')
const { findAvailablePort } = require('./10.free-port.js')

const desirePort = process.env.PORT ?? 3000
console.log(process.env)

const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('hola mundo')
})

findAvailablePort(desirePort).then(port => {
  server.listen(port, () => {
    console.log(`server listening on port http://localhost:${port}`)
  })
})

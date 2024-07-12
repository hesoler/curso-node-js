const fs = require('node:fs/promises')

console.log('Leyendo el primer archivo')
fs.readFile('./file.txt', 'utf-8')
  .then(text => {
    console.log('primer texto:', text)
  })

console.log('-----> hacer algo mientras lee el archivo')

console.log('Leyendo el segundo archivo')
fs.readFile('./newFile.txt', 'utf-8')
  .then(text => {
    console.log('segundo texto:', text)
  })

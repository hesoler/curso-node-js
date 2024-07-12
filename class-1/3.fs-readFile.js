const fs = require('node:fs')

/*
Para transformar de callback a promesa en módulos nativos
que no tienen promesas nativas:
    const { promisify } = require('node:util');
    const readFilePromise = promisify(fs.readFile)
*/

console.log('Leyendo el primer archivo')
fs.readFile('./file.txt', 'utf-8', (_err, text) => {
  console.log('primer texto:', text)
})

console.log('-----> hacer algo mientras lee el archivo')

console.log('Leyendo el segundo archivo')
fs.readFile('./newFile.txt', 'utf-8', (_err, text) => {
  console.log('segundo texto:', text)
})

const fs = require('node:fs')

console.log('Leyendo el primer archivo')
const text = fs.readFileSync('./file.txt', 'utf-8')
console.log('primer texto:', text)

console.log('-----> hacer algo mientras lee el archivo')

console.log('Leyendo el segundo archivo')
const secondText = fs.readFileSync('./newFile.txt', 'utf-8')
console.log('segundo texto:', secondText)

import { readFile } from 'node:fs/promises'

Promise.all([
  readFile('./file.txt', 'utf-8'),
  readFile('./newFile.txt', 'utf-8')
]).then(([text, secondText]) => {
  console.log('primer texto:', text)
  console.log('segundo texto:', secondText)
})

// console.log('Leyendo el primer archivo');
// const text = await readFile('./file.txt', 'utf-8',)
// console.log('primer texto:', text);

// console.log('-----> hacer algo mientras lee el archivo');

// console.log('Leyendo el segundo archivo');
// const secondText = await readFile('./newFile.txt', 'utf-8')
// console.log('segundo texto:', secondText)

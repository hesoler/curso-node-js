const { error, log } = require('node:console')
const fs = require('node:fs')

fs.readdir('.', (err, files) => {
  if (err) {
    error('Error al leer el directorio:', err)
    return
  }
  files.forEach(file => {
    log(file)
  })
})

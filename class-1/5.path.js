const path = require('node:path')

// barra separadora de ruta según SO
console.log(path.sep)

// unir rutas con path join
const filePath = path.join('content', 'subfolder', 'test.txt')
console.log(filePath)

const base = path.basename('tmp/midu-secret-files/password.txt')
console.log(base)

const extension = path.extname('image.jpg')
console.log(extension)

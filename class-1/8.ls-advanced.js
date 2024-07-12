const { error, log } = require('node:console')
const fs = require('node:fs/promises')
const path = require('node:path')

const pc = require('picocolors')

const folder = process.argv[2] ?? '.'

async function ls (folder) {
  log(folder)
  let files
  try {
    files = await fs.readdir(folder)
  } catch {
    error(pc.red(`❌ No se pudo leer el directorio ${folder}`))
    process.exit(1)
  }

  const filePromise = files.map(async (file) => {
    const filePath = path.join(folder, file)
    let stats
    try {
      stats = await fs.stat(filePath) // status => información de archivo
    } catch {
      error(`No se pudo leer el archivo ${filePath}`)
      process.exit(1)
    }

    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'd' : 'f'
    const fileSize = stats.size.toString()
    const fileModified = stats.mtime.toLocaleString()

    return `${fileType} ${pc.blue(file.padEnd(30))} ${pc.green(fileSize.padStart(10))} ${pc.yellow(fileModified)}`
  })

  const filesInfo = await Promise.all(filePromise)
  filesInfo.forEach(fileInfo => log(fileInfo))
}

ls(folder)

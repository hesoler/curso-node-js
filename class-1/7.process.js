// argumentos de entrada
console.log(process.argv)

// controlar el proceso y su salida
// process.exit(1)

// eventos del proceso
process.on('exit', () => {
  // limpiar los recursos
})

// ruta de trabajo
console.log(process.cwd())

// platform
console.log(process.env.PEPITO)

// dependencies
const path = require("path")
const fs = require("fs")

// var
const { stdout } = process
const dir = path.join(__dirname, "secret-folder")

// readdir
fs.readdir(dir, (_, files) => {
  files.forEach((file) => {
    // get name + ext
    const info = path.parse(file)

    fs.stat(path.resolve(dir, file), (_, stats) => {
      // handle ONLY files
      if (!stats.isFile()) {
        return
      }

      // get file size
      const size = stats.size / 1024

      // out formatted file info
      stdout.write(`${info.name} - ${info.ext.replace(".", "")} - ${size}kb\n`)
    })
  })
})

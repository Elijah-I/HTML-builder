// dependencies
const fs = require("fs")
const path = require("path")
const util = require("util")
const stream = require("stream")
const { ifExists } = require("../04-copy-directory")

// var
const pipeline = util.promisify(stream.pipeline)
const outputDir = path.join(__dirname, "project-dist")
const outputFile = path.join(outputDir, "bundle.css")
const readDir = path.join(__dirname, "styles")
const readExt = [".css"]

// grab files with EXT from DIR
const grabFiles = async (dir, ext) => {
  const files = []
  const items = await fs.promises.readdir(dir)

  for (let item of items) {
    // set real Item path
    item = path.join(dir, item)

    // get name + ext
    const info = path.parse(item)

    // get isFile func
    const stats = await fs.promises.stat(item)

    // check if ITEM is File and has required Ext
    if (stats.isFile() && ext.includes(info.ext)) {
      files.push(item)
    }
  }

  return files
}

// remove file if exists [export]
const rmFile = async (file) => {
  const exists = await ifExists(file)
  if (exists) {
    await fs.promises.unlink(file)
  }
}

// create bunlde
const createBundle = async (outputFile, readDir, readExt) => {
  await rmFile(outputFile)
  const files = await grabFiles(readDir, readExt)

  for (const file of files) {
    await pipeline(
      fs.createReadStream(file, "utf-8"),
      fs.createWriteStream(outputFile, { flags: "a", encoding: "utf-8" })
    )
  }
}

// run
createBundle(outputFile, readDir, readExt)

module.exports = { rmFile, createBundle }

// dependencies
const fs = require("fs")
const path = require("path")
const util = require("util")
const stream = require("stream")
const { mkDir, rmDir, copyDir } = require("../04-copy-directory")
const { createBundle } = require("../05-merge-styles")

// var
const pipeline = util.promisify(stream.pipeline)

const outputDir = path.join(__dirname, "project-dist")
const outputCssFile = path.join(outputDir, "style.css")
const outputHTMLFile = path.join(outputDir, "index.html")
const outputAssetsDir = path.join(outputDir, "assets")

const readComponentsDir = path.join(__dirname, "components")
const readHTMLFile = path.join(__dirname, "template.html")
const readAssetsDir = path.join(__dirname, "assets")
const readCssDir = path.join(__dirname, "styles")
const readCssExt = [".css"]

// read / write alias
const read = (file) => {
  return fs.createReadStream(file, "utf-8")
}
const write = (file) => {
  return fs.createWriteStream(file)
}

// replacement
const replacement = new stream.Transform({
  async transform(chunk, _, callback) {
    let order = 0
    const patterns = chunk
      .toString()
      .match(/\{\{[a-zA-Z0-9_-]{1,}\}\}/g)
      .map((el) => el.replace(/[\{\}]/g, ""))
    const components = patterns.map((el) => path.join(readComponentsDir, `${el}.html`))
    const replacements = stream.Readable.from(components).flatMap((file) => read(file))

    for await (const replacement of replacements) {
      chunk = chunk.toString().replace(`{{${patterns[order]}}}`, replacement)
      order++
    }

    callback(null, chunk)
  }
})

// create HTML
const createHTML = async (fileFrom, fileTo) => {
  const input = read(fileFrom)
  const output = write(fileTo)

  await pipeline(input, replacement, output)
}

// make build
const build = async () => {
  await rmDir(outputDir)
  await mkDir(outputDir)
  await createBundle(outputCssFile, readCssDir, readCssExt)
  await copyDir(readAssetsDir, outputAssetsDir)
  await createHTML(readHTMLFile, outputHTMLFile)
}

build()

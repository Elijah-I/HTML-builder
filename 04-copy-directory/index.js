// dependencies
const path = require("path")
const fs = require("fs")

// var
const dirFrom = path.join(__dirname, "files")
const dirTo = path.join(__dirname, "files-copy")

// make copy [export]
const copyDir = async (dirFrom, dirTo, subDir = "") => {
  // get files + folders
  const items = await fs.promises.readdir(path.join(dirFrom, subDir))

  // remove copy dir to "actualize it" [only first function call]
  if (!subDir) {
    await rmDir(dirTo)
  }

  // create copy dir
  await mkDir(dirTo)

  // habdle files + folders
  for (const item of items) {
    // local var
    const itemFrom = path.resolve(dirFrom, subDir, item)
    const itemTo = path.resolve(dirTo, subDir, item)

    // get file stats file
    const stats = await fs.promises.stat(itemFrom)

    if (stats.isFile()) {
      // copy file
      await copyFile(itemFrom, itemTo)
    } else {
      // create new dir
      await mkDir(itemTo)
      copyDir(dirFrom, dirTo, path.join(subDir, item))
    }
  }
}

// create dir if not exists [export]
const mkDir = async (dir) => {
  const exists = await ifExists(dir)
  if (!exists) {
    await fs.promises.mkdir(dir)
  }
}

// remove dir if exists
const rmDir = async (dir) => {
  const exists = await ifExists(dir)
  if (exists) {
    await fs.promises.rm(dir, { recursive: true, force: true })
  }
}

// copy file if not exists or changed
const copyFile = async (fileFrom, fileTo) => {
  const exists = await ifExists(fileTo)
  if (!exists) {
    await fs.promises.copyFile(fileFrom, fileTo)
  }
}

// check if exists [export]
const ifExists = (item) => {
  return new Promise((resolve) => {
    fs.exists(item, (exists) => {
      resolve(exists)
    })
  })
}

// make copy
copyDir(dirFrom, dirTo)

module.exports = { copyDir, copyFile, mkDir, rmDir, ifExists }

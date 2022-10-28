// dependencies
const fs = require("fs")
const path = require("path")

// var
const { stdin, stdout } = process
const file = path.join(__dirname, "text.txt")
const message = {
  START: "enter text:\n",
  FINISH: "bye!"
}

// cretate file
fs.open(file, "w", () => {})

// show start message
stdout.write(message.START)

// handle user text
stdin.on("data", (data) => {
  if (data.toString().trim() == "exit") {
    exit()
  }
  fs.appendFile(file, data.toString(), () => {})
  stdout.write(message.START)
})

const exit = () => {
  stdout.write(message.FINISH)
  process.exit()
}

// handle script exit
process.on("SIGINT", exit)

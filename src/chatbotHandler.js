const fse = require('fs-extra')
const path = require('path')
const childProcess = require('child_process')

module.exports = {
  newBot: (uuid) => {
    fse.copySync(
      path.resolve(__dirname, 'chatbot', 'data', 'training', 'default'),
      path.resolve(__dirname, 'chatbot', 'data', 'training', uuid)
    )
    childProcess.exec(
      `${path.resolve(
        __dirname,
        'chatbot',
        'venv',
        'bin',
        'python3'
      )} ${path.resolve(__dirname, 'chatbot', 'train.py')} ${uuid}`,
      { cwd: path.resolve(__dirname, 'chatbot') },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err)
        } else if (stderr) {
          console.log(stderr)
        }
      }
    )
  },
  getAnswer: (uuid, message, callback) => {
    childProcess.exec(
      `${path.resolve(
        __dirname,
        'chatbot',
        'venv',
        'bin',
        'python3'
      )} ${path.resolve(
        __dirname,
        'chatbot',
        'getAnswer.py'
      )} ${uuid} \"${message}\"`,
      { cwd: path.resolve(__dirname, 'chatbot') },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err)
        } else if (stderr) {
          console.log(stderr)
        }
        callback(stdout)
      }
    )
  },
}

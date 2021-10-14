const { Service } = require('egg')
const fse = require('fs-extra')
const path = require('path')
const nodemailer = require('nodemailer')

const userEmail = 'gaolibemail@126.com'
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'UPZTGYOTPPWLMOJQ'
  }
})

class ToolService extends Service {
  async mergeFile(filePath, hash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, hash)
    let chunks = await fse.readdir(chunkDir)
    chunks.sort((a,b) => a.split('-')[1]- b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkDir, cp))
    await this.mergeChunks(chunks, filePath, size)
  }

  async mergeChunks(files, dest, size) {
    const pipeStream = (filePath, writeStream) => new Promise((resolve) => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })

    await Promise.all(
      files.map((file, index) => {
        pipeStream(file, fse.createWriteStream(dest, {
          start: index * Math.ceil(size),
          end: (index + 1) * Math.ceil(size)
        }))
      })
    )
  }

  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch(err) {
      return false
    }
  }
}

module.exports = ToolService

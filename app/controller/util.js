const BaseController = require('./base')
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path')

class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3
    })
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = "image/svg+xml"
    this.ctx.body = captcha.data
  }

  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    let code  = Math.random().toString().slice(2, 6)
    ctx.session.emailcode = code

    const subject = '验证码'
    const text = ''
    const html = `<h2>Gao</h2><a href="https://github.com/GaoLib"><span>${code}</span></a>`
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }

  async uploadfile() {
    // ! 模拟上传报错
    if (Math.random() < 0.3) {
      return this.ctx.status = 500
    }

    const { ctx } = this
    const file = ctx.request.files[0]
    const { hash, name } = ctx.request.body

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
    // const filePath = path.resolve()

    if (!fse.exists(chunkPath)) {
      await fse.mkdir(chunkPath)
    }
    await fse.move(file.filepath, `${chunkPath}/${name}`)
    // this.success({
    //   url: `public/${file.filename}`
    // })
    this.message('切片上传成功')
  }

  async mergefile() {
    const { ext, size, hash } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.ctx.service.tools.mergeFile(filePath, hash, size)
    this.success({
      url: `public/${hash}.${ext}`
    })
  }

  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath) ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.') : []
  }

  async checkfile() {
    const { ext, hash } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    let uploaded = false
    let uploadedList = []
    if (fse.existsSync(filePath)) {
      uploaded = true
    } else {
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash))
    }
    this.success({
      uploaded,
      uploadedList
    })
  }
}

module.exports = UtilController

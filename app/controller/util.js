const BaseController = require('./base')
const svgCaptcha = require('svg-captcha')

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
    const { ctx } = this
    const file = request.files[0]
    const { name } = request.body
    console.log(name, file)
    this.success('上传成功')
  }
}

module.exports = UtilController

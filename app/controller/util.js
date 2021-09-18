const Controller = require('egg').Controller
const svgCaptcha = require('svg-captcha')

class UtilController extends Controller {
  async captcha() {
    const captcha = svgCaptcha.create()
    console.log(captcha)
    this.ctx.body = captcha
  }
}

module.exports = UtilController

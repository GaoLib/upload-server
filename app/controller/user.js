const BaseController = require('./base')

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' }
}

class UserController extends BaseController {
  async login() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }

  async register() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch(e) {
      return this.error('参数校验失败', -1, e.errors)
    }

    // const { email, passwd, captcha, nickname } = ctx.request.body
    // if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {

    // } else {
    //   this.error('验证码错误')
    // }

    this.success({ name: 'test' })
  }

  async verify() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }

  async info() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }
}

module.exports = UserController

const md5 = require('md5')
const BaseController = require('./base')

const hashSalt = ':GaoLib'

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

    const { email, passwd, captcha, nickname } = ctx.request.body
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      if (await this.checkEmail(email)) {
        this.error('邮箱重复')
      } else {
        const ret = await ctx.model.User.create({
          email,
          nickname,
          passwd: md5(passwd + hashSalt)
        })

        if (ret.id) {
          this.message('注册成功')
        }
      }
    } else {
      this.error('验证码错误')
    }
  }

  async checkEmail(email) {
    const user = this.ctx.model.User.findOne({ email })
    return user
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

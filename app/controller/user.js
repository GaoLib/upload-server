const md5 = require('md5')
const jwt = require('jsonwebtoken')
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
    const { ctx, app } = this
    const { email, passwd, captcha } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(passwd + hashSalt)
    })

    if (!user) {
      return this.error('用户名密码错误')
    }

    const token = jwt.sign({
      _id: user._id,
      email
    }, app.config.jwt.secret, {
      expiresIn: '1h'
    })
    this.success({ token, email, nickname: user.nickname })
  }

  async register() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch(e) {
      return this.error('参数校验失败', -1, e.errors)
    }

    const { email, passwd, captcha, nickname } = ctx.request.body

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }

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

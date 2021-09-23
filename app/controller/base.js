// 规范
const { Controller } = require('egg')

class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 0,
      data
    }
  }
  message(msg) {
    this.ctx.body = {
      code: 0,
      msg
    }
  }
  error(msg, code = -1, errors = {}) {
    this.ctx.body = {
      code,
      msg,
      errors
    }
  }
}

module.exports = BaseController

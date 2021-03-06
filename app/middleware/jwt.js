const jwt = require('jsonwebtoken')

module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: -666,
        msg: '用户没有登录'
      }
      return
    }
    
    const token = ctx.request.header.authorization.replace('Bearer ', '')
    try {
      const ret = jwt.verify(token, app.config.jwt.secret)
      ctx.state.email = ret.email
      ctx.state.userid = ret._id
      await next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          msg: '登录过期了'
        }
      } else {
        ctx.body = {
          code: -1,
          msg: '用户信息出错'
        }
      }
    }
  }
}
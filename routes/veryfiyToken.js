const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  //检查headers有没有token
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json("未登录")

  //提取并解析 token
  const token = authHeader.split(" ")[1]
  jwt.verify(token, process.env.JWT_KEY, (err, data) => {
    if (err) res.status(403).json(err.message)

    //写入token包含的信息
    req.token = data
    next()
  })
}

const authorize = (req, res, next) => {
  //若token id 和url id一致（是本人），或为管理员，则授权进行下一步
  if (req.token.id === req.params.id || req.token.isAdmin) next()
  else res.status(403).json("无权限")
}

//是否为管理员
const admin = (req, res, next) => {
  if (req.token.isAdmin) next()
  else res.status(403).json("无权限")
}

module.exports = { verifyToken, authorize, admin }

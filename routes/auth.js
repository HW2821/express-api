const router = require("express").Router()
const User = require("../models/User")
const crypto = require("../utils/crypto")
const jwt = require("jsonwebtoken")

//注册 req.body = {username, email, password}
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: crypto.encrypt(req.body.password),
  })

  try {
    const savedUser = await newUser.save()
    res.status(200).json(savedUser)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//登录 req.body = { username, password }
router.post("/login", async (req, res) => {
  try {
    //查找用户
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(401).json("用户不存在")
    //验证密码
    const decrypted = crypto.decrypt(user.password)
    if (decrypted !== req.body.password) return res.status(401).json("密码错误")

    //登录成功，生成 jwt token，写入用户 id 和权限
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    )

    //返回user，去掉password，附加token
    const { password, ...others } = user._doc
    return res.status(200).json({ ...others, accessToken })
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

const UserCollection = require("../models/User")
const crypto = require("../utils/crypto")
const { verifyToken, authorize, admin } = require("./veryfiyToken")
const router = require("express").Router()

//修改用户资料（用户名，邮箱，密码等）
//提供：id（url），token（headers），内容（req.body）
router.put(
  "/:id",
  //中间件验证解析token
  verifyToken,
  //对比token id 和 请求里的 id，授权
  authorize,
  //授权通过
  async (req, res) => {
    if (req.body.password) req.body.password = crypto.encrypt(req.body.password)

    try {
      const updatedUser = await UserCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      res.status(200).json(updatedUser)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
)

//删除用户(url id and token)
router.delete("/:id", verifyToken, authorize, async (req, res) => {
  try {
    const deleteUser = await UserCollection.findByIdAndDelete(req.params.id)

    res.status(200).json("User deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//查找管理员
router.get("/find/:id", verifyToken, admin, async (req, res) => {
  try {
    const user = await UserCollection.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//查找所有用户
router.get("/", verifyToken, admin, async (req, res) => {
  try {
    const users = await UserCollection.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get("/stats", verifyToken, admin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    //获取每月新增用户数
    const data = await UserCollection.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

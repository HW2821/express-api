const OrderCollection = require("../models/Order")
const { verifyToken, admin, authorize } = require("./veryfiyToken")
const router = require("express").Router()

//添加订单
router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new OrderCollection(req.body)
    res.status(200).json(newOrder)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//管理员修改订单
router.put("/:id", verifyToken, admin, async (req, res) => {
  try {
    const update = await OrderCollection.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(update)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//管理员删除order
router.delete("/:id", verifyToken, admin, async (req, res) => {
  try {
    const deleteOrder = await OrderCollection.findByIdAndDelete(req.params.id)
    res.status(200).json("Order deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//查看order
router.get("/find/:id", verifyToken, authorize, async (req, res) => {
  try {
    const orders = await OrderCollection.findOne({ userId: req.params.id })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//根据筛选条件查看商品，条件：品类，创建日期
router.get("/", verifyToken, admin, async (req, res) => {
  try {
    const allUsersOrders = await OrderCollection.find()
    res.status(200).json(allUsersOrders)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//获取每月收入
router.get("/income", verifyToken, admin, async (req, res) => {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(date.setMonth(date.getMonth() - 2))
  try {
    const monthIncome = await OrderCollection.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: { month: { $month: "createdAt " }, sales: "$amount" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ])
    res.status(200).json(monthIncome)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

const CartCollection = require("../models/Cart")
const { verifyToken, authorize, admin } = require("./veryfiyToken")

const router = require("express").Router()

//用户添加购物车商品种类
router.post("/", verifyToken, authorize, async (req, res) => {
  const newCart = new CartCollection(req.body)
  try {
    const savedProduct = await newCart.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
})

//用户更新购物车某件商品
router.put("/:id", verifyToken, authorize, async (req, res) => {
  try {
    const updateCart = await CartCollection.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updateCart)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//用户删除购物车某件商品
router.delete("/:id", verifyToken, authorize, async (req, res) => {
  try {
    const deleteCart = await CartCollection.findByIdAndDelete(req.params.id)
    res.status(200).json("cart item deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//用户获取购物车
router.get("/find/:id", verifyToken, authorize, async (req, res) => {
  try {
    const userCart = await CartCollection.findOne({ userId: req.params.id })
    res.status(200).json(userCart)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//管理员获取所有购物车
router.get("/", verifyToken, admin, async (req, res) => {
  try {
    const allUsersCarts = await CartCollection.find()
    res.status(200).json(allUsersCarts)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

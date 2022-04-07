const { verifyToken, admin, authorize } = require("./veryfiyToken")
const router = require("express").Router()

router.get("/:id", verifyToken, authorize, async (req, res) => {
  try {
    setTimeout(() => {
      res.status(200).json("支付成功")
    }, 1000)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

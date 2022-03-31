const { verifyToken, admin, authorize } = require("./veryfiyToken")
const router = require("express").Router()

router.get("/payment", async (req, res) => {
  try {
    res.status(200).json("payment done")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

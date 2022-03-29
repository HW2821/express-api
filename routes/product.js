const router = require("express").Router()
const ProductCollection = require("../models/Product")
const { verifyToken, admin } = require("./veryfiyToken")

router.post("/", verifyToken, admin, async (req, res) => {
  const newProduct = new ProductCollection(req.body)

  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

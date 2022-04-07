const router = require("express").Router()
const ProductCollection = require("../models/Product")
const { verifyToken, admin } = require("./veryfiyToken")

//管理员添加商品
router.post("/", verifyToken, admin, async (req, res) => {
  const newProduct = new ProductCollection(req.body)

  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//管理员修改商品
router.put("/:id", verifyToken, admin, async (req, res) => {
  try {
    const update = await ProductCollection.findByIdAndUpdate(
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

//管理员删除商品
router.delete("/:id", verifyToken, admin, async (req, res) => {
  try {
    const deleteProduct = await ProductCollection.findByIdAndDelete(req.params.id)
    res.status(200).json("product deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//查看一件产品
router.get("/find/:id", async (req, res) => {
  try {
    const product = await ProductCollection.findById(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//根据筛选条件查看商品，条件：品类，创建日期
router.get("/", async (req, res) => {
  const qNew = req.query.new
  const qCategory = req.query.category
  try {
    let products
    if (qNew) {
      products = await ProductCollection.find().sort({ createdAt: -1 }).limit(5)
    } else if (qCategory) {
      products = await ProductCollection.find({
        categories: {
          $in: [qCategory],
        },
      })
    } else products = await ProductCollection.find()

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router

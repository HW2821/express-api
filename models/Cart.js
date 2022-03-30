const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    products: [{ productId: { type: String }, quantity: { type: Number, default: 1 } }],
  },
  { timestamps: true }
)

const CartCollection = mongoose.model("Cart", CartSchema)

module.exports = CartCollection

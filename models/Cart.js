const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    cartItems: [
      {
        _id: { type: String },
        price: { type: Number },
        img: String,
        title: String,
        amount: { type: Number, default: 1 },
        color: { type: String },
        size: { type: String },
      },
    ],
  },
  { timestamps: true }
)

const CartCollection = mongoose.model("Cart", CartSchema)

module.exports = CartCollection

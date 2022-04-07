require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const paymentRoute = require("./routes/payment")

//mongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err))

// use middlewares
app.use(
  cors({
    origin: ["192.168.0.225", "http://localhost:3000"],
  })
)
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.headers)
  next()
  // console.log(res)
})
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/payment", paymentRoute)

//start server
app.listen(process.env.PORT || 5000, () => {
  console.log("backend server is running")
})

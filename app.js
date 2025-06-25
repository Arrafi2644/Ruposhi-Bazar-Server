import express from "express";
import cors from "cors"
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/carts', cartRoutes)
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/orders', orderRoutes)

app.get("/", (req, res) => {
    res.send("RuposheeBazar is running.")
})

export default app;
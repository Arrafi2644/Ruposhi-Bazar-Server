
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { cartsCollection } from "../config/collections.js";
import { ObjectId } from "mongodb";
const cartRoutes = express.Router();

cartRoutes.get("/:email", async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const result = await cartsCollection.find(query).toArray();
    res.send(result)
})

cartRoutes.post("/", async (req, res) => {
    const product = req.body;

    const result = await cartsCollection.insertOne(product)
    res.send(result)

})

cartRoutes.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { newQuantity } = req.body;

    const query = { _id: new ObjectId(id) }

    const updatedDoc = {
        $set: {
            quantity: newQuantity
        }
    }

    const result = await cartsCollection.updateOne(query, updatedDoc)
    res.send(result)
})

cartRoutes.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }

    const result = await cartsCollection.deleteOne(query)
    res.send(result)
})


cartRoutes.delete("/", async (req, res) => {
    const cartItems = req.body;

    if (!Array.isArray(cartItems)) {
        return res.status(400).json({ error: "Expected an array of cart items" });
    }

    const idsToDelete = cartItems.map(item => new ObjectId(item._id));

    const result = await cartsCollection.deleteMany({
        _id: { $in: idsToDelete }
    });

    res.send(result);
});



export default cartRoutes;
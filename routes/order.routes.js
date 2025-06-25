
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { orderCollection } from "../config/collections.js";
import { ObjectId } from "mongodb";
const orderRoutes = express.Router();

//  orders routes 
orderRoutes.get("/admin/:email", verifyToken, verifyAdmin, async (req, res) => {
    const email = req.params.email;
    const result = await orderCollection.find().toArray()
    res.send(result)
})

orderRoutes.get("/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const query = { customerEmail: email }
    const result = await orderCollection.find(query).toArray();
    res.send(result)
})

orderRoutes.post("/", verifyToken, async (req, res) => {
    const orderInfo = req.body;
    const result = await orderCollection.insertOne(orderInfo)
    res.send(result)
})

orderRoutes.patch("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.updatedStatus;
    console.log(newStatus);
    const filter = { _id: new ObjectId(id) }

    const updatedDoc = {
        $set: {
            status: newStatus
        }
    }

    const result = await orderCollection.updateOne(filter, updatedDoc)
    res.send(result)
})

export default orderRoutes;
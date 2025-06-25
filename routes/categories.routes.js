
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { categoriesCollection } from "../config/collections.js";
import { ObjectId } from "mongodb";
const categoryRoutes = express.Router();


categoryRoutes.get("/", async (req, res) => {
    const result = await categoriesCollection.find().toArray()
    res.send(result);
})

categoryRoutes.post("/", verifyToken, verifyAdmin, async (req, res) => {
    const category = req.body;
    console.log(category);
    const result = await categoriesCollection.insertOne(category)
    res.send(result)
})

categoryRoutes.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedCategory = req.body;
    const query = { _id: new ObjectId(id) }
    const updatedDoc = {
        $set: updatedCategory
    }
    const result = await categoriesCollection.updateOne(
        query, updatedDoc
    );

    res.send(result)
})

categoryRoutes.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await categoriesCollection.deleteOne(query)
    res.send(result)
})

export default categoryRoutes;
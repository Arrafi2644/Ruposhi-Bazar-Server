
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { productsCollection } from "../config/collections.js";
import { ObjectId } from "mongodb";
const productRoutes = express.Router();

// products 
productRoutes.get("/", async (req, res) => {
    const category = req?.query?.category || ""
    console.log("query ", req?.query);
    let query = {};
    //   if (category) {
    //         query.$or = [
    //             { category: { $regex: category, $options: "i" } },
    //             { title: { $regex: category, $options: "i" } },
    //             { brand: { $regex: category, $options: "i" } },
    //             { productName: { $regex: category, $options: "i" } }
    //         ];
    //     }

    if (category) {
        query.$or = [
            { category: { $regex: category, $options: "i" } },
            { title: { $regex: category, $options: "i" } },
            { brand: { $regex: category, $options: "i" } },
            { productName: { $regex: category, $options: "i" } },
            { model: { $regex: category, $options: "i" } }
        ];
    }

    const result = await productsCollection.find(query).toArray();
    res.send(result)
})

//  { category: { $regex: category, $options: "i" } },

productRoutes.post("/", verifyToken, verifyAdmin, async (req, res) => {
    const product = req.body;
    console.log(product);

    const result = await productsCollection.insertOne(product)
    res.send(result)
})

productRoutes.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;
    const query = { _id: new ObjectId(id) }
    const updatedDoc = {
        $set: updatedProduct
    }
    const result = await productsCollection.updateOne(
        query, updatedDoc
    );
    res.send(result);
})

productRoutes.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.updatedStockStatus;
    console.log(newStatus);
    const filter = { _id: new ObjectId(id) }

    const updatedDoc = {
        $set: {
            isStock: newStatus
        }
    }
    const result = await productsCollection.updateOne(filter, updatedDoc)
    res.send(result)
    // console.log(result);
})

productRoutes.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await productsCollection.deleteOne(query)
    res.send(result)
})


export default productRoutes;
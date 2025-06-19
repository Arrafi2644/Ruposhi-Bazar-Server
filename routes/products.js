const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (productsCollection, verifyToken, verifyAdmin) => {
  const router = express.Router();

  // Get all products
  router.get("/", async (req, res) => {
    const result = await productsCollection.find().toArray();
    res.send(result);
  });

  // Get a product by ID
  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    res.send(product);
  });

  // Add new product (admin only)
  router.post("/", verifyToken, verifyAdmin, async (req, res) => {
    const product = req.body;
    const result = await productsCollection.insertOne(product);
    res.send(result);
  });

  // Delete a product (admin only)
  router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });

  return router;
};

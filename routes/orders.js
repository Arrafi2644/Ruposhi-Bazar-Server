const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (orderCollection, verifyToken, verifyAdmin) => {
  const router = express.Router();

  // Get orders for a user
  router.get("/", verifyToken, async (req, res) => {
    const email = req.query.email;
    if (req.decoded.email !== email) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const result = await orderCollection.find({ email }).toArray();
    res.send(result);
  });

  // Create a new order
  router.post("/", verifyToken, async (req, res) => {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send(result);
  });

  // Delete an order
  router.delete("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const result = await orderCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });

  return router;
};

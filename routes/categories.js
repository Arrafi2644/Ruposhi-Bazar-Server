const express = require("express");

module.exports = (categoriesCollection, verifyToken, verifyAdmin) => {
  const router = express.Router();

  // Get all categories
  router.get("/", async (req, res) => {
    const result = await categoriesCollection.find().toArray();
    res.send(result);
  });

  // Add new category (admin only)
  router.post("/", verifyToken, verifyAdmin, async (req, res) => {
    const category = req.body;
    const result = await categoriesCollection.insertOne(category);
    res.send(result);
  });

  return router;
};

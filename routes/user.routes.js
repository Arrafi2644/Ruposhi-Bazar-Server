import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { userCollection } from "../config/collections.js";

const userRoutes = express.Router()

// jwt related api
userRoutes.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
    res.send({ token })
})

userRoutes.get("/:email", verifyToken, async (req, res) => {
    try {
        const users = await userCollection.find().toArray();
        res.send(users);
    } catch (err) {
        console.error("Failed to fetch users:", err);
        res.status(500).send("Failed to fetch users");
    }
})

// admin check 
userRoutes.get('/admin/:email', verifyToken, verifyAdmin, async (req, res) => {
    const email = req.params.email;
    if (email !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidden access' })
    }
    const query = { email: email }
    const user = await userCollection.findOne(query)

    let isAdmin = false;
    if (user) {
        isAdmin = user?.role === "Admin";
    }
    res.send(isAdmin)
})


userRoutes.post("/", async (req, res) => {
    const user = req.body;
    const query = { email: user?.email };
    const isExist = await userCollection.findOne(query);

    if (isExist) {
        return res.send({ message: "User already exists", user: isExist });
    }

    const result = await userCollection.insertOne(user);
    res.send(result);
});

userRoutes.patch("/:id", async (req, res) => {
    const id = req.params.id;
    console.log("user id ", id);
    const newRole = req.body.updatedRole;
    console.log(newRole);
    const filter = { _id: new ObjectId(id) }

    const updatedDoc = {
        $set: {
            role: newRole
        }
    }

    const result = await userCollection.updateOne(filter, updatedDoc)
    res.send(result)
    console.log(result);
})


export default userRoutes;
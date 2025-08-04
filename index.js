// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const jwt = require('jsonwebtoken');
// const port = process.env.PORT || 5000;



// app.use(cors())
// app.use(express.json())


// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// // const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.o1o8917.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.o1o8917.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         // await client.connect();

//         // collections 
//         const userCollection = client.db("RuposheeBazar").collection("users");
//         const orderCollection = client.db("RuposheeBazar").collection("orders");
//         const productsCollection = client.db("RuposheeBazar").collection("products");
//         const categoriesCollection = client.db("RuposheeBazar").collection("categories");
//         const cartsCollection = client.db("RuposheeBazar").collection("carts");

//         // Verify token 

//         // verify token middleware 
//         const verifyToken = (req, res, next) => {
//             console.log("Inside the verify middleware ", req.headers.authorization);

//             if (!req.headers.authorization) {
//                 return res.status(401).send({ message: 'unauthorized access' })
//             }

//             const token = req.headers.authorization.split(" ")[1];
//             console.log("Token is ", token);

//             jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
//                 if (error) {
//                     return res.status(401).send({ message: "unauthorized access" })
//                 }
//                 req.decoded = decoded;
//                 next();
//             })

//         }

//         // verify admin 
//         const verifyAdmin = async (req, res, next) => {
//             const email = req.decoded.email;
//             const query = { email: email }
//             const user = await userCollection.findOne(query)

//             if (user.role !== 'Admin') {
//                 return res.status(403).send({ message: "forbidden access" });
//             }

//             next()
//         }

//  
//         
//     


//         // Send a ping to confirm a successful connection
//         // await client.db("admin").command({ ping: 1 });
//         // console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }
// run().catch(console.dir);


// app.get("/", (req, res) => {
//     res.send("Ruposhi bazar is running");
// })

// app.listen(port, () => {
//     console.log(`RuposheeBazar is running on port ${port}`)
// })

import app from "./app.js";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
dotenv.config();
let server;
const port = process.env.PORT || 5000;

const bootstrap = async () => {
    await connectToDB();
    server = app.listen(port, () => {
        console.log(`RuposheeBazar is running on port ${port}`);
    })
}

bootstrap();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.o1o8917.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.o1o8917.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // collections 
        const userCollection = client.db("RuposheeBazar").collection("users");
        const orderCollection = client.db("RuposheeBazar").collection("orders");


        // Verify token 
        
    // verify token middleware 
    const verifyToken = (req, res, next) => {
      console.log("Inside the verify middleware ", req.headers.authorization);

      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' })
      }

      const token = req.headers.authorization.split(" ")[1];
      console.log("Token is ", token);

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
          return res.status(401).send({ message: "unauthorized access" })
        }
        req.decoded = decoded;
        next();
      })

    }

        // jwt related api 
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
            res.send({ token })
        })

        //  users routes 
        app.get("/users", async (req, res) => {
            try {
                const users = await userCollection.find().toArray();
                res.send(users);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                res.status(500).send("Failed to fetch users");
            }
        })

        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user?.email };
            const isExist = await userCollection.findOne(query);

            if (isExist) {
                return res.send({ message: "User already exists", user: isExist });
            }

            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        //  orders routes 

        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const query = { customerEmail: email }
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })

        app.post("/orders", async (req, res) => {
            const orderInfo = req.body;
            const result = await orderCollection.insertOne(orderInfo)
            res.send(result)
        })

        app.patch("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }

            const updatedDoc = {
                $set: {
                    status: "Canceled"
                }
            }

            const result = await orderCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Ruposhi bazar is running");
})

app.listen(port, () => {
    console.log(`RuposheeBazar is running on port ${port}`)
})

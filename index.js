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
        const productsCollection = client.db("RuposheeBazar").collection("products");
        const categoriesCollection = client.db("RuposheeBazar").collection("categories");


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

        // verify admin 
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)

            if (user.role !== 'Admin') {
                return res.status(403).send({ message: "forbidden access" });
            }

            next()
        }

        // jwt related api 
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
            res.send({ token })
        })


        //  users routes 
        app.get("/users/:email", verifyToken, verifyAdmin, async (req, res) => {
            try {
                const users = await userCollection.find().toArray();
                res.send(users);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                res.status(500).send("Failed to fetch users");
            }
        })

        // admin check 
        app.get('/users/admin/:email', verifyToken, async (req, res) => {
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

        app.patch("/users/:id", async (req, res) => {
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

        //  orders routes 

        app.get("/orders/admin/:email", verifyToken, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find().toArray()
            res.send(result)
        })

        app.get("/orders/:email", verifyToken, async (req, res) => {
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

        // products 
        app.get("/products", async (req, res) => {
            const category = req?.query?.category || ""
            console.log(category);
            let query = {};
            if(category){
        if (category) {
          query.category = {
            $regex: category,
            $options: "i"
          };
        }
      }
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })

        app.post("/products", async (req, res) => {
            const product = req.body;
            console.log(product);

            const result = await productsCollection.insertOne(product)
            res.send(result)
        })

        app.put("/products/:id", async (req, res) => {
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

          app.patch("/products/:id", async (req, res) => {
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


        // categories
        app.get("/categories", async(req, res) => {
           const result = await categoriesCollection.find().toArray()
           res.send(result);
        })

        app.post("/categories", async(req, res) => {
            const category = req.body;
            console.log(category);
            const result = await categoriesCollection.insertOne(category)
            res.send(result)
        })

           app.put("/categories/:id", async(req, res) => {
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

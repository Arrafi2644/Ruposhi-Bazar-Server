
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

module.exports = { verifyToken, verifyAdmin }
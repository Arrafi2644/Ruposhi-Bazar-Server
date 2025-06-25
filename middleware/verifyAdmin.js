import { userCollection } from "../config/collections.js";

export const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const user = await userCollection.findOne({ email });
    if (user?.role !== "Admin") return res.status(403).send({ message: "forbidden access" });
    next();
};


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
import { client } from "./db.js";

export const userCollection = client.db("RuposheeBazar").collection("users");
export const orderCollection = client.db("RuposheeBazar").collection("orders");
export const productsCollection = client.db("RuposheeBazar").collection("products");
export const categoriesCollection = client.db("RuposheeBazar").collection("categories");
export const cartsCollection = client.db("RuposheeBazar").collection("carts");

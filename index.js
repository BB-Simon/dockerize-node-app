import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const uri = process.env.MONGO_URL || "mongodb://admin:password@mongo:27017";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoClient = new MongoClient(uri);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "Ok",
    message: "Server is running",
  });
});

app.get("/api/v1/users", async (req, res) => {
  await mongoClient.connect();
  console.log("Connected to MongoDB");
  const db = mongoClient.db("test-user-db");
  const userCollection = db.collection("users");

  const users = await userCollection.find({}).toArray();

  mongoClient.close();

  res.status(200).json({
    status: "Ok",
    data: users,
  });
});

app.post("/api/v1/users", async (req, res) => {
  await mongoClient.connect();
  console.log("Connected to MongoDB");
  const db = mongoClient.db("test-user-db");
  const userCollection = db.collection("users");

  const user = req.body;

  console.log("Inserting user:", user);

  const result = await userCollection.insertOne(user);

  mongoClient.close();

  res.status(201).json({
    status: "Ok",
    data: result,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

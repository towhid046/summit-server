const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT | 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1nysvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Summit server is running...");
});

async function run() {
  const studentsCollection = client.db("summitDB").collection("students");
  try {
    // get all students list
    app.get("/students", async (req, res) => {
      try {
        const result = await studentsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    // get specific students by their class name:
    app.get("/students/:className", async (req, res) => {
      const studentClass = req.params?.className;
      const result = await studentsCollection.find({ studentClass }).toArray();
      if (!result) {
        return res.send({ message: "No student found in this class" });
      }
      res.send(result);
    });

    app.post("/student", async (req, res) => {
      const student = req.body;
      try {
        const result = await studentsCollection.insertOne(student);
        res.status(200).send(result);
      } catch (error) {
        res.send(error);
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Summit server is running on port: ${port}`);
});

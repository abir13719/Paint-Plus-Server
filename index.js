const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k8que7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const SliderCollection = client.db("paintPlus").collection("slider");
    const PaintCollection = client.db("paintPlus").collection("paintings");
    const FeedbackCollection = client.db("paintPlus").collection("userFeedback");

    // Read Slider Data
    app.get("/slider", async (req, res) => {
      const cursor = SliderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read Feedback Data
    app.get("/feedback", async (req, res) => {
      const cursor = FeedbackCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read All Painting Data
    app.get("/painting", async (req, res) => {
      const cursor = PaintCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read My Painting Data by Email
    app.get("/painting/:email", async (req, res) => {
      const cursor = PaintCollection.find({ email: req.params.email });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read Update Painting Data by Id
    app.get("/painting/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await PaintCollection.findOne(query);
      res.send(result);
    });

    // Create All Paint Collection
    app.post("/painting", async (req, res) => {
      const painting = req.body;
      const result = await PaintCollection.insertOne(painting);
      res.send(result);
    });

    // Update My Paint Data by Id
    app.put("/painting/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPaint = req.body;

      // //updating in database
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const newUpdatedInformations = {
        $set: {
          photoURL: updatedPaint.photoURL,
          paintName: updatedPaint.paintName,
          category: updatedPaint.category,
          rating: updatedPaint.rating,
          price: updatedPaint.price,
          customization: updatedPaint.customize,
          process: updatedPaint.pTime,
          stockStatus: updatedPaint.stock,
          email: updatedPaint.email,
          userName: updatedPaint.userName,
          description: updatedPaint.description,
        },
      };
      const result = await PaintCollection.updateOne(filter, newUpdatedInformations, option);
      res.send(result);
    });

    // Delete My Paint Data by Id
    app.delete("/painting/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await PaintCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

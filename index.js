const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Hello the app is working working!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5ktv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("Connection err", err);
  const AdminCollection = client.db("gerez").collection("admins");
  const ServiceCollection = client.db("gerez").collection("services");
  const OrderCollection = client.db("gerez").collection("orders");
  const ReviewCollection = client.db("gerez").collection("reviews");

  app.get("/isAdmin", (req, res) => {
    AdminCollection.find({ email: req.query.email }).toArray((err, docs) => {
      res.send(!!docs.length);
    });
  });

  app.get("/order", (req, res) => {
    AdminCollection.find({ email: req.query.email }).toArray((err, docs) => {
      if (docs.length) {
        OrderCollection.find().toArray((err, docs) => {
          res.send(docs);
        });
      } else {
        OrderCollection.find({ email: req.query.email }).toArray(
          (err, docs) => {
            res.send(docs);
          }
        );
      }
    });
  });

  app.get("/orders", (req, res) => {
    adminsCollection.find({ email: req.query.email }).toArray((err, docs) => {
      if (docs.length) {
        orderCollection.find({}).toArray((err, docs) => res.send(docs));
      } else {
        orderCollection
          .find({ email: req.query.email })
          .toArray((err, docs) => res.send(docs));
      }
    });
  });

  app.get("/services", (req, res) => {
    ServiceCollection.find().toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.post("/addAdmin", (req, res) => {
    AdminCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.post("/addReview", (req, res) => {
    ReviewCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.post("/addService", (req, res) => {
    ServiceCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    OrderCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.delete("/delete:id", (req, res) => {
    ServiceCollection.deleteOne({ _id: ObjectId(req.params.id) }).then(
      (result) => {
        res.send(!!result.deletedCount);
      }
    );
  });

  app.patch("/updateOrderStatus", (req, res) => {
    const { id, status } = req.body;
    console.log(req.body);
    OrderCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: { status },
      }
    ).then((result) => res.send(result.lastErrorObject.updatedExisting));
  });

  app.patch("/update:id", (req, res) => {
    ServiceCollection.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: req.body,
      }
    ).then((result) => {
      res.send(!!result.modifiedCount);
    });
  });

  app.patch("/updateReview/:id"),
    (req, res) => {
      ReviewCollection.updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          $set: req.body,
        }
      ).then((result) => {
        res.send(!!result.modifiedCount);
      });
    };

  app.delete("/deleteReview/:id", (req, res) => {
    ReviewCollection.deleteOne({ _id: ObjectId(req.params.id) }).then(
      (result) => {
        res.send(!!result.deletedCount);
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

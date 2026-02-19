import { MongoClient } from "mongodb";

let client;

export default async function handler(req, res) {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("taronDB");
    const collection = db.collection("enquiries");

    const data = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

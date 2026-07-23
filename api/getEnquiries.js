import { MongoClient, ObjectId } from "mongodb";

let client;

export default async function handler(req, res) {

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

import { MongoClient, ObjectId } from "mongodb";

let client;

export default async function handler(req, res) {

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("taronDB");
    const collection = db.collection("enquiries");

    const { id } = req.body;

    await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

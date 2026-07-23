import { MongoClient } from "mongodb";

let client;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("taronDB");
    const collection = db.collection("enquiries");

    const { name, email, message } = req.body;

    await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    return res.status(200).json({ message: "Enquiry saved successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

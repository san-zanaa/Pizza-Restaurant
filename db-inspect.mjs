import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URL?.trim()
const client = new MongoClient(uri)
await client.connect()

const col = client.db("pizzahub").collection("menuItems")
const docs = await col.find({}).sort({ name: 1 }).toArray()
for (const d of docs) {
  console.log(
    `${d._id} | ${d.name} | ${d.category} | $${d.price} | ${d.location} | ${d.vendorName}`
  )
  console.log(`    img: ${d.imageUrl}`)
}

await client.close()

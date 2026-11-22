import { MongoClient } from "mongodb"
import { randomUUID } from "node:crypto"

const uri = process.env.MONGODB_URL?.trim()
const client = new MongoClient(uri)
await client.connect()

const col = client.db("pizzahub").collection("menuItems")

// 1) Remap legacy categories onto the six required ones
const remaps = [
  ["Chicken Pizzas", "Specialty / Gourmet Pizzas"],
  ["Cheese Pizzas", "Classic Pizzas"],
]
for (const [from, to] of remaps) {
  const res = await col.updateMany({ category: from }, { $set: { category: to } })
  console.log(`remap "${from}" -> "${to}": ${res.modifiedCount} docs`)
}

// 2) Resolve vendorId for each vendorName from an existing item
const vendorIds = new Map()
for (const doc of await col.find({}, { projection: { vendorName: 1, vendorId: 1 } }).toArray()) {
  if (doc.vendorName && doc.vendorId && !vendorIds.has(doc.vendorName)) {
    vendorIds.set(doc.vendorName, doc.vendorId)
  }
}

// 3) Seed the missing food items (sides, beverages & desserts)
const seededAt = new Date(Date.now() - 36 * 3600 * 1000).toISOString() // older than featured pizzas
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`

const newItems = [
  {
    name: "Garlic Bread Sticks",
    category: "Sides & Appetizers",
    description:
      "Warm, hand-torn breadsticks brushed with garlic butter, oregano and parmesan — the perfect opener for any feast.",
    price: 299,
    location: "Dhanmondi, Dhaka",
    imageUrl: img("photo-1573080496219-bb080dd4f877"),
    vendorName: "Bottega Pizzeria",
  },
  {
    name: "Crispy Chicken Wings",
    category: "Sides & Appetizers",
    description:
      "Golden fried wings tossed in a smoky buffalo glaze, served with a cool ranch dip and crisp celery sticks.",
    price: 449,
    location: "Uttara, Dhaka",
    imageUrl: img("photo-1567620832903-9fc6debc209f"),
    vendorName: "Crust & Co.",
  },
  {
    name: "Loaded Parmesan Fries",
    category: "Sides & Appetizers",
    description:
      "Crispy golden fries showered with parmesan, herbs and a hint of chili — dangerously snackable.",
    price: 349,
    location: "Banani, Dhaka",
    imageUrl: img("photo-1626082927389-6cd097cdc6ec"),
    vendorName: "Little Oven Co.",
  },
  {
    name: "Chocolate Fudge Cake",
    category: "Beverages & Desserts",
    description:
      "Three layers of moist chocolate sponge under a glossy fudge drip and whipped cocoa cream.",
    price: 499,
    location: "Gulshan, Dhaka",
    imageUrl: img("photo-1578985545062-69928b1d9587"),
    vendorName: "The Dough Room",
  },
  {
    name: "Classic Tiramisu",
    category: "Beverages & Desserts",
    description:
      "Espresso-soaked sponge layered with silky mascarpone cream and dusted with bittersweet cocoa.",
    price: 449,
    location: "Dhanmondi, Dhaka",
    imageUrl: img("photo-1571877227200-a0d98ea607e9"),
    vendorName: "Bottega Pizzeria",
  },
  {
    name: "Mint Lime Lemonade",
    category: "Beverages & Desserts",
    description:
      "Fresh-squeezed lime, crushed mint and a splash of soda over ice — bright, zippy and refreshing.",
    price: 249,
    location: "Mohakhali, Dhaka",
    imageUrl: img("photo-1621263764928-df1444c5e859"),
    vendorName: "Little Oven Co.",
  },
]

let inserted = 0
for (const item of newItems) {
  const exists = await col.findOne({ name: item.name })
  if (exists) {
    console.log(`skip (exists): ${item.name}`)
    continue
  }
  const vendorId = vendorIds.get(item.vendorName) ?? "vendor-001"
  await col.insertOne({
    _id: randomUUID(),
    ...item,
    vendorId,
    status: "Approved",
    availability: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  })
  inserted++
  console.log(`inserted: ${item.name} (${item.category})`)
}
console.log(`new items inserted: ${inserted}`)

// 4) Final counts per category
const counts = await col
  .aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])
  .toArray()
console.log("\ncategory counts (all):")
for (const c of counts) console.log(`  ${c._id}: ${c.count}`)
const approvedActive = await col.countDocuments({ status: "Approved", availability: true })
console.log(`\ntotal docs: ${await col.countDocuments()} | approved+active: ${approvedActive}`)

await client.close()

import { writeFile, mkdir } from "node:fs/promises"

const OUT = "C:/Users/LENOVO/AppData/Local/Temp/opencode/food-imgs"
await mkdir(OUT, { recursive: true })

const candidates = [
  // sides / appetizers
  ["fries-a", "photo-1573080496219-bb080dd4f877"],
  ["wings-a", "photo-1608039829572-78524f79c4c7"],
  ["wings-b", "photo-1626082927389-6cd097cdc6ec"],
  ["nachos-a", "photo-1513456852971-30c0b8199d4d"],
  ["garlic-bread-a", "photo-1619535860434-ba1d8fa12536"],
  ["bread-b", "photo-1573140247632-f8fd74997d5c"],
  ["onion-rings-a", "photo-1639024471283-03518883512d"],
  ["wings-c", "photo-1567620832903-9fc6debc209f"],
  // desserts / beverages
  ["choc-cake-a", "photo-1578985545062-69928b1d9587"],
  ["tiramisu-a", "photo-1571877227200-a0d98ea607e9"],
  ["lemonade-a", "photo-1621263764928-df1444c5e859"],
  ["icecream-a", "photo-1563805042-7684c019e1cb"],
  ["soup-a", "photo-1547592166-23ac45744acd"],
  ["coffee-a", "photo-1509042239860-f550ce710b93"],
  ["milkshake-a", "photo-1572490122747-3968b75cc699"],
  ["brownie-a", "photo-1607920591413-4ec007e70023"],
  ["soda-a", "photo-1554866585-cd94860890b7"],
  ["juice-a", "photo-1600271886742-f44345517df7"],
  ["salad-a", "photo-1512621776951-a57141f2eefd"],
  ["calzone-a", "photo-1571997478779-2adcbbe9ab2f"],
]

const results = []
for (const [label, id] of candidates) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=60`
  try {
    const res = await fetch(url, { method: "HEAD" })
    if (res.ok) {
      const imgRes = await fetch(url)
      const buf = Buffer.from(await imgRes.arrayBuffer())
      await writeFile(`${OUT}/${label}.jpg`, buf)
      results.push([label, id, "OK", buf.length])
      console.log(`${label} (${id}) -> OK ${buf.length}b`)
    } else {
      results.push([label, id, `HTTP ${res.status}`, 0])
      console.log(`${label} (${id}) -> HTTP ${res.status}`)
    }
  } catch (e) {
    results.push([label, id, `ERR ${e.message}`, 0])
    console.log(`${label} (${id}) -> ERR ${e.message}`)
  }
}
console.log(`\nsaved to ${OUT}`)

import { drizzle } from "drizzle-orm/postgres-js"
import { category } from "./schema/schmas"
import postgres from "postgres"
import * as dotenv from "dotenv"
dotenv.config()

const categories = [
    {name: "Computer Science"},
    {name: "Fitness"},
    {name: "Music"},
    {name: "Photography"},
    {name: "Cyber Security"},
    {name: "Accounting"},
    {name: "Engineering"},
    {name: "Filming"},
]

async function main() {
    if(!process.env.DATABASE_URL){
        console.log(process.env.DATABASE_URL)
        console.log("no database url")
        return
    }
    const client = postgres(process.env.DATABASE_URL, { max: 1 })
    const db = drizzle(client)
    try {
        await db.insert(category).values(categories)
        console.log("seeding complete")
    } catch (error) {
        console.log("error seeding", error)
    } finally {
        client.end()
    }
    
}

main()
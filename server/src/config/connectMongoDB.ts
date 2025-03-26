//NodeModules
import mongoose from "mongoose"

export default async function ConnectMongoDB(): Promise<mongoose.Mongoose> {
  const mongoDBClient = await mongoose.connect(process.env.URL_MongoDB || "")
  console.log(`Connected to mongodb ${process.env.URL_MongoDB || ""}`)
  return mongoDBClient
}
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server"

let mongo: MongoMemoryServer

jest.setTimeout(60000)

beforeAll(async () => {
   mongo = await MongoMemoryServer.create({
    binary: { version: "6.0.6" }, 
  });
  const uri = mongo.getUri();
  await mongoose.connect(uri);
})

afterEach(async () => {
  await mongoose.connection.db?.dropDatabase()
})

afterAll(async () => {
  await mongoose.connection.close()
  if (mongo) {
    await mongo.stop();
  }
})

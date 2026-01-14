const uri = process.env.MONGO_URI;
const dbname = process.env.DB_NAME;

export const collections ={
    BOOKS: "books",
    USERS: "users",
};

const { MongoClient, ServerApiVersion } = require("mongodb");
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const dbConnect = (cname) => {
  return client.db(dbname).collection(cname);
};
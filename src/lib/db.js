const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const collections ={
    BOOKS: "books",
};

const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const bdConnect = (cName) =>{
    return client.db(dbName).collections(cName);
}
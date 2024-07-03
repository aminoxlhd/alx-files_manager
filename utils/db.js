import { MongoClient } from 'mongodb';

class DBClient {
  constructor () {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect((err) => {
      if (err) {
        console.error(`MongoDB connection error: ${err}`);
      } else {
        console.log('MongoDB connected');
      }
    });
  }

  isAlive () {
    return this.client.isConnected();
  }

  async nbUsers () {
    const db = this.client.db();
    const count = await db.collection('users').countDocuments();
    return count;
  }

  async nbFiles () {
    const db = this.client.db();
    const count = await db.collection('files').countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
export default dbClient;

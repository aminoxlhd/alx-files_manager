const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.once('connect', () => console.log('Connected to MongoDB'));
    this.client.once('error', (error) => console.error('Error connecting to MongoDB:', error));
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    try {
      const db = this.client.db();
      const count = await db.collection('users').countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const db = this.client.db();
      const count = await db.collection('files').countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

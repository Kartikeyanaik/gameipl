import { MongoClient, ServerApiVersion } from "mongodb";

/**
 * Validate that MongoDB URI is present and does NOT contain unconfigured template brackets like <...>.
 */
export function isValidMongoUri(u?: string): boolean {
  if (!u) return false;
  // If template brackets like <password> or <username> are still present, it's invalid
  if (u.includes("<") || u.includes(">")) return false;
  return u.startsWith("mongodb://") || u.startsWith("mongodb+srv://");
}

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

if (isValidMongoUri(uri)) {
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri!, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn("MongoDB connection failed in development:", err.message);
        throw err;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri!, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;


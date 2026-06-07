import mongoose from 'mongoose';
declare global {
  var mongooseConn:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

export default async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI)
    throw new Error('MONGODB_URI is not defined in environment variables');
  if (!global.mongooseConn) global.mongooseConn = { conn: null, promise: null };

  if (global.mongooseConn.conn) return global.mongooseConn.conn;
  if (global.mongooseConn.promise) return global.mongooseConn.promise;
  global.mongooseConn.promise = mongoose.connect(MONGODB_URI);
  global.mongooseConn.conn = await global.mongooseConn.promise;
  return global.mongooseConn;
}

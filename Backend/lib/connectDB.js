import mongoose from "mongoose"
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogweb";
        console.log('MongoDB URI:', uri);
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        });
        console.log("MongoDB connected successfully");
    } catch(err) {
        console.error("Error connecting to MongoDB:", err);
        console.log("Make sure MongoDB is running on your system");
        console.log("You can install MongoDB locally or use MongoDB Atlas");
        process.exit(1);
    }
}

 export default connectDB;
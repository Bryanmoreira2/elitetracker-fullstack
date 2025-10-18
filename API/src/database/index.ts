import mongoose from 'mongoose';

const { MONGO_URL: mongobase } = process.env;

export async function setupMongo() {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }
        console.log('🎲 Connecting to database.... ');
        await mongoose.connect(String(mongobase), {
            serverSelectionTimeoutMS: 3000,
        });

        console.log('✅Database connection established successfully!');
    } catch {
        throw new Error('❌Database not connected.❌');
    }
}

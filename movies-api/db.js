import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.localDB, {useCreateIndex: true, useNewUrlParser: true,  useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', (err) => {
    console.log(`database connection error: ${err}`);
});
db.on('disconnected', () => {
    console.log('database disconnected');
});
db.once('open', function() {
    console.log(`database connected to ${db.name} on ${db.host}`);
})
const mongoose = require("mongoose");
const Repository = require("./backend1/database/models/repoModel");
require("dotenv").config({ path: "./backend1/.env" });

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB.");
        
        const result = await Repository.deleteMany({ name: { $ne: "project-test" } });
        console.log(`Deleted ${result.deletedCount} old repositories.`);
        
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
cleanup();

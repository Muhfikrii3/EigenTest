const mongoose = require("mongoose");
const config = require("../../config/config");

const connectDB = async () => {
	try {
		await mongoose.connect(config.dbConnectionString);
		console.log("MongoDB connected successfully");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	}
};

module.exports = connectDB;

import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URL);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log("error connecting to MongoDB", err.message);
	}
};
export default connectToMongoDB;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			//Basically says this ID will be a ref from user model (LMTCGPT)
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
	},
	//CreatedAt, updatedAt field because of this field called timestamps field so comngoose will automatically create that field for us
	//So in our front-end we will do something like message.createdAt  : 15:30
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
	try {
		//Getting message from user as input
		const { message } = req.body;

		//Getting reciever id from params and renaming it
		const { id: receiverId } = req.params; // Destruction id

		//Getting senderId that is coming from request.user because we added protect route middleware
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: {
				$all: [senderId, receiverId],
			},
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		//Socket io functionality here

		// await conversation.save();
		// await newMessage.save();

		await Promise.all([conversation.save(), newMessage.save()]);
		res.status(201).json(newMessage);
	} catch (error) {
		console.log("error in sendMessage controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) return res.status(200).json([]);
		const messages = conversation.messages;

		res.status(200).json(conversation.messages);
	} catch (error) {
		console.log("error in get Message controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

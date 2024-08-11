import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		//We get input from user
		const { fullName, username, password, confirmedPassword, gender } =
			req.body;

		//we check passwords do not match
		if (password !== confirmedPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		//we check if user already exists
		const user = await User.findOne({ username });
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}
		//If user does not exist we create the user
		//Has the password here
		const salt = await bcrypt.genSalt(10);
		const hasedPassword = await bcrypt.hash(password, salt);

		// https://avatar-placeholder.iran.liara.run/

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

		//And then we create the user with all the details
		const newUser = new User({
			fullName: fullName,
			username,
			password: hasedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});
		//We saving the user to the database
		if (newUser) {
			//Generate JWT Token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullname: newUser.fullName,
				username: newUser.username,
				profile: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}
		generateTokenAndSetCookie(user._id, res);

		res.status(201).json({
			_id: user._id,
			fullname: user.fullName,
			username: user.username,
			profile: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

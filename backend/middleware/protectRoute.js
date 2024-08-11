import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unathorized no token provided" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res
				.status(401)
				.json({ error: "Unathorized Invalid token provided" });
		}
		const user = await User.findById(decoded.userId).select("-password");
		req.user = user;
		next();
	} catch (error) {
		console.log("error in protected route middle ware", error.message);
		res.send(500).json({ error: "Internal server error" });
	}
};
export default protectRoute;

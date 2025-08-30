import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const register = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        console.log(username, email, password);

        if (!username || !email || !password) return res.status(400).json({ message: "data missing" });

        // is user exist
        let user = await User.findOne({ email: email });
        if (user) return res.status(400).json({ message: "user exist" })
        let hashPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            username, email, password: hashPassword,
        });
        console.log(process.env.SECRET_KEY);
        await newUser.save();
        let token = await jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '3h' });
        if (!token) {
            return res.status(401).json({ message: "Token not provided" })
        };

        res.status(201).json({ message: "user register successfully", token: token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(404).json({ message: "missing data" });
        let user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "User Not Found" });
        const isCompare = bcrypt.compare(password, user.password);
        if (!isCompare) return res.status(401).json({ message: "password incorrect" });
        let token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "3h" });
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        };
        res.status(200).json({ message: "user login successfully", token: token, user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
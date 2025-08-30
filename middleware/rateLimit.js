import express from "express";
import { isAuth } from "../config.js";
import { rateLimitter } from "../controllers/rateLimit.js";
import countApi from "../model/rate.model.js"; // <-- you forgot to import this

const rateRouter = express.Router();

const fiveTimes = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        console.log("User ID:", userId);

        let userCount = await countApi.findOne({ userId });

        if (!userCount) {
            userCount = new countApi({ userId, count: 1 });
            await userCount.save();
            return res.status(201).json({ message: "First request recorded", count: 1 });
        }

        if (userCount.count >= 5) {
            return res.status(401).json({ message: "Limit exceeded (more than 5 requests)" });
        }

        userCount.count += 1;
        await userCount.save();

        next(); // ✅ move to next middleware (rateLimitter)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

rateRouter.get("/rateLimit", isAuth, fiveTimes, rateLimitter);

export default rateRouter;

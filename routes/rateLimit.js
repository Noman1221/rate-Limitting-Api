import express from "express";
import { isAuth } from "../config.js";
import { rateLimitter } from "../controllers/rateLimit.js";
import countApi from "../model/rate.model.js";

const rateRouter = express.Router();
const fiveTimes = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const now = new Date();

        let userCount = await countApi.findOne({ userId });

        if (!userCount) {
            userCount = new countApi({ userId, count: 1, lastRequest: now });
            await userCount.save();
            return next();
        }

        let extractTime = (now - userCount.lastRequest) / 1000;

        // reset if more than 60 seconds passed
        if (extractTime > 60) {
            userCount.count = 1;
            userCount.lastRequest = now;
            await userCount.save();
            return next();
        }

        if (userCount.count >= 5) {
            // 🔴 reset immediately after 5 requests
            userCount.count = 0;
            userCount.lastRequest = now;
            await userCount.save();
            return res.status(401).json({ message: "Limit exceeded (5 requests reached). Counter reset." });
        }

        userCount.count++;
        userCount.lastRequest = now;
        await userCount.save();

        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};






rateRouter.get("/rateLimit", isAuth, fiveTimes, rateLimitter);

export default rateRouter;

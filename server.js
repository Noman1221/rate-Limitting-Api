import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import rateRouter from "./middleware/rateLimit.js";
import userRouter from "./routes/user.route.js";
dotenv.config();
// import countApi from "./model/rate.model.js";
const app = express();


app.use(express.json());
app.use("/user", userRouter);
app.use("/user", rateRouter);
const dbUrl = "mongodb://127.0.0.1:27017/rateLimit";
async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("database connect");

}).catch(e => console.log(e));


app.listen(3000, () => {
    console.log("server work");
});

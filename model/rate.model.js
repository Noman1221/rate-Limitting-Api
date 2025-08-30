import mongoose from "mongoose";

const rateApiLimitSchemac = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    count: {
        type: Number, default: 0,
    },
    lastRequest: { type: Date, default: Date.now },
})

const countApi = mongoose.model("countApi", rateApiLimitSchemac);
export default countApi
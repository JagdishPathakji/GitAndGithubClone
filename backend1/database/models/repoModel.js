const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    s3Prefix: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Ensure a user cannot have two repos with the exact same name
repoSchema.index({ name: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model("Repository", repoSchema);

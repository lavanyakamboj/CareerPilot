const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		originalName: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		filePath: {
			type: String,
			required: true,
		},
		fileSize: {
			type: Number,
			required: true,
		},
		fileType: {
			type: String,
			required: true,
		},
		extractedText: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Resume", resumeSchema);

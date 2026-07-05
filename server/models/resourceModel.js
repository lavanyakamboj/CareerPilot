const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		platform: {
			type: String,
			trim: true,
			default: "",
		},
		link: {
			type: String,
			required: true,
			trim: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["Course", "YouTube", "Docs", "Book", "Practice", "Website"],
		},
		reason: {
			type: String,
			required: true,
			trim: true,
		},
		priority: {
			type: String,
			enum: ["High", "Medium", "Low"],
			default: "Medium",
		},
	},
	{ _id: false },
);

const resourceSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		resume: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Resume",
			required: true,
		},
		analysis: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Analysis",
			required: true,
		},
		roadmap: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CareerRoadmap",
			required: true,
		},

		courses: [itemSchema],
		youtube: [itemSchema],
		docs: [itemSchema],
		books: [itemSchema],
		practice: [itemSchema],
		sites: [itemSchema],

		plan: [
			{
				title: {
					type: String,
					required: true,
					trim: true,
				},
				duration: {
					type: String,
					trim: true,
					default: "",
				},
				priority: {
					type: String,
					enum: ["High", "Medium", "Low"],
					default: "Medium",
				},
			},
		],

		provider: {
			type: String,
			default: "Groq",
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Resource", resourceSchema);

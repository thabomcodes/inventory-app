const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true, minLength: 3, maxLength: 100 },
	description: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
	price: { type: Number, required: true },
	inStock: { type: Number, required: true },
	image: { type: Schema.Types.Mixed, required: true },
});

ItemSchema.virtual("url").get(function () {
	return `/items/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);

const Category = require("../models/category");
const Item = require("../models/item");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of items
exports.item_list = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find().sort({ name: 1 }).exec();
	res.render("item_list", {
		title: "Items",
		item_list: allItems,
	});
});

// Display detail page for specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).populate("category").exec();
	if (item === null) {
		const err = new Error("Item not found");
		err.status = 404;
		return next(err);
	}

	res.render("item_detail", {
		title: "Item Detail",
		item: item,
	});
});

// Display create item form on get
exports.item_create_get = asyncHandler(async (req, res, next) => {
	const categories = await Category.find({}, "name").sort({ name: 1 }).exec();
	res.render("item_form", {
		title: "Create Item",
		categories: categories,
	});
});

exports.item_create_post = [
	body("name")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Item name must be at least 3 characters."),
	body("description")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Item description must be at least 3 characters."),
	body("category")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Category must be specified."),
	body("price").isNumeric().withMessage("Number must be specified"),
	body("inStock").isNumeric().withMessage("Number must be specified"),
	// Process request after validation and sanitation
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		// Create Category object with escaped and trimmed data
		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			inStock: req.body.inStock,
		});

		if (!errors.isEmpty()) {
			const categories = await Category.find({}, "name")
				.sort({ name: 1 })
				.exec();

			res.render("item_form", {
				title: "Create Item",
				item: item,
				categories: categories,
				selected_category: item.category._id,
				errors: errors.array(),
			});
			return;
		} else {
			await item.save();
			res.redirect(item.url);
		}
	}),
];

// Display item delete
exports.item_delete_get = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).exec();
	if (item === null) {
		res.redirect("/items");
	}
	res.render("item_delete", {
		title: "Delete Item",
		item: item,
	});
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
	await Item.findByIdAndDelete(req.body.item_id);
	res.redirect("/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
	const [item, categories] = await Promise.all([
		Item.findById(req.params.id).exec(),
		Category.find({}, "name").sort({ name: 1 }).exec(),
	]);

	if (item === null) {
		const err = new Error("Item not found");
		err.status = 404;
		return next(err);
	}

	res.render("item_form", {
		title: "Update Item",
		item: item,
		selected_category: item.category._id,
		categories: categories,
	});
});

exports.item_update_post = [
	// Validate and sanitize fields
	body("name")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Item name must be at least 3 characters."),
	body("description")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Item description must be at least 3 characters."),
	body("category")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Category must be specified."),
	body("price").isNumeric().withMessage("Number must be specified"),
	body("inStock").isNumeric().withMessage("Number must be specified"),

	// Process request after validation and sanitation
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			inStock: req.body.inStock,
			_id: req.params.id,
		});
		const categories = await Category.find({}, "name")
			.sort({ name: 1 })
			.exec();

		if (!errors.isEmpty()) {
			res.render("item_form", {
				title: "Create Item",
				item: item,
				categories: categories,
				selected_category: item.category._id,
				errors: errors.array(),
			});
		} else {
			const updatedItem = await Item.findByIdAndUpdate(
				req.params.id,
				item,
				{}
			);
			res.redirect(updatedItem.url);
		}
	}),
];

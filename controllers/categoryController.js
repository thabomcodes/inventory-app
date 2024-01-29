const Category = require("../models/category");
const Item = require("../models/item");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of categories
exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();
	res.render("category_list", {
		title: "Category List",
		category_list: allCategories,
	});
});

// Display detail page for specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
	const [category, allItemsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).exec(),
	]);

	if (category === null) {
		const err = new Error("Category not found");
		err.status = 404;
		return next(err);
	}

	res.render("category_detail", {
		title: "Category Detail",
		category: category,
		category_items: allItemsInCategory,
	});
});

// Display create category form on get
exports.category_create_get = (req, res, next) => {
	res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
	// Validate and sanitize fields
	body("name")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Category name must be at least 3 characters"),
	body("description")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Category description must be at least 3 characters."),
	// Process request after validation and sanitation
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		// Create Category object with escaped and trimmed data
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			});
		} else {
			await category.save();
			res.redirect(category.url);
		}
	}),
];

// Display author delete
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	const [category, allItemsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).exec(),
	]);
	if (category === null) {
		res.redirect("/categories");
	}
	res.render("category_delete", {
		title: "Delete Category",
		category: category,
		category_items: allItemsInCategory,
	});
});
exports.category_delete_post = asyncHandler(async (req, res, next) => {
	const [category, allItemsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).exec(),
	]);

	if (allItemsInCategory.length > 0) {
		res.render("category_delete", {
			title: "Delete Category",
			category: category,
			category_items: allItemsInCategory,
		});
		return;
	} else {
		await Category.findByIdAndDelete(req.body.category_id);
		res.redirect("/categories");
	}
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();

	if (category === null) {
		const err = new Error("Category not found");
		err.status = 404;
		return next(err);
	}

	res.render("category_form", {
		title: "Update Category",
		category: category,
	});
});

exports.category_update_post = [
	// Validate and sanitize fields
	body("name")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Category name must be at least 3 characters"),
	body("description")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Category description must be at least 3 characters."),
	// Process request after validation and sanitation
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		// Create Category object with escaped and trimmed data
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Update Category",
				category: category,
				errors: errors.array(),
			});
		} else {
			const updatedCategory = await Category.findByIdAndUpdate(
				req.params.id,
				category,
				{}
			);
			res.redirect(updatedCategory.url);
		}
	}),
];

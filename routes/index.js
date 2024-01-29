var express = require("express");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/data/uploads/");
	},
	filename: function (req, file, cb) {
		let extArray = file.mimetype.split("/");
		let extension = extArray[extArray.length - 1];
		cb(null, uuidv4().replaceAll("-", "") + "." + extension);
	},
});

const upload = multer({ storage: storage });
var categoryController = require("../controllers/categoryController");
var itemController = require("../controllers/itemController");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Inventory App" });
});

/* ROUTES FOR CATEGORIES */
router.get("/categories", categoryController.category_list);
router.get("/categories/create", categoryController.category_create_get);
router.post("/categories/create", categoryController.category_create_post);
router.get("/categories/:id/delete", categoryController.category_delete_get);
router.post("/categories/:id/delete", categoryController.category_delete_post);
router.get("/categories/:id/update", categoryController.category_update_get);
router.post("/categories/:id/update", categoryController.category_update_post);
router.get("/categories/:id", categoryController.category_detail);

/* ROUTES FOR ITEMS */
router.get("/items", itemController.item_list);
router.get("/items/create", itemController.item_create_get);
router.post(
	"/items/create",
	upload.single("image"),
	itemController.item_create_post
);
router.get("/items/:id/delete", itemController.item_delete_get);
router.post("/items/:id/delete", itemController.item_delete_post);
router.get("/items/:id/update", itemController.item_update_get);
router.post(
	"/items/:id/update",
	upload.single("image"),
	itemController.item_update_post
);
router.get("/items/:id", itemController.item_detail);
module.exports = router;

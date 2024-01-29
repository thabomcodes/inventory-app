var express = require("express");
var router = express.Router();

var categoryController = require("../controllers/categoryController");

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

module.exports = router;

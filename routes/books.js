const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getBook);

router.post("/createBook", upload.single("file"), postsController.createBook);

router.put("/likeBook/:id", postsController.likeBook);

router.delete("/deleteBook/:id", postsController.deleteBook);

module.exports = router;

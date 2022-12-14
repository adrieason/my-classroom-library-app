const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const booksController = require("../controllers/books");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, booksController.getBook);

router.post("/createBook", upload.single("file"), booksController.createBook);

router.post("/createBookByISBN", upload.single("file"), booksController.createBookByISBN);

router.put("/likeBook/:id", booksController.likeBook);

router.put("/holdBook/:id", booksController.holdBook);

router.put("/removeHold/:id", booksController.removeHold);

router.put("/checkoutAndRemoveHold/:id", booksController.removeHold);

router.put("/checkoutBook/:id", booksController.checkoutBook);

router.put("/checkinBookRead/:id", booksController.checkinBookRead);

router.put("/checkinBookDidntRead/:id", booksController.checkinBookDidntRead);

router.delete("/deleteBook/:id", booksController.deleteBook);

module.exports = router;

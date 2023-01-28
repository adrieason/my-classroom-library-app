const cloudinary = require("../middleware/cloudinary");
const Book = require("../models/Books");
const User = require("../models/User");
var add = require('date-fns/add')
var moment = require('moment');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const books = await Book.find().sort({ createdAt: "desc" }).lean();
      const users = await User.find().sort({ booksRead: "desc" }).lean();
      //const books = await Book.find({ user: req.user.id });
      res.render("profile.ejs", { books: books, user: req.user, users: users });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
   if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      try {
        const books = await Book.find({title: regex }).sort({ checkout: "asc", title: "asc" }).lean();
        res.render("feed.ejs", { books: books, user: req.user });
      } catch (err) {
        console.log(err);
      }
    }else{
    try {
      const books = await Book.find().sort({ checkout: "asc", title: "asc" }).lean();
      res.render("feed.ejs", { books: books, user: req.user });
    } catch (err) {
      console.log(err);
    }
  }
  },  
  getAddabook: async (req, res) => {
    try {
      const books = await Book.find({ user: req.user.id });
      res.render("addabook.ejs", { books: books, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      res.render("book.ejs", { book: book, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createBook: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      //const bookUser = await User.findById(req.user.id)
      await Book.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        author: req.body.author,
        likes: 0,
        user: req.user.id,
        createdBy: req.user.userName,
        whereIsTheBook: "Bookshelf",
      });
      console.log("Book has been added!");
      res.redirect("/addabook");
    } catch (err) {
      console.log(err);
    }
  }, 
  createBookByISBN: async (req, res) => {
    try {
      let isbn = req.body.isbn
      let titleisbn
      let authorKey
      let coverisbn
      let authorisbn
      console.log(isbn)
      fetch(`https://openlibrary.org/isbn/${isbn}.json`) 
      .then(res => res.json()) // parse response as JSON
      .then(data => {
      titleisbn = data.title
      authorKey = data.authors[0].key

      coverisbn = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

      fetch(`https://openlibrary.org${authorKey}.json`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
      authorisbn = data.name
      })
    })
      // Upload image to cloudinary

      const result = await cloudinary.uploader.upload(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
      //const bookUser = await User.findById(req.user.id)
      await Book.create({
        title: titleisbn,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        author: authorisbn,
        likes: 0,
        user: req.user.id,
        createdBy: req.user.userName,
        whereIsTheBook: "Bookshelf",
      });
      console.log("Book has been added!");
      res.redirect("/addabook");
    } catch (err) {
      console.log(err);
    }
  }, 
  likeBook: async (req, res) => {
    try {
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteBook: async (req, res) => {
    try {
      // Find post by id
      let book = await Book.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(book.cloudinaryId);
      // Delete post from db
      await Book.remove({ _id: req.params.id });
      console.log("Deleted Book");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  holdBook: async (req, res) => {
    try {
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { holdBook: (req.user.userName) },
        }
      );
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  checkoutAndRemoveHold: async (req, res) => {
    try {
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pop: { holdBook: -1 },
        },
        { checkout: true, 
          whereIsTheBook: req.user.userName,
          dueDate: moment().add(14, 'days').format('dddd MMM Do') ,
          }
      );
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  removeHold: async (req, res) => {
    try {
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { holdBook: req.user.userName }, //need to change to remove just the id of the person requesting to be removed from the hold list
        },
      );
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  checkoutBook: async (req, res) => {
    try {
      //find the book from the page we are on
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        { checkout: true,
          whereIsTheBook: req.user.userName,
          dueDate: moment().add(14, 'days') ,
          //format('dddd MMM Do')
          }
      );
      console.log(req.user.userName + "Checked out the book");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },  
  checkinBookRead: async (req, res) => {
    try {
      //find the book from the page we are on
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        { checkout: false,
          whereIsTheBook: "Bookshelf",
        },
      );
      //find the  user that is logged in 
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {  $inc: { booksRead: 1 },
        },
      );
      console.log(req.user.userName + "Checked out the book");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  checkinBookDidntRead: async (req, res) => {
    try {
      //find the book from the page we are on
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        { checkout: false,
          whereIsTheBook: "Bookshelf",
        },
      );

      console.log(req.user.userName + "Checked out the book");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
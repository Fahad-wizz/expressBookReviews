const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(isValid(username)){
      return res.status(400).json({message: "User already exists"});
  }
  users.push({username:username,password:password});
  return res.status(200).json({message: "User registered successfully" , users: users});
  

} 
);

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let bookList = Object.values(books).map(book => {
    return {author: book.author, title: book.title};
  });
  return res.status(200).send(JSON.stringify(bookList, null, 2)); // Pretty print with 2 spaces
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.values(books).find((book)=>book.isbn === isbn);
  if(book){
      return res.status(200).send(JSON.stringify(book, null, 2)); // Pretty print with 2 spaces
  }
  return res.status(404).json({message: "Book not found"});

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book = Object.values(books).find((book)=>book.author === author);
  if(book){
      return res.status(200).json(book);
  }
  return res.status(404).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book = Object.values(books).find((book)=>book.title === title);
  if(book){
      return res.status(200).json(book);
  }
  return res.status(404).json({message: "Book not found"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.values(books).find((book)=>book.isbn === isbn);
  if(book){
      return res.status(200).json(book.reviews);
  }
  return res.status(404).json({message: "Book Review not found"});
});

module.exports.general = public_users;

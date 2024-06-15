const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let valid = false;
    users.forEach((user)=>{
        if(user.username === username){
            valid = true;
        }
    });
    return valid;

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let valid = false;
    users.forEach((user)=>{
        if(user.username === username && user.password === password){
            valid = true;
        }
    });
    return valid;
}

//only registered users can login
regd_users.post("/customer/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)) { // Assuming this function checks user credentials
    let token = jwt.sign({ username: username }, 'secretkey', { expiresIn: '1h' }); // Sign the token with a 1-hour expiration
    // Optionally, you can store additional user information in the token payload
    return res.status(200).json({ message: "Login Successful", token: token });
  } else {
    return res.status(401).json({ message: "Login Failed" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.username; // Extract username from session

  if (!isbn || !review) {
    return res.status(400).json({ success: 0, message: "ISBN and review are required" });
  }

  let book = books[isbn];
  if (book) {
    book.reviews[username] = review;
    return res.status(200).json({ success: 1, message: "Review added/updated successfully" });
  }
  return res.status(404).json({ success: 0, message: "Book not found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.username; // Assuming username is stored in session
  let book = books[isbn];

  if (book && book.reviews && book.reviews[username]) {
    delete book.reviews[username]; // Delete the review for the current user
    return res.status(200).json({message: "Review deleted successfully"});
  } else {
    return res.status(404).json({message: "Review not found or you do not have permission to delete this review"});
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

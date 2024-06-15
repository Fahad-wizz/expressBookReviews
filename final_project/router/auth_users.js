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
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(authenticatedUser(username,password)){
      let token = jwt.sign({username:username},'secretkey');
      return res.status(200).json({message: "Login Successful", token: token});
  }
  return res.status(401).json({message: "Login Failed"});
}
);


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books.find((book)=>book.isbn === isbn);
  if(book){
      let review = req.body.review;
      book.reviews.push(review);
      return res.status(200).json({message: "Review Added"});
  }
  return res.status(404).json({message: "Book not found"});
}
);

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

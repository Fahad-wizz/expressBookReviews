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

//Using Axios
const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data; // Returns the list of books as JSON
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error; // Optional: rethrow or handle the error
  }
}

// Example usage
async function fetchBooks() {
  try {
    const books = await getBooks();
    console.log('Books:', books);
    // Process books data here
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

fetchBooks(); // Call this function to fetch and log the books data


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

 //Using Axios
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data; // Returns the book details as JSON
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error; // Optional: rethrow or handle the error
  }
}

// Example usage
async function fetchBookByISBN(isbn) {
  try {
    const book = await getBookByISBN(isbn);
    console.log('Book by ISBN:', book);
    // Process book data here
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
  }
}

fetchBookByISBN(1); // Call this function to fetch and log the book data by ISBN
  
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

//Using Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data; // Returns the list of books by author as JSON
  } catch (error) {
    console.error('Error fetching books by author:', error);
    throw error; // Optional: rethrow or handle the error
  }
}

// Example usage
async function fetchBooksByAuthor(author) {
  try {
    const books = await getBooksByAuthor(author);
    console.log(`Books by ${author}:`, books);
    // Process books data here
  } catch (error) {
    console.error('Error fetching books by author:', error);
  }
}

const author = "Chinua Achebe"; // Replace with the author you want to fetch books for
fetchBooksByAuthor(author); // Call this function to fetch and log the books by author

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

//Using Axios

// Function to fetch book details by title using async-await
async function getBookByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data; // Assuming server returns the book details in JSON format
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Server responded with non-success status:', error.response.status);
            console.log('Response data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received from server:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error during request setup:', error.message);
        }
        throw error; // Rethrow the error for handling in the calling function
    }
}

// Example usage
async function fetchBookDetails() {
    const title = "Things Fall Apart"; // Example title
    try {
        const bookDetails = await getBookByTitle(title);
        console.log('Book details:', bookDetails);
    } catch (error) {
        console.error('Failed to fetch book details:', error);
        // Handle error gracefully (e.g., show a message to the user)
    }
}

fetchBookDetails();


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

const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(username && password)
  { 
   users.push({"username": username, "password" : password})
   return res.status(200).json({message : " User Successfully Created"})
  }
else{
  return res.status(404).json({message: "Unable to Create User"});
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify(books, null, 4))
  return res.status(300).json({message: "Yet to be implemented"});

});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000/books'); 
    res.send(JSON.stringify(response.data, null, 4)); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching the book list" });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn
  res.send(books[ISBN])

  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:3000/books/${ISBN}`); // Fetch book details by ISBN
    if (response.data) {
      res.send(response.data); // Send book details if found
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching the book details" });
  }
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;  // Get the author from request parameters
  const keys = Object.keys(books);   // Obtain all the keys from the books object
  
  const filteredBooks = [];          // Initialize an array to store the matching books
  
  // Iterate over the books and check if the author matches
  keys.forEach(key => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
          filteredBooks.push(books[key]);  // Add matching books to the array
      }
  });

  if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);  // Return matching books
  } else {
      return res.status(404).json({message: "No books found by this author"});  // Return error if no match
  }
});


// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const response = await axios.get('http://localhost:3000/books');  
    const books = response.data;  
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks); 
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching the book details" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; 
  const keys = Object.keys(books);   // Obtain all the keys from the books object
  
  const filteredBooks = [];          // Initialize an array to store the matching books
  
  // Iterate over the books and check if the author matches
  keys.forEach(key => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
          filteredBooks.push(books[key]);  // Add matching books to the array
      }
  });

  if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);  // Return matching books
  } else {
      return res.status(404).json({message: "No books found by this title"});  // Return error if no match
  }
});




// Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();  

  try {
    const response = await axios.get('http://localhost:3000/books');
    const books = response.data;  
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);  
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching the book details" });
  }
});




//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;  // Get the ISBN from request parameters

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        const reviews = books[isbn].reviews;  // Get the reviews of the book
        return res.status(200).json(reviews); // Return the reviews
    } else {
        return res.status(404).json({message: "Book with the given ISBN not found"});  // Return error if no match
    }
});

module.exports.general = public_users;

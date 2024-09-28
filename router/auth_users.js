const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

  let validUser = users.filter((user)=>{
    return user.username === username

  })
  if (validUser.length> 0){
    return true
  }else{
    false
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUser = users.filter((user)=>{
    return (user.username === username && user.password === password)

  })
  if (validUser.length> 0){
    return true
  }else{
  false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username
  const password = req.body.password

  if(!username || !password){
    return res.status(401).json({message: "Error Logging in!"})

  }
  
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
  }, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {
    accessToken, username
}
  return res.status(200).send("User successfully logged in");
  }else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
}


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username; // Get the username from the session

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // If the user has already posted a review, modify it, otherwise add a new one
  let book = books[isbn];
  book.reviews[username] = review; // Add or modify the review for this user

  return res.status(200).json({
    message: "Review added/modified successfully",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  const username = req.session.authorization.username; // Get the username from the session

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  
  let book = books[isbn];
  delete book.reviews[username] 
  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });

})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

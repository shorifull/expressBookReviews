const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Check the username already exist or not
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return new Promise((resoleve, reject) => {
    resoleve(books);
  }).then(
    (bk) => res.send(JSON.stringify(bk, null , 4)),
    (error) => res.send("denied")

  )

});


// Get the book list available in the shop using async await

public_users.get('/async', async function(req, res) {
  try {
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => { // Simulating async operation like fetching from database
        resolve(books);
      }, 1000);
    });

    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.send("denied");
  }
});




// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const ISBN = req.params.isbn;
  res.send(books[ISBN]);
 });
  



// Get book details based on ISBN using  Promise

public_users.get('/isbn/promise/:isbn', function(req, res) {
  const ISBN = req.params.isbn;

  const fetchBooksUsingPromise = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { 
        const fetchedBooks = books[isbn];
        if (fetchedBooks) {
          resolve(fetchedBooks);
        } else {
          reject(new Error('Book not found'));
        }
      }, 1000);
    });
  };

  fetchBooksUsingPromise(ISBN)
    .then((fetchedBooks) => {
      res.send(fetchedBooks);
    })
    .catch((error) => {
      res.status(404).send('Book not found');
    });
});





// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(ans);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let ans = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              ans.push(books[key]);
          }
      }
  }
  if(ans.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(ans);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});
module.exports.general = public_users;

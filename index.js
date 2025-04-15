import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
const app = express();
const port = 4000;
const filePath = './books.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const readBooks = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeBooks = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
//get request to show all books
app.get("/books",(req,res)=>{
  const books = readBooks();
  res.json(books);
})
//get request to get the unique book detail as per received id value
app.get("/books/:id",(req,res)=>{
  const books = readBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});
// post request to add new book
app.post("/books",(req,res)=>{
  const books = readBooks();
  let newId=1;
  if(books.length>0){
    newId=books[books.length-1].id+1;
  }
  
  const newBook={
    id:newId,
    title:req.body.title,
    author:req.body.author,
    ISBN:req.body.ISBN,
    genre:req.body.genre,
    availability:req.body.availability,
  };
  books.push(newBook);
  writeBooks(books)
  res.status(201).json(newBook);
});
//patch request to update a book as per received id value
app.patch("/books/:id",(req,res)=>{
  const books = readBooks();
  const book=books.find((p)=> p.id===parseInt(req.params.id));
  if(!book) return res.status(404).json({error:"Book not found"});
  if(req.body.title)  book.title=req.body.title;
  if(req.body.author) book.author=req.body.author;
  if(req.body.ISBN) book.ISBN=req.body.ISBN;
  if(req.body.genre) book.genre=req.body.genre;
  if(req.body.availability) book.availability=req.body.availability;
  writeBooks(books);
  res.json(book);
});
//delete request to delete a particular book details
app.delete("/books/:id",(req,res)=>{
  const books = readBooks();
  const searchIndex=books.findIndex((book)=> book.id===parseInt(req.params.id) );
  if(searchIndex===-1) return res.status(404).json({error:"Book not found"});
  books.splice(searchIndex,1);
  writeBooks(books);
  res.json({message:"Book deleted"});
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

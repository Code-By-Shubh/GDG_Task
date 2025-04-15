import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
const app = express();
const port = 3000;
const filePath = './books.json';
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

const readBooks = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeBooks = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get("/", async (req, res) => {
  
    const books = readBooks();
    res.render("index.ejs", { books:books });
  
});

app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Book", submit: "Add Book" });
});

app.get("/edit/:id", async (req, res) => {
  const books = readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found');
    res.render("modify.ejs", {
      heading: "Edit Book",
      submit: "Update Book",
      book: book,
    });
});

app.post("/api/books", async (req, res) => {
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
    writeBooks(books);
    res.redirect("/");
  
});

app.post("/api/books/:id", async (req, res) => {
  const books = readBooks();
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send("Book not found");
    if(req.body.title)  book.title=req.body.title;
    if(req.body.author) book.author=req.body.author;
    if(req.body.ISBN) book.ISBN=req.body.ISBN;
    if(req.body.genre) book.genre=req.body.genre;
    if(req.body.availability) book.availability=req.body.availability;
    writeBooks(books);
    res.redirect("/");
});

app.get("/api/books/delete/:id", async (req, res) => {
  const books = readBooks();
    const searchIndex=books.findIndex((book)=> book.id===parseInt(req.params.id) );
    if(searchIndex===-1) return res.status(404).json({error:"Book not found"});
    books.splice(searchIndex,1);
    writeBooks(books);
    res.redirect("/");
  
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

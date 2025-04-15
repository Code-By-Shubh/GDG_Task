import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    console.log(response);
    // console.log("hello");
    res.render("index.ejs", { books: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Book", submit: "Add Book" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Book",
      submit: "Update Book",
      book: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book" });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/books`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating book" });
  }
});

app.post("/api/books/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/books/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating book" });
  }
});

app.get("/api/books/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/books/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting book" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

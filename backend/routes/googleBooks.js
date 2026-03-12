const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  try {
    const search = req.query.q || "fiction";

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=20`
    );

    const data = await response.json();

    const books = data.items.map((item) => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Unknown",
      category: item.volumeInfo.categories?.[0] || "General",
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
      price: Math.floor(Math.random() * 500) + 200,
      stock: 10
    }));

    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

module.exports = router;    
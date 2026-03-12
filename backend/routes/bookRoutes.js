const express = require("express")
const router = express.Router()
const Book = require("../models/Book")

// GET ALL BOOKS
router.get("/", async (req,res)=>{
const books = await Book.find()
res.json({books})
})

// GET FEATURED BOOKS
router.get("/featured", async (req,res)=>{
const books = await Book.find().limit(12)
res.json({books})
})

// GET SINGLE BOOK
router.get("/:id", async (req,res)=>{
const book = await Book.findById(req.params.id)
res.json(book)
})

// CREATE BOOK (ADMIN)
router.post("/", async (req,res)=>{
const book = await Book.create(req.body)
res.json(book)
})

// UPDATE BOOK
router.put("/:id", async (req,res)=>{
const book = await Book.findByIdAndUpdate(req.params.id, req.body,{new:true})
res.json(book)
})

// DELETE BOOK
router.delete("/:id", async (req,res)=>{
await Book.findByIdAndDelete(req.params.id)
res.json({message:"Book deleted"})
})

module.exports = router
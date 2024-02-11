const mongoose = require("mongoose");


const pdfSchema = new mongoose.Schema({
    name:String,
    title: String,
    snippet: String,
    author: String,
    description: String,
    yearWritten: String,
    pages: String,
    thumbnail: {
        type: String,
        default: process.env.defaultImagePDF
    }
});

const PDF = mongoose.models.PDF || new mongoose.model("PDF",pdfSchema);

module.exports = PDF;
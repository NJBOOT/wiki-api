const mongoose = require("mongoose");

const articlesSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articlesSchema)


module.exports = Article
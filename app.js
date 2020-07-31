const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const Article = require("./WikiModel");
const PORT = 3000 || process.env.port;
const app = express();

// Middleware

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoDB connection

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    let article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save(function (err) {
      if (!err) {
        res.send("New article added successfully!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err, result) {
      if (!err) {
        res.send("Successfully deleted articles");
      } else {
        res.send(err);
      }
    });
  });
// Routes for specific article

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title.");
      }
    });
  })
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Article successfully deleted");
      } else {
        res.send(err);
      }
    });
  });

app.listen(PORT, function () {
  console.log("Server started on port: " + PORT);
});

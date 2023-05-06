const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connecting to mongooose, schema and model
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


// For all articles ----------------------------------------
app.get("/articles", async function (req, res) {
    try {
        const foundArticles = await Article.find();
        res.send(foundArticles);
    } catch (err) {
        res.status(500).send(err.message || "Something went wrong.");
    }
});

app.post("/articles", function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save();
});

app.delete("/articles", async function (req, res) {
    try {
        await Article.deleteMany();
        res.send("Successfully deleted all articles.");
    } catch (err) {
        res.status(500).send(err.message || "Something went wrong.");
    }
});



// for a specific article --------------------------------------------

app.route("/articles/:articleTitle")
    .get(async function (req, res) {
        try {
            const foundArticles = await Article.findOne(
                { title: req.params.articleTitle }
            );

            if (foundArticles) {
                res.send(foundArticles);
            } else {
                res.send("Could not find a matching article");
            }

        } catch (err) {
            res.status(500).send(err.message || "Something went wrong.");
        }
    })

    .put(async function (req, res) {
        try {
            await Article.updateOne(
                { title: req.params.articleTitle },
                { title: req.body.title, content: req.body.content }
            );
            res.send("Successfully updated article");
        } catch (err) {
            res.status(500).send(err.message || "Something went wrong.");
        }
    })

    .patch(async function (req, res) {
        try {
            await Article.updateOne(
                { title: req.params.articleTitle },
                { $set: req.body }
            );
            res.send("Successfully updated the articles.");
        } catch (err) {
            res.status(500).send(err.message || "Something went wrong.");
        }
    })

    .delete(async function (req, res) {
        try {
            await Article.deleteOne(
                { title: req.params.articleTitle }
            );
            res.send("Successfully deleted the corressponding article");
        } catch (err) {
            res.status(500).send(err.message || "Something went wrong.");
        }
    });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
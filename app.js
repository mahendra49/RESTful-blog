//require
var express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// mongoose/model here
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// restful routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//index route
app.get("/blogs", function(req, res) {

    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("error");
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});

// new route
app.get("/blogs/new", function(req, res) {

    res.render("new");
});

// create route
app.post("/blogs", function(req, res) {

    //form data to js object
    req.body.blog.body = req.sanitize(req.body.blog.body);

    //create and redirect
    Blog.create(req.body.blog, function(err, newblog) {
        if (err) {
            console.log("error in posting");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id", function(req, res) {

    Blog.findById(req.params.id, function(err, foundblog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundblog });
        }
    });
});

//edit route
app.get("/blogs/:id/edit", function(req, res) {

    Blog.findById(req.params.id, function(err, foundblog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", { blog: foundblog });
        }
    });
});

//update route
app.put("/blogs/:id", function(req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res) {

    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    })
});

app.listen(3000, () => {
    console.log("running");
});

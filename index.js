const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var today = new Date();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
mongoose.connect("mongodb+srv://shalinichabarwal:shalini03@cluster0.wdslcsh.mongodb.net/todoDB?retryWrites=true");
const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Homelist = mongoose.model("Home", Schema);

const home1 = new Homelist({
  name: "Drink water",
});
const home2 = new Homelist({
  name: "Eat food",
});
const defaultHome = [home1, home2];
const Worklist = mongoose.model("Work", Schema);
const Other = mongoose.model("Other", Schema);

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};

const date = today.toLocaleDateString("en", options);
app.get("/", function (req, res) {
  Homelist.find()
    .then(function (ress) {
      if (ress.length == 0) {
        Homelist.insertMany(defaultHome)
        .then(function () {
          console.log("Default Items added to database!");
          res.redirect("/");
        })
        res.redirect("/");
      } else {
        res.render("app.ejs", {
          title1: date,
          title2: "Home List",
          list: ress,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});
app.get("/work", function (req, res) {
  Worklist.find()
    .then(function (item) {
      if (item.length == 0) {
        Worklist.insertMany(defaultHome);
        res.redirect("/work");
      } else {
        res.render("app.ejs", {
          title1: date,
          title2: "Work List",
          list: item,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});
app.get("/other", function (req, res) {
  Other.find().then(function (item) {
    res.render("app.ejs", { title1: date, title2: "Other", list: item });
  });
});
app.post("/", function (req, res) {
  const item = req.body.list;
  const home3 = new Homelist({
    name: item,
  });
  const work3 = new Worklist({
    name: item
  });
  const other = new Other({
    name: item
  });
  if (req.body.work == "Work List") {
    work3.save();
    res.redirect("/work");
  } else if (req.body.work == "Other") {
    other.save();
    res.redirect("/other");
  } else {
    home3.save();
    res.redirect("/");
  }
});

// app.post("/work", function (req, res) {
//   const workItem = req.body.list;
//   const work3 = new Worklist({
//     name: workItem,
//   });
//   work3.save();
//   res.redirect("/work");
// });
// app.post("/other", function (req, res) {
//   const other = new Other({
//     name: req.body.list,
//   });
//   other.save();
//   res.redirect("/other");
// });
app.post("/delete", function (req, res) {
  const id = req.body.checkbox;
  if (req.body.hide == "Work List") {
    Worklist.deleteOne({ _id: id }).then(function () {
      res.redirect("/work");
    });
  } else if (req.body.hide== "Other") {
    Other.deleteOne({ _id: id }).then(function () {
      res.redirect("/other");
    });
  } else {
    Homelist.deleteOne({ _id: id }).then(function () {
      res.redirect("/");
    });
  }
});

app.listen(PORT, function () {
  console.log("Server is running on port 3000");
});

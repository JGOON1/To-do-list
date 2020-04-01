const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting to mongodb
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

//model using the schema, Item model
const Item = mongoose.model("Item", itemsSchema);

// Mongoose Document
const item1 = new Item ({
  name: "Welcome to your todo list."
});

const item2 = new Item ({
  name: "Practice coding"
});

const item3 = new Item ({
  name: "take a break"
});

const defaultItems = [item1, item2, item3];
Item.insertMany(defaultItems, function(err){
  if (err){
    console.log(err);
  } else {
    console.log("Sucessfully saved default items to database")
  }
});




// default items to begin with
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {


  
const day = date.getDate();

  res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
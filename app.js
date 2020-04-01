const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connecting to mongodb
mongoose.connect("mongodb://localhost:27017/todolistDB", { 
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

//model using the schema, Item model
const Item = mongoose.model("Item", itemsSchema);

// Mongoose Document
const item1 = new Item({
  name: "Welcome to your todo list."
});

const item2 = new Item({
  name: "Practice coding"
});

const item3 = new Item({
  name: "take a break"
});

const defaultItems = [item1, item2, item3];



// default items to begin with
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function (req, res) {

  //contain things inside Item collection
  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      //inserting item into the Item model
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Sucessfully saved default items to database")
        }
      });
      res.redirect("/");
    } else {

      res.render("list", { listTitle: "Today", newListItems: foundItems });
  }

  })

});

app.post("/", function (req, res) {


  // grabbing the new name from input
  const itemName = req.body.newItem;


// creating a new document
  const item = new Item({
    name: itemName,
  });

  item.save();
  
  res.redirect("/");

});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connecting to mongodb
mongoose.connect("mongodb+srv://admin-john:Kurohime0@cluster0-dhtgu.mongodb.net/todolistDB", {
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

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


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

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);


  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName)
      } else {

        // show exisitng list

        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  })


})


app.post("/", function (req, res) {


  // grabbing the new name from input
  const itemName = req.body.newItem;
  const listName = req.body.list;


  // creating a new document
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");

  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }


});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);


app.listen(port, function () {
  console.log("Server started successfuly");
});
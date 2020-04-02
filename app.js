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

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

// default items to begin with
const items = ["Buy Food", "Cook Food", "Eat Food"];


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

app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if (!foundList){
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName)
      } else {

        // show exisitng list
        
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })




  

})


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

app.post("/delete", function(req, res){
  const checkedItemId = req.body.id;

  Item.findOneAndDelete(checkedItemId, function(err){
    if (!err) {
      console.log("sucessfully removed");
    } 
    res.redirect("/");
  })
  
});




app.listen(3000, function () {
  console.log("Server started on port 3000");
});
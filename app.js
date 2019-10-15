//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = {
  name: String
}

const Item = mongoose.model('Item', itemsSchema);

const item_1 = new Item({
  name: 'Item_1'
});

const item_2 = new Item({
  name: 'Item_2'
});

const item_3 = new Item({
  name: 'Item_3'
});

const defaultItems = []
// item.save();

Item.insertMany(defaultItems,(err)=>{});

app.get("/", function (req, res) {

  Item.find({}, (err, items) => {
    Item.insertMany(items, (err) => {
      if (items.length === 0) {
        if(err) {
          console.log(err);
        }else{
          res.render('list',{listTitle:"Today",newListItems:items});
        }
       
      }else{
        res.render('list',{listTitle:"Today",newListItems:items});
        }
    })
    
   
  })

  //  res.render("list", {
  //     listTitle: "Today",
  //     newListItems: items
  //   });


});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const newItem = new Item ({
    name: itemName
  })

  newItem.save();

  res.redirect('/');
})

app.post('/delete', (req,res)=>{
  const itemId= req.body.checkbox;

  Item.deleteOne({_id:itemId},(err)=>{
    if(err){
      console.log(err)
    }else{
      console.log("Item deleted sucessfully")
    }
  })
  res.redirect('/')
})


 

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
})
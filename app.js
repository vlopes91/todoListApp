//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const lodash = require('lodash');

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

const listSchema = {
  name: String,
  items:[itemsSchema]
}

const List = mongoose.model("List",listSchema);

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
  const listName = req.body.list;

  const newItem = new Item ({
    name: itemName
  })

  if (listName === "Today") {
    newItem.save();
    res.redirect('/');
  }else{
   List.findOne({name:listName}, (err,results) => {
     results.items.push(newItem);
     results.save();
     res.redirect('/'+listName)
   })
    
  }

  
})

app.post('/delete', (req,res)=>{
  const itemId= req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteOne({_id:itemId},(err)=>{
      if(err){
        console.log(err)
      }else{
        console.log("Item deleted sucessfully")
      }
    })
    res.redirect('/')
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id: itemId}}},(err, results)=>{
      if (!err){
        res.redirect('/'+ listName);
      }
    })
  }

 
})

app.get("/:customListName",(req,res)=>{
  const customListName = lodash.capitalize(req.params.customListName);
  
 

  List.findOne({ name: customListName},(err,results)=>{
    if(!err) {
     
      if (!results){
        const list = new List ({
          name:customListName,
          items: defaultItems
        })
        list.save();
        res.redirect('/'+customListName);
      }else{
        res.render('list',{listTitle:results.name,newListItems:results.items});
      }
      
    }else{
      console.log(err);
      
    }
  });
 
})

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
})
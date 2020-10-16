const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const bcrypt = require("bcrypt");
// const saltRounds=10;

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret:"keyboard cat.",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-hirendra:wrong1326@cluster0.rdzm9.mongodb.net/foodproject",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set("useCreateIndex",true);

const itemsSchema ={
  name:String
};

const infoSchema = {
  name:String,
  firstname:String,
  lastname:String,
  email:String,
  phoneno:String,
  addresse:String,
  city:String,
  state:String,
  zip:String,
  orderstatus:String,
  requestername:String
};

const takeSchema = {
  name:String,
  firstname:String,
  lastname:String,
  email:String,
  phoneno:String,
  deliveryaddresse:String,
  city:String,
  state:String,
  zip:String,
  orderstatus:String,
  requestername:String
};

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(passportLocalMongoose);

const Item = mongoose.model("Item",itemsSchema);

const Info = mongoose.model("Info",infoSchema);

const Take = mongoose.model("Take",takeSchema);

const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////////////////////////// Route ///////////////////////////////////

app.get("/secrets",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/secrets",function(req,res){
  res.redirect("/");
});

////////////////////////////////////////Login////////////////////////

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/index",function(req,res){
  if(req.isAuthenticated()){
    res.render("index");
  }else{
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.post("/register",function(req,res){

  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/index");
      });
    }
  });

  // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //   const newUser = new User({
  //     email:req.body.username,
  //     password:hash
  //   });
  //   newUser.save(function(err){
  //     if(err){
  //       console.log(err);
  //     }else{
  //       res.render("index");
  //     }
  //   });
  // });
});

app.post("/login",function(req,res){

  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/index");
      });
    }
  });

  // const username = req.body.username;
  // const password = req.body.password;
  //
  // User.findOne({email:username},function(err,foundUser){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     if(foundUser){
  //       bcrypt.compare(password, foundUser.password, function(err, result) {
  //          if(result===true){
  //            res.render("index");
  //          }
  //        });
  //
  //     }
  //   }
  // });
});

/////////////////////////////////////// DonateFood ////////////////////////////////////

app.get("/donatefood",function(req,res){

    var today=new Date();

    var options ={
      weekday:"long",
      day:"numeric",
      month:"long"
    };

    var day = today.toLocaleDateString("en-US",options);

    Item.find({},function(err,foundItems){
      res.render("donatefood",{kindOfDay:"Today", newListItems:foundItems});
    });

});

app.post("/donatefood",function(req,res){
  res.redirect("/donatefood");
});

////////////////////////////////////adddonatefood////////////////////////////

app.get("/adddonatefood",function(req,res){

    var today=new Date();

    var options ={
      weekday:"long",
      day:"numeric",
      month:"long"
    };

    var day = today.toLocaleDateString("en-US",options);

    Item.find({},function(err,foundItems){
      res.render("donatefood",{kindOfDay:"Today", newListItems:foundItems});
    });
      res.redirect("/donatefood");
});

app.post("/adddonatefood",function(req,res){
  const itemName = req.body.newItem;
  const item = new Item({
    name:itemName
  });
  item.save();
  res.redirect("/adddonatefood");
});

//////////////////////////////////// donate /////////////////////////////////

app.get("/donate",function(req,res){
  res.sendFile(__dirname+"/donate.html");
});

app.post("/donate",function(req,res){

  res.sendFile(__dirname+"/donate.html");
});

/////////////////////////////////////// TakeFood /////////////////////////////////////

app.get("/takefood",function(req,res){

      var today=new Date();

      var options ={
        weekday:"long",
        day:"numeric",
        month:"long"
      };

      var day = today.toLocaleDateString("en-US",options);

      Item.find({},function(err,foundItems){
        res.render("takefood",{kindOfDay:"Today", newListItems:foundItems});
      });
  });

app.post("/takefood",function(req,res){
  res.redirect("/takefood");
});

/////////////////////////////////////// Take ////////////////////////////////////

app.get("/take",function(req,res){
  res.sendFile(__dirname+"/take.html");
});

app.post("/take",function(req,res){
  res.sendFile(__dirname+"/take.html");
});

////////////////////////////////////////// foodstorage //////////////////////////////

// app.get("/foodstorage",function(req,res){
//
//         var today=new Date();
//
//         var options ={
//           weekday:"long",
//           day:"numeric",
//           month:"long"
//         };
//
//         var day = today.toLocaleDateString("en-US",options);
//
//         Item.find({},function(err,foundItems){
//           res.render("food",{ejsorderstatus:"no"});
//         });
// });

app.post("/foodstorage",function(req,res){

  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const emaiL = req.body.email;
  const phoneNo = req.body.phoneno;
  const addResse = req.body.addresse;
  const citY = req.body.city;
  const stAte = req.body.state;
  const ziP = req.body.zip;

  const info = new Info({
    firstname:firstName,
    lastname:lastName,
    email:emaiL,
    phoneno:phoneNo,
    addresse:addResse,
    city:citY,
    state:stAte,
    zip:ziP,
    orderstatus:"no",
    requestername:""
  });
  info.save();

  res.redirect("/donatefood");


});

//////////////////////////////////// takefromstorage ////////////////////////////

app.get("/takefromstorage",function(req,res){
  Take.find({},function(err,foundItems){
    res.render("food",{ejsfirstname:foundItems,ejslastname:foundItems,ejsemail:foundItems,ejsphoneno:foundItems,ejsaddresse:foundItems,ejscity:foundItems,ejsstate:foundItems,ejszip:foundItems,ejsorderstatus:foundItems,ejsrequestername:foundItems});
  });
});


app.post("/takefromstorage",function(req,res){

const firstName = req.body.firstname;
const lastName = req.body.lastname;
const emaiL = req.body.email;
const phoneNo = req.body.phoneno;
const addResse = req.body.addresse;
const citY = req.body.city;
const stAte = req.body.state;
const ziP = req.body.zip;

const take = new Take({
  firstname:firstName,
  lastname:lastName,
  email:emaiL,
  phoneno:phoneNo,
  deliveryaddresse:addResse,
  city:citY,
  state:stAte,
  zip:ziP,
  orderstatus:"Yes",
  requestername:emaiL
});
take.save();

// app.get("/foodtake",function(req,res){
//
//   Take.find({},function(err,foundItems){
//   res.render("food",{ejsfirstname:foundItems,ejslastname:foundItems,ejsemail:foundItems,ejsphoneno:foundItems,ejsaddresse:foundItems,ejscity:foundItems,ejsstate:foundItems,ejszip:foundItems,ejsorderstatus:foundItems,ejsrequestername:foundItems});
//   });

// });

res.redirect("/food");


});

//////////////////////////////////// food ////////////////////////////////////

app.get("/food",function(req,res){
  Info.find({},function(err,foundItems){
  res.render("food",{ejsfirstname:foundItems,ejslastname:foundItems,ejsemail:foundItems,ejsphoneno:foundItems,ejsaddresse:foundItems,ejscity:foundItems,ejsstate:foundItems,ejszip:foundItems,ejsorderstatus:foundItems,ejsrequestername:foundItems});
  });

  // Take.find({},function(err,foundItems){
  // res.render("food",{ejsfirstname:foundItems,ejslastname:foundItems,ejsemail:foundItems,ejsphoneno:foundItems,ejsaddresse:foundItems,ejscity:foundItems,ejsstate:foundItems,ejszip:foundItems,ejsorderstatus:foundItems,ejsrequestername:foundItems});
  // });

});

app.post("/food",function(req,res){
  res.redirect("/food");
});

app.post("/order",function(req,res){
  res.redirect("/food");
});

/////////////////////////////////////// foodtake///////////////////////////////////

app.get("/food",function(req,res){

  Take.find({},function(err,foundItems){
  res.render("food",{ejsfirstname:foundItems,ejslastname:foundItems,ejsemail:foundItems,ejsphoneno:foundItems,ejsaddresse:foundItems,ejscity:foundItems,ejsstate:foundItems,ejszip:foundItems,ejsorderstatus:foundItems,ejsrequestername:foundItems});
  });

});

app.post("/food",function(req,res){
  res.redirect("/food");
});


///////////////////////////////////////delete////////////////////////////////////////

app.post("/delete1",function(req,res){
  const itemId = req.body.button;

  Item.findByIdAndRemove(itemId,function(err){
    if(!err){
      console.log("successfully deleted1");
      res.redirect("/donatefood");
    }
  });
});


app.post("/delete3",function(req,res){
  const itemId = req.body.button;

  Info.findByIdAndRemove(itemId,function(err){
    if(!err){
      console.log("successfully deleted3");
      res.redirect("/food");
    }
  });
});

/////////////////////////////////////// Listen ////////////////////////////////////

let port = process.env.PORT;
if (port == null || port == ""){
  port=3000;
}

app.listen(port,function(){
  console.log("server started successfully");
});

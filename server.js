var path = require('path');
const express=require('express');
const bodyParser=require('body-parser');//teaches node.js how to extract forms data
const morgan=require('morgan');//read request all made by user
const request=require('request');//fetch api from 3rd party site
const async=require('async');
const session=require('express-session');//store something short period of time
const MongoStore=require('connect-mongo')(session);//data store mongo db long term memory
const flash=require('express-flash');//render message to a user
const app=express();

const expressHbs=require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/main"),
  defaultLayout: 'layout',
  extname: 'hbs'
});

//middlewares mean allowing third party librariries and modules
app.engine('hbs',expressHbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})); //read images and everything
app.use(morgan('dev')); //report every req by user
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:"asadzaidihahahh",
  store:new MongoStore({url:'mongodb://asad:asad@ds151207.mlab.com:51207/newsletterprc'})
}));
app.use(flash());
const port=process.env.PORT||3000;

//Session=memory store,if you want to preserve the data for future user
//Data Store=mongodb

//routes
app.route('/')
  .get((req,res,next)=>{
    res.render('main/home',{message:req.flash('success')});
  })
  .post((req,res,next)=>{
    //capture user Email
  
    request({
      url:'https://us17.api.mailchimp.com/3.0/lists/f50936915b/members',
      method:'POST',
      headers:{
        'Authorization':'randomUser 3f2ed20589c8147e283fc273ede1573f-us17',
        'Content-Type':'application/json'
      },
      json:{
        'email_address':req.body.email,
        'status':'subscribed'
      }
      
    },function(err,response,body){
      if(err){
        console.log(err);
      }else{
        req.flash('success','You have submitted your email');
        res.redirect('/');
      }
    });
    
  });


app.listen(viewport,(err)=>{
  if(err){
    console.log(err);
  }else{
    console.log(`Running on port ${port}`);
  }
});
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/User');
require('dotenv').config({path:'./details.env'});
// models import here
const mongoConnect = require('./util/database').mongoConnect;

// code logic here
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req,res,next)=>{
  User.fetchAll()
  .then(users=>users[0])
  .then((singleUser)=>{
    req.user = new User(singleUser.name,singleUser.emailId, singleUser.contactNumber,singleUser.password, singleUser._id, singleUser.cart);
    next();
  })
  .catch(err=>console.log(err));
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoConnect(()=>{
  User.fetchAll().then(users=>{
    if(users.length==0){
      // user does not exist
      console.log('entered here');
      const user = new User('Jayant Singh','singhrajputjayant8@gmail.com',7999724878,'Jayant@2510',null,{items:[]});
      user.save();
    }
  })
  .then(()=>{
    console.log('SERVER STARTED SUCCESSFULLY');
    app.listen(3100);
  })
});



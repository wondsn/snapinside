const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const account = require('./model/account');
const db_url = 'mongodb://localhost/snapinside_db';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  secret: "@#@MYSIGN#@$#$",
  resave: false,
  saveUninitialized: true
}));

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log("Connected to mongod server");
});
mongoose.connect(db_url);

var router = require('./router/main')(app, account);

var server = app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const methodOverride = require('method-override');

const account = require('./model/account');
const app = express();
const db_url = 'mongodb+srv://test_username:z1x2c3a4s5d6@cluster0-rd3uc.mongodb.net/snapinside_db?retryWrites=true&w=majority';

// DB Setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log("Connected to mongod server");
});
mongoose.connect(db_url);

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  secret: "@#@MYSIGN#@$#$",
  resave: false,
  saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(logger('short'));

app.use('/', require('./router/main'));

var server = app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
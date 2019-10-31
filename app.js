const mongoose = require('./config/db');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const server = require('http').Server(app);
const port = 4000;

const ContactController = require('./controllers/ContactController');
const UserController = require('./controllers/UserController');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

ContactController(app);
UserController(app);

server.listen(port, () => {
  console.log('server is running on port', port);
});
  
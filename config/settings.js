const Users = require('../models/Users.js');
const Contacts = require('../models/Contacts.js');
const Func = require('../libs/functions.js');

jwt_key = "thisisthejsonwebtokenforthecontactmanagementapp";
email = "heywire4u@gmail.com";
password = "xxx";

module.exports = {
	jwt_secret: jwt_key,
	mailing_email: email,
	mailing_password : password,
}


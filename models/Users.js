const mongoose = require('../config/db');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    fullname: {type: String, required: true, trim: true},
    email: {type: String, required:true, lowercase: true},
    phone: {type: String, required: true},
    password: {type: String, required:true},
    activation_code: {type: String},
    created_at: {type: String, required: true},
    updated_at: {type: String, required: true},
});

var Users = mongoose.model('users', userSchema);

module.exports = Users;
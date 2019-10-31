const mongoose = require('../config/db');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    users_id: {type: String, required:true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
   	email: {type: String},
    created_at: {type: String, required: true},
    updated_at: {type: String, required: true},
});

var Crojects = mongoose.model('contacts', contactSchema);

module.exports = Crojects;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/contacts');

mongoose.connection.on('connected', () => {
    console.log('connected to mongo database');
});

module.exports = mongoose;
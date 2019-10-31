const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/contacts');
mongoose.connect('mongodb+srv://ayodele:553534123@cluster0-yhqco.mongodb.net/contacts');

mongoose.connection.on('connected', () => {
    console.log('connected to mongo database');
});

module.exports = mongoose;
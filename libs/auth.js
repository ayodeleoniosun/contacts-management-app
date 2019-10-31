const Users = require('../models/Users.js');
const Settings = require('../config/settings.js');
const jwt = require('jsonwebtoken');

isLoggedIn  = function(req, res, next) {
    
    jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret, async function(err, data) {

        if (err) return res.redirect("/");
        
        let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
        let logged_user = get_token.user;
        let user_exists = await Users.findOne({_id: logged_user}, {_id: 0, password: 0, created_at: 0, updated_at: 0});

        if (!user_exists) return res.redirect("/");
                
        return next();
    });
}

module.exports = {
    isLoggedIn: isLoggedIn
}
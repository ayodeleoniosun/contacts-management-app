const Users = require('../models/Users.js');
const Func = require('../libs/functions.js');
const Settings = require('../config/settings.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const auth = require('../libs/auth.js');

module.exports = function(app) {

    app.get('/', async function (req,res) {
        res.render('index');
    });

    app.get('/register', async function (req,res) {
        res.render('register');
    });

    app.get('/logout', auth.isLoggedIn, async function (req,res) {
        res.clearCookie('contact_app_token');
        res.redirect('/');
    });

    app.post('/api/update-profile', auth.isLoggedIn, async function (req,res) {
        
        try {
            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let { fullname, phone, email } = req.body;
            let { all_filled, email_exists, phone_exists } = false;
            
            let check_user_email = await Users.findOne({email: Func.trimString(email.toLowerCase()), "_id" : {$ne: logged_user}}, {email:1});
            let check_user_phone = await Users.findOne({phone: Func.trimString(phone), "_id" : {$ne: logged_user}}, {phone:1});

            all_filled = ( Func.trimString(fullname) == "" || Func.trimString(email) == "" || Func.trimString(phone) == "") ? false : true;
            email_exists = (check_user_email) ? true : false;
            phone_exists = (check_user_phone) ? true: false;
            
            if (!all_filled) res.status(200).send('Please fill all fields');
            
            else if(email_exists)  res.status(200).send('Email address already in use');

            else if(phone_exists) res.status(200).send('Phone number already in use');
        
            else {
                Users.findByIdAndUpdate(logged_user, {
                    $set: {
                        "fullname": Func.trimString(fullname), 
                        "phone": Func.trimString(phone),  
                        "email": Func.trimString(email)
                    }
                })
                .then( (data) => {
                    res.status(200).send('Profile updated');
                })
                .catch( (err) => {
                    res.status(500).send('error')
                });
            }
        } catch (error) {
            res.status(500).send('error');
        }
    });

    app.post ('/api/update-password', auth.isLoggedIn, async function (req,res) {
        
        try {
            
            let password_match = true;
            let { current_password, new_password, new_password_confirmation } = req.body;
            
            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let data = await Users.findOne({_id: logged_user}, {_id:0});
            let { password } = data;
            
            let passwordCheck = bcrypt.compareSync(current_password, password);
            password_match = (new_password != new_password_confirmation) ? false: true;
            
            if (!password_match) res.status(200).send('Password does not match');
            
            else if (!passwordCheck) res.status(200).send('Incorrect current password');
            
            else {
                new_password = bcrypt.hashSync(new_password,10);
                
                Users.findByIdAndUpdate(logged_user, {$set: {"password" : new_password} })
                .then( (data) => {
                    res.clearCookie('contact_app_token');
                    res.status(200).send('Password changed');
                }).
                catch( (err) => {
                    res.status(500).send('error')
                });
            }

        } catch(error) {    
            res.status(500).send('error');
        }
    
    });

    app.post ('/api/login', async function (req,res) {
        
        try {

            let { email, password } = req.body;
            let data = await Users.findOne({email: email}, {_id: 1, password: 1});

            if (!data) res.status(200).send('Incorrect login details');
            
            else {
            
                let passwordCheck = bcrypt.compareSync(password, data.password);

                if (!passwordCheck) res.status(200).send('Incorrect Password');
                 
                else {
                
                    //set jwt token
                    
                    const payload = { user: data._id };
                    const options = { 
                        expiresIn: '2d', 
                        algorithm: 'HS256' 
                    };
                    const secret = Settings.jwt_secret;
                    const token = jwt.sign(payload, secret, options);
                    res.cookie('contact_app_token', token);
                    res.status(200).send('Login successful');
                }
            }
        } catch (error) {
            res.status(500).send(error);
        }

    });

    app.post('/api/register', async function (req,res) {
        
        try {

            let { fullname, email, phone, password, password_confirmation } = req.body;
            let created_at = Func.curTimestamp();
            
            let { all_filled, email_exists, phone_exists, password_match } = false;
            
            let check_user_email = await Users.findOne({email: Func.trimString(email.toLowerCase())}, {email:1});
            let check_user_phone = await Users.findOne({phone: Func.trimString(phone)}, {phone:1});

            all_filled = ( Func.trimString(fullname) == "" || Func.trimString(email) == "" || Func.trimString(phone) == "" || password == "" || password_confirmation == "") ? false : true;
            
            password_match = (password != password_confirmation) ? false: true
            email_exists = (check_user_email) ? true : false;
            phone_exists = (check_user_phone) ? true: false;
            
            if (!all_filled) res.status(200).send('Please fill all fields');
            
            else if(!password_match)  res.status(200).send('Password does not match');

            else if(email_exists)  res.status(200).send('Email address already in use');

            else if(phone_exists) res.status(200).send('Phone number already in use');
        
            else {
                
                let data = {
                    fullname: Func.trimString(fullname), 
                    email: Func.trimString(email.toLowerCase()), 
                    phone: Func.trimString(phone),
                    password: bcrypt.hashSync(password,10),
                    created_at: created_at,
                    updated_at: created_at
                }
                
                let theUser = new Users(data);
                
                theUser.save().
                then( (data) => {

                    //set jwt token
                    const payload = { user: theUser._id };
                    const options = { 
                        expiresIn: '2d', 
                        algorithm: 'HS256' 
                    };
                    const secret = Settings.jwt_secret;
                    const token = jwt.sign(payload, secret, options);
                    res.cookie('contact_app_token', token);

                    res.status(200).send('Registration successful');
                })
                .catch( (err) => {
                    res.status(500).send('Invalid request');
                });
            }

        }  catch (error) {
            res.status(500).send('Invalid request');
        }

    });
};
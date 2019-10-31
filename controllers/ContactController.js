const Users = require('../models/Users.js');
const Settings = require('../config/settings.js');
const Contacts = require('../models/Contacts.js');
const Func = require('../libs/functions.js');
const auth = require('../libs/auth.js');
const jwt = require('jsonwebtoken');

module.exports = function(app) {

    app.get('/dashboard', auth.isLoggedIn, async function (req, res) {

        try {

            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let all_contacts = [];
            let user_data = await Users.findOne({_id: logged_user}, {_id: 0, password: 0, created_at: 0, updated_at: 0});
            let contacts = await Contacts.find({users_id: logged_user}).sort({_id:-1});
            
            for (let x in contacts) {
                
                all_contacts.push({
                    id: contacts[x]._id,
                    name: Func.capitalizeWord(contacts[x].name),
                    phone: contacts[x].phone,
                    email: contacts[x].email,
                    added_on: Func.curDate(contacts[x].created_at, "date_time"),
                });

            }

            res.render('dashboard', {
                contacts : all_contacts,
                user: user_data,
            });

        } catch (error) {
            res.status(500).send('error');
        }

    });

    app.get('/contacts', auth.isLoggedIn, async function (req, res) {

        try {

            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let all_contacts = [];
            let user_data = await Users.findOne({_id: logged_user}, {_id: 0, password: 0, created_at: 0, updated_at: 0});
            let contacts = await Contacts.find({users_id: logged_user}).sort({_id:-1});
            
            for (let x in contacts) {
                
                all_contacts.push({
                    id: contacts[x]._id,
                    name: Func.capitalizeWord(contacts[x].name),
                    phone: contacts[x].phone,
                    email: contacts[x].email,
                    added_on: Func.curDate(contacts[x].created_at, "date_time"),
                });

            }

            res.render('contacts', {
                contacts : all_contacts,
                user: user_data,
            });

        } catch (error) {
            res.status(500).send('error');
        }

    });

    app.post('/api/add-contact', auth.isLoggedIn, async function (req,res) {
        
        try {

            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let { name, phone, email } = req.body;
            
            let { all_filled, contact_name_exists, contact_phone_exists } = false;
            
            let check_contact_phone = await Contacts.findOne({phone: Func.trimString(phone), users_id: logged_user}, {phone:1});
            
            let check_contact_name = await Contacts.findOne({name: Func.trimString(name.toLowerCase()), users_id: logged_user}, {name:1});
            
            let created_at = Func.curTimestamp();
            
            all_filled = ( name == "" || phone == "") ? false : true;
            contact_name_exists = (check_contact_name) ? true : false;
            contact_phone_exists = (check_contact_phone) ? true : false;
            
            if (!all_filled) res.status(200).send('Please fill both compulsory fields');
            
            else if (contact_name_exists) res.status(200).send('Contact name exists');
            
            else if (contact_phone_exists) res.status(200).send('Phone number exists');
            
            else {
                
                let contactData = {
                    phone: Func.trimString(phone), 
                    email: Func.trimString(email),
                    name: Func.trimString(name.toLowerCase()), 
                    users_id: logged_user,
                    created_at: created_at,
                    updated_at: created_at
                }
                
                let theContact = new Contacts(contactData);
                
                theContact.save().
                then( (data) => {
                    res.status(200).send('Contact added');
                })
                .catch( (err) => {
                    res.status(500).send('error');
                });
            }
        }
        catch (error) {
            res.status(500).send(error);
        }

    });

    
    app.post('/api/update-contact', auth.isLoggedIn, async function (req,res) {

        try {

            let { contact_id, name, phone, email } = req.body;
            let updated_at = Func.curTimestamp();
            
            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let { all_filled, contact_name_exists, contact_phone_exists, isUser } = false;
            
            let check_contact_phone = await Contacts.findOne({phone: Func.trimString(phone), users_id: logged_user, "_id" : {$ne: contact_id}}, { phone:1});
            
            let check_contact_name = await Contacts.findOne({name: Func.trimString(name.toLowerCase()), users_id: logged_user,"_id" : {$ne: contact_id}}, { name:1});
            
            let contact_added_by = await Contacts.findOne({_id: contact_id}, {users_id: 1, _id: 0});
            
            contact_name_exists = (check_contact_name) ? true : false;
            contact_phone_exists = (check_contact_phone) ? true : false;
            all_filled = ( name == "" || phone == "") ? false : true;
            isUser = (contact_added_by['users_id'] == logged_user) ? true : false;
            
            if (!all_filled) res.status(200).send('Please fill both compulsory fields');
            
            else if (!isUser) res.status(200).send('Unauthorized access');
            
            else if (contact_name_exists) res.status(200).send('Contact name exists');
            
            else if (contact_phone_exists) res.status(200).send('Phone number exists');
            
            else {

                Contacts.findByIdAndUpdate(contact_id, {
                    $set: {
                        "phone" : Func.trimString(phone), 
                        "name" : Func.trimString(name.toLowerCase()), 
                        "email" : email, 
                        "updated_at" : updated_at
                    }
                })
                .then( (data) => {
                    res.status(200).send('Contact updated');
                })
                .catch( (error) => {
                    res.status(500).send('error');
                });
            
            }
        }  catch (error) {
            res.status(500).send(error);
        } 
    });

    app.get('/api/delete-contact/:contact', auth.isLoggedIn, async function (req,res) {
        
        try {

            let contact_id = req.params.contact;
            let get_token = jwt.verify(req.cookies.contact_app_token, Settings.jwt_secret);
            let logged_user = get_token.user;
            
            let { contact_exists, isUser } = false;
            
            let check_contact = await Contacts.findOne({_id: contact_id});
            let contact_added_by = await Contacts.findOne({_id: contact_id}, {users_id: 1, _id: 0});
            
            contact_exists = (check_contact) ? true : false;
            isUser = (contact_added_by['users_id'] == logged_user) ? true : false;
            
            if (!isUser) res.status(200).send('Unauthorized access');
            
            else if (!contact_exists) res.status(200).send('Contact details does not exists');
            
            else {
            
                Contacts.findOneAndDelete({_id : contact_id})
                .then( (data) => {
                    return res.redirect("/contacts");
                })
                .catch( (error) => {
                    res.status(500).send('error');
                });  
            
            }
        } catch (error) {
            res.status(500).send('Invalid request');
        } 

    });

};
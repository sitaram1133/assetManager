var express = require('express');
var router = express.Router();
//var dbConn  = require('../lib/db');
const config = require("../config/db.config");

router.get('/', function(req, res, next) {      
    config.query('SELECT * FROM users ORDER BY id desc',function(err,rows) {
        if(err) {
            req.flash('error', err);
            
            res.render('add.ejs',{data:''});   
         } else{
            // render to views/users/index.ejs
            res.render('home/add.ejs',{data:rows});
        }
    });
});


router.get('home/add.ejs', function(req, res, next) {    
    // render to add.ejs
    res.render('add.ejs', {
        prod_id: '',
        name: '',
        email: '', 
        mobileno: '',
        address:'',
        position:''
    })
})

// add a new user
router.post('home/add', function(req, res, next) {  
    let prod_id = req.params.prod_id;
    let name = req.body.name;
    let email = req.body.email;
    let mobileno = req.body.mobileno;
    let address = req.body.address;
    let position = req.body.position;
    let errors = false;
    

    if( prod_id === 0 || name.length === 0 || email.length === 0 ||  mobileno === 0 || address === 0 ||  position === 0) {
        errors = true;

        req.flash('error', "Please enter prod_id and name and email and mobileno and address and position");

        res.render('add.ejs', {
            prod_id : prod_id,
            name: name,
            email: email,
            mobileno: mobileno,
            address: address,
            position:position
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            prod_id: prod_id,
            name: name,
            email: email,
            mobileno: mobileno,
            address: address,
            position:position
        }
        
        
        config.query('INSERT INTO users SET ?', form_data, function(err, result) {
            
            if 
            (err) {
                req.flash('error', err)
                 
                
                res.render('/add.ejs', {
                    prod_id: form_data.prod_id,
                    name: form_data.name,
                    email: form_data.email,
                    mobileno: form_data.mobileno,
                    address: form_data.address,
                    position:form_data.position
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        })
    }
})


router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    config.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
      
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/users')
        }
      
        else {
           
            res.render('users/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                prod_id: rows[0].prod_id,
                name: rows[0].name,
                email: rows[0].email,
                mobileno: rows[0].mobileno,
                address: rows[0].address,
                position: rows[0].position
            })
        }
    })
})

// update user data
router.post('/update/(:id)', function(req, res, next) {

    let id = req.params.id;
    let prod_id = req.body.prod_id;
    let name = req.body.name;
    let email = req.body.email;
    let mobileno =req.body.mobileno;
    let address =req.body.address;
    let position = req.body.position;
    let errors = false;
 if( prod_id === 0 || name.length === 0 || email.length === 0 ||  mobileno.length === 0 || address ===0 || position === 0) {
        errors = true;
        req.flash('error', "Please enter prod_id and name and email  and mobileno and address and position");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            prod_id : prod_id,
            name: name,
            email: email,
            mobileno:mobileno,
            address:address,
            position:position
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            prod_id: prod_id,
            name: name,
            email: email,
            mobileno: mobileno,
            address: address,
            position:position
        }
        
        config.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
          
            if (err) {
               
                req.flash('error', err)
               
                res.render('/edit', {
                    id: req.params.id,
                    prod_id: req.params.prod_id,
                    name: form_data.name,
                    email: form_data.email,
                    mobileno: form_data.mobileno,
                    address: form_data.address,
                    position: form_data.position
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})
   
// delete user
router.get('/delete/:id', function(req, res, next) {

    let id = req.params.id;
     
    config.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
       
        if (err) {
           
            req.flash('error', err)
          
            res.redirect('/users')
        } else {
          
            req.flash('success', 'User successfully deleted! ID = ' + id)
           
            res.redirect('/users')
        }
    })
})

module.exports = router;
 
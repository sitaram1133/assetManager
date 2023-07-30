var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');


//display login page
router.get('/', function(req, res, next){    
    res.render('auth/login', {
        title: 'Login',
        mobileno: '',
        password: ''      
    })
})

//display login page
router.get('/login', function(req, res, next){    
    res.render('auth/login', {
        title: 'Login',
       mobileno: '',
        password: ''  ,
        confirmpassword:''   
    })
})


//authenticate user
router.post('/auth', function(req, res, next) {
      
    var mobileno = req.body.mobileno;
    var password = req.body.password;

       dbConn.query('SELECT * FROM users WHERE mobileno = ? AND password = ? AND confirmpassword = ? ', [mobileno, password,confirmpassword], function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Please correct enter mobileno and Password!')
                res.redirect('/login')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                req.session.loggedin = true;
                req.session.name = name;
                res.redirect('/home');

            }            
        })
 
})

//display login page
router.get('/signup', function(req, res, next){    
    res.render('auth/signup', {
        title: 'Registration Page',
     
        last_name: '',
        first_name:'',
        mobilno:'',
        password: ''  ,
        confirmpassword:''   
    })
})

// user registration
router.post('/post-signup', function(req, res, next){    
    req.assert('confirmpassword', 'confirmpassword is required').notEmpty()          
    req.assert('password', 'Password is required').notEmpty()   //Validate password
    req.assert('last_name', 'last name is required').notEmpty()  //Validate lname
    req.assert('first_name', 'first name is required').notEmpty()  //Validate fname
    req.assert('mobileno', 'mobile no is brequired 10 digit').notEmpty()  
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
    
        var user = {
            
            lname: req.sanitize('last_name').escape().trim(),
            fname: req.sanitize('first_name').escape().trim(),
            mobileno: req.sanitize('mobileno').escape().trim(),
            password: req.sanitize('password').escape().trim(),
            confirmpassword: req.sanitize('confirmpassword').escape().trim(),
        }
        
           dbConn.query('INSERT INTO users SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    res.render('auth/signup', {
                        title: 'Registration Page',
                       confirmpassword: '',
                        password: '',
                        last_name: '',
                        first_name:'',
                        mobilno:''                    
                    })
                } else {                
                    req.flash('success', 'You have successfully signup!');
                    res.redirect('/login');
                }
            })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        
        res.render('auth/signup', { 
            title: 'Registration Page',
            
            lname: req.body.last_name,
            fname:req.body.first_name,
            mobileno:req.body.mobileno,
            password: '',
            confirmpassword:''
        })
    }
})


//display home page
router.get('/home', function(req, res, next) {
    if (req.session.loggedin) {
        
        res.render('auth/home', {
            title:"Dashboard",
            name: req.session.name,     
        });

    } else {

        req.flash('success', 'Please login first!');
        res.redirect('/login');
    }
});

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
  req.flash('success', 'Login Again Here');
  res.redirect('/login');
});

module.exports = router;
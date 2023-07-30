var dbConn  = require('../lib/db');
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
    var confirmpassword =post.confirmpassword;
      var password = post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mobileno= post.mobileno;
                 
	  if(mobileno !='' && password!='') {
		  var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mobileno`, `password`,`confirmpassword`)) VALUES ('" + fname + "','" + lname + "','" + mobileno + "','" + password + "','" + confirmpassword + "')";

		  var query = dbConn.query(sql, function(err, result) {
			 message = "Your account has been created succesfully.";

			 res.render('index.ejs',{message: message}); 
		  });
	  } else {
		  message = "mobileno and password is mandatory field.";
		  res.render('signup.ejs',{message: message});
	  }

   } else {
      res.render('signup');
   }
}
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 
    
   if(req.method == "POST"){
      var post  = req.body;
      var mobileno = post.mobileno;
      var password= post.password;
      var confirmpassword =post.confirmpassword;
     
      var sql="SELECT id, first_name, last_name, mobileno FROM `users` WHERE `mobileno`='"+mobileno+"' and password = '"+password+"' and confirmpassword = '"+confirmpassword+"'";  
                               
      dbConn.query(sql, function(err, results){       
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            
            message = 'Successfully Login.';
            res.redirect('/home/dashboard');
         
         }
         
         else{
            
         message = 'You have entered invalid mobileno or password.';
            res.render('index.ejs',{message: message});
         }
      });
   } else {
      message = 'Successfully Login.';
      res.render('index.ejs',{message: message});
   }
        
};
       
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   dbConn.query(sql, function(err, results){
      res.render('dashboard.ejs', {data:results});    
   });       
};

exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   dbConn.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};

exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
 
exports.users=function(req,res){
   dbConn.query('SELECT * FROM users ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
          // render to views/users/index.ejs
          res.render('users',{data:''});   
      } else {
          // render to views/users/index.ejs
          res.render('users',{data:rows});
      }
  });
};
exports.users=function(req,res){
   router.post('views/add', function(req, res, next) {    

      let name = req.body.name;
      let email = req.body.email;
      let mobileno=req.body.mobileno
      let position = req.body.position;
      let errors = false;
  
      if(name.length === 0 || mobileno ===0|| email.length === 0 || position === 0) {
          errors = true;
  
          // set flash message
          req.flash('error', "Please enter name  and mobileno and email and position");
          // render to add.ejs with flash message
          res.render('users/add', {
              name: name,
            mobileno:mobileno,
              email: email,
              position:position
          })
      }
  
      // if no error
      if(!errors) {
  
          var form_data = {
              name: name,
              mobileno:mobileno,
              email: email,
              position:position
          }
          
          // insert query
          dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
              //if(err) throw err
              if (err) {
                  req.flash('error', err)
                   
                  // render to add.ejs
                  res.render('users/add', {
                      name: form_data.name,
                      mobileno:form_data.mobileno,
                      email: form_data.email,
                      position:form_data.position
                  })
              } else {                
                  req.flash('success', 'User successfully added');
                  res.redirect('/users');
              }
          })
      }
  })
  
  // display edit user page
  router.get('/edit/(:id)', function(req, res, next) {
  
      let id = req.params.id;
     
      dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
          if(err) throw err
           
          // if user not found
          if (rows.length <= 0) {
              req.flash('error', 'User not found with id = ' + id)
              res.redirect('/users')
          }
          // if user found
          else {
              // render to edit.ejs
              res.render('users/edit', {
                  title: 'Edit User', 
                  id: rows[0].id,
                  name: rows[0].name,
                  mobileno:rows[0].mobileno,
                  email: rows[0].email,
                  position: rows[0].position
              })
          }
      })
  })
  
  // update user data
  router.post('/update/:id', function(req, res, next) {
  
      let id = req.params.id;
      let name = req.body.name;
      let mobileno=req.body.mobileno;
      let email = req.body.email;
      let position = req.body.position;
      let errors = false;
  
      if(name.length === 0 ||  mobileno === 0 || email.length === 0 || position.length === 0) {
          errors = true;
          
          // set flash message
          req.flash('error', "Please enter name and mobileno and email and position");
          // render to add.ejs with flash message
          res.render('users/edit', {
              id: req.params.id,
              name: name,
              mobileno: mobileno,
              email: email,
              position:position
          })
      }
  
      // if no error
      if( !errors ) {   
   
          var form_data = {
              name: name,
              mobileno:mobileno,
              email: email,
              position:position
          }
          // update query
          dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
              //if(err) throw err
              if (err) {
                  // set flash message
                  req.flash('error', err)
                  // render to edit.ejs
                  res.render('users/edit', {
                      id: req.params.id,
                      name: form_data.name,
                      mobileno:form_data.mobileno,
                      email: form_data.email,
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
  router.get('/delete/(:id)', function(req, res, next) {
  
      let id = req.params.id;
       
      dbConn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
          //if(err) throw err
          if (err) {
              // set flash message
              req.flash('error', err)
              // redirect to user page
              res.redirect('/users')
          } else {
              // set flash message
              req.flash('success', 'User successfully deleted! ID = ' + id)
              // redirect to user page
              res.redirect('/users')
          }
      })
  })
  
  module.exports = router;
}


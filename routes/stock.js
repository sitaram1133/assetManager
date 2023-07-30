var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');


router.get('/', function(req, res, next) {      
   config.query('',function(err,rows) {
        if(err) {
            req.flash('error', err);
            
            res.render('views/stock.ejs',{data:''});   
           
         } else{
            // render to views/stock.ejs
            res.render('views/stock.ejs',{data:rows});
            
        }
    });
});

// display add stock page
router.get('/stock', function(req, res, next) {    
    // render to add.ejs
    
    res.render('views/stock.ejs', {
        
        prod_id: '',
        name: '',
        mobileno: '',
        item_cat : '',
     item_name : '',
     item_type :'',
     item_qty : '',
     item_status  : '',
     location  :'',
     barcode_id: '',
    min_qty : '',
     max_qty :'',
     ch_intime :'',
     ch_outtime :''
    })
})

// add a new stock
router.post('/stock', function(req, res, next) {    
    let prod_id = req.body.prod_id;
    let name = req.body.name;
   let mobileno = req.body.mobileno;
    let item_cat = req.body.item_cat;
    let item_type =req.body.item_type;
    let item_name = req.body.item_name;
     let item_qty = req.body.item_qty;
    let item_status = req.body.item_status;
    let location = req.body.location;
    let barcode_id = req.body.barcode_id;
    let min_qty = req.body.min_qty;
    let max_qty = req.body.max_qty;
    let ch_intime = req.body.ch_intime;
    let ch_outtime =req.body.ch_outtime;
    let errors = false;
    

    if( prod_id === 0 || name === 0 ||  mobileno === 0 || item_cat === 0 || item_name === 0 || item_type.length === 0 || item_qty === 0 || item_status === 0 || location === 0 || barcode_id === 0 || min_qty === 0 || max_qty === 0 || ch_intime === 0 || ch_outtime ===0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter prod_id and name and mobileno and item_category and item_name and item_type and item_qty and item_status and location and barcode_id and min_qty and max_qty and ch_intime and ch_outtime");
        // render to add.ejs with flash message
        
        res.render('stock/stock.ejs', {
           
            prod_id : prod_id,
            
             item_cat : item_cat,
     item_name : item_name,
     item_type : item_type,
     item_qty : item_qty,
     item_status  : item_status,
     location  :location,
     barcode_id: barcode_id,
     min_qty : min_qty,
     max_qty :max_qty,
     ch_intime : ch_intime,
     ch_outtime :ch_outtime,
     name: name,
     mobileno: mobileno,
            
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            prod_id: prod_id,
            name: name,
            mobileno: mobileno,
            item_cat : item_cat,
     item_name : item_name,
     item_type : item_type,
     item_qty : item_qty,
     item_status  : item_status,
     location  :location,
     barcode_id: barcode_id,
     min_qty : min_qty,
     max_qty :max_qty,
     ch_intime : ch_intime,
     ch_outtime :ch_outtime
        }
        
        // insert query
       config.query('INSERT INTO stock SET ?', form_data, function(err, result) {
         
            if 
            (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('stock/stock.ejs', {
                    prod_id: form_data.prod_id,
                    name: form_data.name,
                     mobileno: form_data.mobileno,
                     item_cat: form_data.item_cat,
                     item_name: form_data.item_name,
                     item_type: form_data.item_type,
                     
                     item_qty: form_data.item_qty,
                   item_status: form_data.item_status,
                   location: form_data.location,
                   barcode_id: form_data.barcode_id,
                    min_qty : form_data.min_qty,
                   max_qty : form_data.max_qty,
                   ch_intime : form_data.ch_intime,
                   ch_outtime : form_data.ch_outtime
                    
                })
            } else {                
                req.flash('success', 'Stock successfully added');
                res.redirect('/Stock');
                
            }
            
        })
        
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   config.query('SELECT users.users.name,users.mobileno,users.prod_id as manager,item.item_name,item.item_type,item.item_cat,item.item_item_status,item.item_qty,item.min_qty,item.max_qty,item.location,item.prod_id,item.barcode_id,item.ch_intime,item.ch_outtime as manager FROM inventory.stock INNER JOIN users on stock.prod_id=users.prod_id INNER JOIN item on stock.prod_id=item.prod_id',function(err, rows, fields) {
       
    //config.query('SELECT * FROM stock  WHERE prod_id = ' + prod_id, function(err, rows, fields) {
        if(err) throw err
         
     
        if (rows.length <= 0) {
            req.flash('error', 'Stock not found with id = ' + id)
            res.redirect('/stock')
        }
        
     
        else {
           
            res.render('stock/edit', {
                
                title: 'Edit Stock', 
                id: rows[0].id,
                prod_id: rows[0].prod_id,
                name: rows[0].name,
                mobileno: rows[0].mobileno,
                item_cat : rows[0].item_cat,
                item_name : rows[0].item_name,
                item_type : rows[0].item_type,
                item_qty : rows[0].item_qty,
                item_status  : rows[0].item_status,
                location  :rows[0].location,
                barcode_id : rows[0].barcode_id,
                 min_qty : rows[0].min_qty,
                max_qty : rows[0].max_qty,
                ch_intime : rows[0].ch_intime,
                ch_outtime : rows[0].ch_outtime
                
            })
        }
    })
})

// update user data
router.post('/update/(:id)', function(req, res, next) {

    let id = req.params.id;
    let prod_id = req.body.prod_id;
    let name = req.body.name;
   
    let mobileno =req.body.mobileno;
    let item_cat = req.body.item_cat;
    let item_name = req.body.item_name;
     let item_type= req.body.item_type;
    let item_qty = req.body.item_qty;
    let item_status = req.body.item_status;
    let location = req.body.location;
    let barcode_id = req.body.barcode_id;
    let min_qty = req.body.min_qty;
    let max_qty =req.body.max_qty;
    let ch_intime = req.body.ch_intime;
    let ch_outtime =req.body.ch_outtime;
   
    let errors = false;

    if( prod_id === 0 || name.length === 0 || mobileno === 0 || item_cat.length === 0 || item_name.length === 0 || item_desc.length === 0 || item_type.length === 0 || item_qty.length === 0 || item_status.length === 0 || location.length === 0 || barcode_id.length  === 0 || min_qty.length ===0 || max_qty.length === 0 || ch_intime.length === 0 || ch_outtime.length === 0) {
        errors = true;
        
        req.flash('error', "Please enter prod_id and name and mobileno and item_category and item_name and item_type and item_qty and item_status and location and barcode_id and min_qty and max_qty and ch_intime and ch_outtime");
       
        res.render('stock/edit', {
            id: req.params.id,
            prod_id : prod_id,
            name: name,
            mobileno:mobileno,
            item_cat : item_cat,
            item_name : item_name,
            item_type : item_type,
            item_qty : item_qty,
            item_status  : item_status,
            location  :location,
            barcode_id: barcode_id,
            min_qty : min_qty,
            max_qty :max_qty,
            ch_intime : ch_intime,
            ch_outtime :ch_outtime
            
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            prod_id: prod_id,
            name: name,
             mobileno: mobileno,
            item_cat : item_cat,
     item_name : item_name,
     item_type : item_type,
     item_qty : item_qty,
     item_status  : item_status,
     location  :location,
     barcode_id: barcode_id,
     min_qty : min_qty,
     max_qty :max_qty,
     ch_intime : ch_intime,
     ch_outtime :ch_outtime
        }
        // update query
       config.query('UPDATE stock SET ? WHERE prod_id = ' + prod_id, form_data, function(err, result) {
          
            if (err) {
               
                req.flash('error', err)
               
                res.render('stock/edit', {
                    id: req.params.id,
                    prod_id : form_data.prod_id,
                    name: form_data.name,
                    mobileno: form_data.mobileno,
                    item_cat: form_data.item_cat,
                    item_name: form_data.item_name,
                    item_type: form_data.item_type,
                    item_type : item_type,
                    item_qty: form_data.item_qty,
                  item_status: form_data.item_status,
                  location: form_data.location,
                  barcode_id: form_data.barcode_id,
                   min_qty : form_data.min_qty,
                  max_qty : form_data.max_qty,
                  ch_intime : form_data.ch_intime,
                  ch_outtime : form_data.ch_outtime
                })
            } else {
                req.flash('success', 'Stock successfully updated');
                res.redirect('/stock');
            }
        })
        
    }
})

// delete user
router.get('/delete/:id', function(req, res, next) {

    let id = req.params.id;
     
    config.query('DELETE FROM stock WHERE prod_id = ' + prod_id, function(err, result) {
       
        if (err) {
            
            req.flash('error', err)
          
            res.redirect('/stock')
            
        } else {
          
            req.flash('success', 'Stock successfully deleted! ID = ' + id)
       
            res.redirect('/stock')
        }
    })
})

module.exports = router;

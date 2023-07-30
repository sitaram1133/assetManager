var express = require('express');
var router = express.Router();

const config = require("../config/db.config");
router.get('/', function(req, res, next) {      
    config.query('SELECT * FROM item ORDER BY id desc',function(err,rows) {
        if(err) {
            rq.flash('error', err);
           
            res.render('views/additem.ejs',{data:''});   
        } else {
           
            res.render('views/additem.ejs',{data:rows});
        }
    });
});

// display add item  page
router.get('item/additem', function(req, res, next) {    
    // render to additem.ejs
    res.render('/additem.ejs', {
        id: '',
        ref_id: '', 
        prod_id:'',
        item_cat: '',
        item_name:'',
        item_desc:'',
        item_type:'',
        name_manuf:'',
        item_weight:'',
        item_delar:'',
        item_vendor:'',
        item_qty:'',
        min_qty:'',
        max_qty:'',
        item_status:'',
        location:'',
        barcode_id:'',
        nfc:'',
        ch_intime:'',
        ch_outtime:''     
    })
})

// add a new item
router.post('/item/additem', function(req, res, next) {    

    let id = req.body.id;
    let ref_id = req.body.ref_id;
    let prod_id = req.body.prod_id;
    let item_cat = req.body.item_cat;
    let item_name = req.body.item_name;
    let item_desc= req.body.item_desc;
    let item_type= req.body.item_type;
    let name_manuf = req.body.name_manuf;
    let item_weight = req.body.item_weight;
    let item_delar = req.body.item_delar;
    let item_vendor = req.body.item_vendor;
    let item_qty = req.body.item_qty;
    let item_status = req.body.item_status;
    let location = req.body.location;
    let barcode_id = req.body.barcode_id;
    let nfc = req.body.nfc;
    let min_qty = req.body.min_qty;
    let max_qty = req.body.max_qty;
    let ch_intime = req.body.ch_intime;
    let ch_outtime =req.body.ch_outtime;
let errors = false;

    if(id.length === 0 || ref_id.length === 0 || prod_id.length ===0 || item_cat === 0 || item_name === 0 || item_desc.length === 0 || item_type.length === 0 ||  name_manuf=== 0 || item_weight === 0 || item_delar === 0|| item_vendor === 0 || item_qty === 0 || item_status === 0 || location === 0 || barcode_id === 0 ||nfc === 0 || min_qty === 0 || max_qty === 0 || ch_intime === 0 || ch_outtime ===0) {
        errors = true;

        
        req.flash('error', "Please enter id and ref_id and prod_id and item_category and item_name and item_desc and item_type and name_manuf and item_weight and item_delar and item_vendor and item_qty and item_status and location and barcode_id and nfc and min_qty and max_qty and ch_intime and ch_outtime");
        
        res.render('views/additem.ejs', {
     id : id,
     prod_id: prod_id,
    ref_id : ref_id,
     item_cat : item_cat,
     item_name : item_name,
     item_desc : item_desc,
     item_type : item_type,
     name_manuf : name_manuf,
     item_weight  : item_weight,
     item_delar : item_delar,
     item_vendor :item_vendor,
     item_qty : item_qty,
     item_status  : item_status,
     location  :location,
     barcode_id: barcode_id,
     nfc : nfc,
     min_qty : min_qty,
     max_qty :max_qty,
     ch_intime : ch_intime,
     ch_outtime :ch_outtime

        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            id : id,
            ref_id : ref_id,
            prod_id: prod_id,
             item_cat : item_cat,
             item_name : item_name,
             item_desc : item_desc,
             item_type : item_type,
             name_manuf : name_manuf,
             item_weight  : item_weight,
             item_delar : item_delar,
             item_vendor :item_vendor,
             item_qty : item_qty,
             item_status  : item_status,
             location  :location,
             barcode_id : barcode_id,
             nfc : nfc,
             min_qty : min_qty,
             max_qty : max_qty,
             ch_intime : ch_intime,
             ch_outtime : ch_outtime
        
        }
        
        
        config.query('INSERT INTO item SET ?', form_data, function(err, result) {
           
            if (err) {
                req.flash('error', err)
                 
             
                res.render('views/additem.ejs', {
                    id: form_data.id,
                    ref_id: form_data.ref_id,
                    prod_id : form_data.prod_id,
                    item_cat: form_data.item_cat,
                    item_name: form_data.item_name,
                    item_desc: form_data.item_desc,
                    item_type: form_data.item_type,
                    item_type : item_type,
                   name_manuf: form_data.name_manuf,
                   item_weight: form_data.item_weight,
                   item_delar: form_data.item_delar,
                   item_vendor: form_data.item_vendor,
                  item_qty: form_data.item_qty,
                  item_status: form_data.item_status,
                  location: form_data.location,
                  barcode_id: form_data.barcode_id,
                  nfc : form_data.nfc,
                  min_qty : form_data.min_qty,
                  max_qty : form_data.max_qty,
                  ch_intime : form_data.ch_intime,
                  ch_outtime : form_data.ch_outtime
        
                    
                })
            } else {                
                req.flash('success', 'Item successfully added');
                res.redirect('/item');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
   config.query('SELECT * FROM item WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if item not found
        if (rows.length <= 0) {
            req.flash('error', 'Item not found with id = ' + id)
            res.redirect('/item')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('item/edititem', {
                title: 'Edit item', 
                id: rows[0].id,
                ref_id :rows[0]. ref_id,
                prod_id : rows[0].prod_id,
             item_cat : rows[0].item_cat,
             item_name : rows[0].item_name,
             item_desc : rows[0].item_desc,
             item_type : rows[0].item_type,
             name_manuf : rows[0].name_manuf,
             item_weight  : rows[0].item_weight,
             item_delar : rows[0].item_delar,
             item_vendor :rows[0].item_vendor,
             item_qty : rows[0].item_qty,
             item_status  : rows[0].item_status,
             location  :rows[0].location,
             barcode_id : rows[0].barcode_id,
             nfc : rows[0].nfc,
             min_qty : rows[0].min_qty,
             max_qty : rows[0].max_qty,
             ch_intime : rows[0].ch_intime,
             ch_outtime : rows[0].ch_outtime
            })
        }
    })
})
// update item data
router.post('/update/(:id)', function(req, res, next) {

    let id = req.params.id;
    let ref_id = req.body.ref_id;
    let prod_id = req.body.prod_id;
    let item_cat = req.body.item_cat;
    let item_name = req.body.item_name;
    let item_desc= req.body.item_desc;
    let item_type= req.body.item_type;
    let name_manuf = req.body.name_manuf;
    let item_weight = req.body.item_weight;
    let item_delar = req.body.item_delar;
    let item_vendor = req.body.item_vendor;
    let item_qty = req.body.item_qty;
    let item_status = req.body.item_status;
    let location = req.body.location;
    let barcode_id = req.body.barcode_id;
    let nfc = req.body.nfc;
    let min_qty = req.body.min_qty;
    let max_qty =req.body.max_qty;
    let ch_intime = req.body.ch_intime;
    let ch_outtime =req.body.ch_outtime;
   
    let errors = false;
    if(id.length === 0 || ref_id.length === 0 || prod_id.length === 0 ||  item_cat.length === 0 || item_name.length === 0 || item_desc.length === 0 || item_type.length === 0 ||  name_manuf.length === 0 || item_weight.length === 0 || item_delar.length === 0|| item_vendor.length === 0 || item_qty.length === 0 || item_status.length === 0 || location.length === 0 || barcode_id.length  === 0 || nfc.length ===0 || min_qty.length ===0 || max_qty.length === 0 || ch_intime.length === 0 || ch_outtime.length === 0) {
        errors = true;
        
        req.flash('error', "Please enter id and ref_id and prod_id and item_category and item_name and item_desc and item_type and name_manuf and item_weight and item_delar and item_vendor and item_qty and item_status and location and barcode_id and nfc and min_qty and max_qty and ch_intime and ch_outtime");
        
      
        res.render('item/edit', {
            id: req.params.id,
            ref_id : ref_id,
            prod_id : prod_id,
     item_cat : item_cat,
     item_name : item_name,
     item_desc : item_desc,
     item_type : item_type,
     name_manuf : name_manuf,
     item_weight  : item_weight,
     item_delar : item_delar,
     item_vendor :item_vendor,
     item_qty : item_qty,
     item_status  : item_status,
     location  :location,
     barcode_id : barcode_id,
     nfc :nfc,
     min_qty : min_qty,
     max_qty : max_qty,
     ch_intime : ch_intime,
     ch_outtime : ch_outtime
           
        })

    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            id : id,
            ref_id : ref_id,
            prod_id : prod_id,
     item_cat : item_cat,
     item_name : item_name,
     item_desc : item_desc,
     item_type : item_type,
     name_manuf : name_manuf,
     item_weight  : item_weight,
     item_delar : item_delar,
     item_vendor :item_vendor,
     item_qty : item_qty,
     item_status  : item_status,
     location  :location,
     barcode_id :barcode_id,
     nfc :nfc,
     min_qty : min_qty ,
     max_qty : max_qty,
     ch_intime : ch_intime,
     ch_outtime : ch_outtime
        }
        // update query
       config.query('UPDATE item SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('item/edititem', {
                    id: req.params.id,
                    ref_id: form_data.ref_id,
                    prod_id : form_data.prod_id,
                    item_cat: form_data.item_cat,
                    item_name: form_data.item_name,
                    item_desc: form_data.item_desc,
                    item_type: form_data.item_type,
                    item_type : item_type,
                   name_manuf: form_data.name_manuf,
                   item_weight: form_data.item_weight,
                   item_delar: form_data.item_delar,
                   item_vendor: form_data.item_vendor,
                  item_qty: form_data.item_qty,
                  item_status: form_data.item_status,
                  location: form_data.location,
                  barcode_id: form_data.barcode_id,
                  nfc : form_data.nfc,
                  min_qty : form_data.min_qty,
                  max_qty : form_data.max_qty,
                  ch_intime : form_data.ch_intime,
                  ch_outtime : form_data.ch_outtime
                })
            } else {
                req.flash('success', 'item successfully updated');
                res.redirect('/item');
            }
        })
    }
})

// delete item
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    config.query('DELETE FROM item WHERE id = ' + id, function(err, result) {
       
        if (err) {
            
            req.flash('error', err)
          
            res.redirect('/item')
        } else {
           
            req.flash('success', 'item successfully deleted! ID = ' + id)
           
            res.redirect('/item')
        }
    })
})

module.exports = router;

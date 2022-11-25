const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const Company = db.companies;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const uploadFile = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addnewcompany',ensureAuthenticated,async function(req,res){

 
    res.render('addnewcompany',{
       
    });
});

router.get('/allcompanylist',ensureAuthenticated,async function(req,res){
    const companylist = await Company.findAll({});
    res.render('allcompanylist',{
       companylist:companylist
    });
})
router.post('/addnewcompany',ensureAuthenticated,async function(req,res){

    const {companyname,region,woredakebele,zonesubcity,hno,phoneone,phonetwo,email,website,visitinginfo,
        placementinfo,generalinfo,contactname,contactphone,postalcode,noofemployee,businesscategory,
        fairlabourscore,istherefairlabour} = req.body;
let errors = [];
if(!req.file){
    console.log("No File!")
        }
if(companyname){
errors.push({msg:'please enter all the required fields'})
}
if(errors.length >0){
res.render('addnewcompany',{
    error_msg:'Please enter all the required fields'
})
}
const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  compid = uuidv4(v1options);
const companyData = {
    company_id: compid,
    company_name:companyname,
    business_category: businesscategory,
    contact_person_jbs: contactname,
    number_of_employee: noofemployee,
    region:region,
    woreda:woredakebele,
    zone: zonesubcity,
    hno: hno,
    contact_person_phone: contactphone,
    office_phone:phoneone,
    general_info:generalinfo,
    postal_code:postalcode,
    email:email,
    website:website,
    visiting_info:visitinginfo,
    placement_info:placementinfo,
    is_fair_labour_condition:istherefairlabour,
    fair_labour_score:fairlabourscore



}

Company.findAll({where:{company_name:companyname}}).then(staff =>{
if(staff){
    res.render('addnewcompany',{error_msg:'Error company with this name already registered!'
})
}

Company.create(companyData).then((company)=>{
if(!company){

}
  res.render('addnewcompany',{success_msg:'Successfully registered new company info'

})
}).catch(error =>{
    console.log(error)
})

}).catch(error =>{
    console.log(error)
})


});


module.exports = router;

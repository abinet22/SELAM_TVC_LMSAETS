const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const StaffList = db.stafflists;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');

const uploadFile = require('../middleware/upload.js');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addnewstaff',ensureAuthenticated,async function(req,res){

    const department = await Department.findAll({});
    res.render('addnewstaff',{
        department:department
    });
});

router.get('/allstafflist',ensureAuthenticated,async function(req,res){
    const staff = await StaffList.findAll({});
    res.render('allstafflist',{
       stafflist:staff
    });
})
router.post('/addnewstaffmember',uploadFile.single('staffphoto'),ensureAuthenticated,async function(req,res){

const{staffid,firstname,middlename,lastname,phoneNumber_1,phoneNumber_2,isteacherradio,region,zonesubcity,woredakebele,hno} =req.body;
let errors = [];
if(!req.file){
    console.log("No File!")
        }
if(!staffid || !firstname || !middlename || !lastname || !phoneNumber_1 || !phoneNumber_2 || !isteacherradio || !region || !zonesubcity || !woredakebele || !hno){
errors.push({msg:'please enter all the required fields'})
}
if(errors.length >0){
res.render('/addnewstaff',{
    error_msg:'Please enter all the required fields'
})
}

const staffData = {
    staff_id: staffid,
    staff_f_name: firstname,
    staff_m_name: middlename,
    staff_l_name: lastname,
    region:region,
    woreda: woredakebele,
    zone: zonesubcity,
    hno: hno,
    mobileno: phoneNumber_1,
    photo_name:req.file.filename,
    photo_type:req.file.mimetype,
    photo_data:fs.readFileSync(
        path.join(__dirname,'../public/uploads/') + req.file.filename
      ),
    isteacher:isteacherradio

}

StaffList.findAll({where:{staff_id:staffid}}).then(staff =>{
if(staff){
    res.render('addnewstaff',{error_msg:'Error staff memeber with this id already registered!'
})
}

StaffList.create(staffData).then((staff)=>{
    fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ staff.photo_name,
   
    staff.photo_data
  );
  res.render('addnewstaff',{success_msg:'Successfully registered new staff member'

})
}).catch(error =>{
    console.log(error)
})

}).catch(error =>{
    console.log(error)
})


});

module.exports = router;
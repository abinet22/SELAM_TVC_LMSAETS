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
    const [staff, metangobaseddata] = await sequelize.query(
        "SELECT * FROM stafflists INNER JOIN users ON users.fullname = stafflists.staff_id "
      );
    res.render('allstafflist',{
       stafflist:staff
    });
})
router.post('/addnewstaffmember',uploadFile.single('staffphoto'),ensureAuthenticated,async function(req,res){

const{staffid,firstname,middlename,lastname,phoneNumber_1,phoneNumber_2,isteacherradio,region,zonesubcity,woredakebele,hno} =req.body;
let errors = [];
if(!req.file){
    errors.push({msg:'Please Add Staff Member Photo'})
 }
if(!staffid || !firstname || !middlename || !lastname || !phoneNumber_1 || !isteacherradio || !region || !zonesubcity || !woredakebele || !hno){
errors.push({msg:'Please Enter All Required Fields'})
}
if(region =="0"){
    errors.push({msg:'Please Select Region'})
}
if(errors.length >0){
res.render('addnewstaff',{
    errors
})
}
else{
if(isteacherradio == "Yes"){
    const v1options = {
        node: [0x01, 0x23],
        clockseq: 0x1234,
        msecs: new Date('2011-11-01').getTime(),
        nsecs: 5678,
      };
      stfid = uuidv4(v1options);
    const staffData = {
        staff_id: stfid,
        staff_collage_id:staffid,
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
    
    StaffList.findOne({where:{staff_id:staffid}}).then(staff =>{
    if(staff){
        res.render('addnewstaff',{error_msg:'Error staff memeber with this id already registered!'
    })
    }
    
    StaffList.create(staffData).then((staff)=>{
        fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ staff.photo_name,
       
        staff.photo_data
      );
      
     const password = "123";
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
        var  newpassword = hash;
        const userData ={
      
            userid: stfid,
            username: staffid,
            password: newpassword,
            userroll:"Teacher",
            isactive: "Yes",
            fullname: stfid,
            department:""
       
        }

    User.create(userData).then(user =>{
       if(!user){
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
        
        })
       }
        res.render('addnewstaff',{  

            success_msg:'Your Are Successfully Registered Teaching Staff With Credentials',
         
        })
    }).catch(error =>{
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
          
        })
    })
        })
      })
    }).catch(error =>{
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
          
        })
    })
    
    }).catch(error =>{
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
          
        })
    })
    
}
else{
    const v1options = {
        node: [0x01, 0x23],
        clockseq: 0x1234,
        msecs: new Date('2011-11-01').getTime(),
        nsecs: 5678,
      };
      stfid = uuidv4(v1options);
    const staffData = {
        staff_id: stfid,
        staff_collage_id:staffid,
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
    
    StaffList.findOne({where:{staff_id:staffid}}).then(staff =>{
    if(staff){
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
          
        })
    }
    
    StaffList.create(staffData).then((staff)=>{
        fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ staff.photo_name,
       
        staff.photo_data
      );
      res.render('addnewstaff',{success_msg:'Successfully Registered New Staff Member'
    
    })
    }).catch(error =>{
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
          
        })
    })
    
    }).catch(error =>{
        res.render('addnewstaff',{
          
            error_msg:'Something Is Wrong While Saving Sata Please Try Later',
          
        })
    })
    
}

}
});
router.post('/updatestaffinfo/(:staffid)',ensureAuthenticated,async function(req,res){
    const {updateoption,updatevalue} = req.body;
    const [staff, metangobaseddata] = await sequelize.query(
        "SELECT * FROM stafflists INNER JOIN users ON users.fullname = stafflists.staff_id "
      );
    let errors =[];

    if(updateoption=="0"){
        errors.push({msg:'Please Select Update Option'})
    }
    if(!updatevalue){
        errors.push({msg:'Please Add Update Values'})
    }
        if(errors.length>0){
            res.render('allstafflist',{
                stafflist:staff,
                errors
            });
        }
        else{
        if(updateoption ==="phone"){
        StaffList.findOne({where:{staff_id:req.params.staffid}}).then(staff =>{
            if(staff){
         StaffList.update({phoneNumber_1:updatevalue},{where:{staff_id:req.params.staffid}}).then(()=>{
            res.render('allstafflist',{
                stafflist:staff,
                success_msg:"Successfully Update Staff Member Info"
            });
         }).catch(err =>{
            res.render('allstafflist',{
                stafflist:staff,
                error_msg:"Error While Updateing Staff Member Info Please Try Later"
            });
         })
            }
            else{
                res.render('allstafflist',{
                    stafflist:staff,
                    error_msg:"Cant Find Staff Member Please Try Later"
                });
            }
        }).catch(err =>{
            res.render('allstafflist',{
                stafflist:staff,
                error_msg:"Error While Finding Staff Member Please Try Later"
            });
        })
        }

        }
    res.render('allstafflist',{
       stafflist:staff
    });
})
router.post('/removestaff/(:staffid)',ensureAuthenticated,async function(req,res){
    const [staff, metangobaseddata] = await sequelize.query(
        "SELECT * FROM stafflists INNER JOIN users ON users.fullname = stafflists.staff_id "
      );
  
    StaffList.findOne({where:{staff_id:req.params.staffid}}).then(stafflist =>{
        if(stafflist){
       StaffList.destroy({where:{staff_id:req.params.staffid}}).then(()=>{
        res.render('allstafflist',{
            stafflist:staff,
            success_msg:'Successfully Remove Staff Member Data'
         });
       }).catch(err =>{
        res.render('allstafflist',{
            stafflist:staff,
            error_msg:'Cant Find Staff Memeber With This ID'
         });
       })
        }else{
            res.render('allstafflist',{
                stafflist:staff,
                error_msg:'Cant Find Staff Memeber With This ID'
             });
        }
    }).catch(err =>{
        res.render('allstafflist',{
            stafflist:staff,
            error_msg:'Cant Find Staff Memeber With This ID'
         }); 
    })
})
module.exports = router;
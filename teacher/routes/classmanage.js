const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Batch = db.batches;
const ClassInDept = db.classindepts;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addnewclass',ensureAuthenticated, async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
    const department = await Department.findAll({});
    res.render('addnewclass',{
        department:department,
        levelbased:levelbased,
        ngobased:ngobased
    })

})

router.post('/addnewclasslevelbased',ensureAuthenticated,async function(req,res){
    const{batchid,programtype,deptid,level,criteriango} = req.body;
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
    const department = await Department.findAll({});
    console.log (criteriango);
    let errors = [];
    if(batchid =="0" || programtype =="0" || deptid=="0" ||level=="0"){
  errors.push({msg:'please select required fileds'})
    }
    if(errors.length >0 ){
        res.render('addnewclass',{
            department:department,
            levelbased:levelbased,
            ngobased:ngobased,
            error_msg:'Please select all required fields'
        })
    }
    else{
        var classname = JSON.parse(criteriango)
        if(criteriango.length >0){
          for(var i = 0; i < classname.length ; i++)
          {
            const v1options = {
              node: [0x01, 0x23],
              clockseq: 0x1234,
              msecs: new Date('2011-11-01').getTime(),
              nsecs: 5678,
            };
            classid = uuidv4(v1options);
            var clsnm = classname[i];
            var classData = {
                class_id:classid,
                batch_id:batchid,
                training_type:programtype,
                training_level:level,
                department_id:deptid,
                class_name:clsnm};
         
            ClassInDept.create(classData).then(classdt =>{
                if(!classdt){
    
                }
            }).catch(error =>{
    
            })
      
      
          }
          
          res.render('addnewclass',{
            department:department,
            levelbased:levelbased,
            ngobased:ngobased,
            success_msg:'You are successfully create new classes'
        })
        }
        else{
            res.render('addnewclass',{
                department:department,
                levelbased:levelbased,
                ngobased:ngobased,
                error_msg:'Please create class names before submit the form'
            })
        }
    }
   
  
})
router.get('/searchclasswithbatch',ensureAuthenticated,async function(req,res){
  const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
    );
    const [industrybased, metaindustrybaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
    );
      res.render('selectprogramtofindclass',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased
  });
});
router.get('/allclasslist',ensureAuthenticated,async function(req,res){
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts INNER JOIN departments ON departments.department_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"
      );
      const batches = await Batch.findAll({});
      const department = await Department.findAll({});
      res.render('allclasslist',{
          classlist:classlist,
          department:department,
          batches:batches
      })
});
router.post('/filterclasslistbydepartmentandbatch',ensureAuthenticated,async function(req,res){
 
    const {batch,dept} = req.body;
    const batches = await Batch.findAll({});
    const department = await Department.findAll({});
    const [results, metadata] = await sequelize.query(
      "SELECT classindepts.class_name,classindepts.department_id,classindepts.batch_id,classindepts.training_level,classindepts.class_id,classindepts.training_type FROM  courseteacherclasses "+
      "INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' "
    );    
      res.render('allclasslist',{
        classlist:results,
        department:department,
        batches:batches
    })
});
module.exports = router;
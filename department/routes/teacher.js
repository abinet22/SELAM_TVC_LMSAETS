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
const CourseTeacherClass = db.courseteacherclasses;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Batch = db.batches;
const ClassInDept = db.classindepts;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const StaffList = db.stafflists;

router.get('/assignclassrepresentative',ensureAuthenticated, async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [industrybased, metaindustrybaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
    res.render('assignclassrepresentative',{
 
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased
    })

})
router.get('/assigncoursetoteacher',ensureAuthenticated,async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [industrybased, metaindustrybaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
    res.render('assigncoursetoteacher',{
     
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased
    })
})
router.post('/coursetoteacherlevelbased',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidlevel,
                              department_id: req.user.department,
                              training_level:traininglevel,
                              training_type:programtype}})
        const courselist = await Course.findAll({where:{
                          
                            department_id: req.user.department,
                            training_level:traininglevel }})

  res.render('courseteacher',{
   programid:programidlevel,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist
  }) 
})

router.post('/assignclassrepresentativelevel',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidlevel,
                              department_id: req.user.department,
                              training_level:traininglevel,
                              training_type:programtype}})
       

  res.render('classrepresentative',{
   programid:programidlevel,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,

  }) 
})

router.post('/saveclassteachercourse',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  console.log(copyItems);
    if(copyItems.length >0)
    {
      console.log("xnnnnnnnnnnnnnnnnnnnnnnnn");
  copyItems.forEach((item) => {
     var classid = item.class;
     var courseid = item.course;
     var teacherid = item.teacher;
     var batchid = item.batch;
     var level = item.level;
     var programtype = item.programtype;
     var dpt = req.user.department;
     
     const courseteachercomData = {
         course_id:courseid,
         batch_id:batchid,
         department_id:dpt,
         level:level,
         program_type:programtype,
         teacher_id:teacherid,
         class_id:classid
     }

     CourseTeacherClass.findOne({where:{class_id:classid,course_id:courseid,department_id:dpt,batch_id:batchid}}).then(data =>{
      console.log("fffffffffffff");
          if(!data)
          {
            CourseTeacherClass.create(courseteachercomData).then(classteachercourse =>{
           
            }).catch(error =>{
              console.log(error)
            })
              
          }
        
         else {
            CourseTeacherClass.update({teacher_id:teacherid},{where:{class_id:classid,course_id:courseid,department_id:dpt,batch_id:batchid}})
          }
       
     }).catch(error =>{
         console.log(error)
     })
   
  
  });
  
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
  router.post('/saveassignclassrepresentative',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  console.log(copyItems);
    if(copyItems.length >0)
    {
      console.log("xnnnnnnnnnnnnnnnnnnnnnnnn");
  copyItems.forEach((item) => {
     var classid = item.class;
     var teacherid = item.teacher;
     ClassInDept.update({rep_teacher_id:teacherid},{where:{class_id:classid}})
   
  
    });
  
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
module.exports = router;
const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const NGOCourse = db.ngocourses;
const IndustryCourse = db.industrycourses;
const User = db.users;
const Occupation = db.occupations;

const CourseTeacherClass = db.courseteacherclasses;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Batch = db.batches;

const IndustryBasedProgram  = db.industrybasedprogram;
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
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
      );
      const occupation  = await Occupation.findAll({where:{department_id:req.user.department}})
    res.render('assignclassrepresentative',{
 
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        occupation:occupation
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
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
      );
      const occupation  = await Occupation.findAll({where:{department_id:req.user.department}})
  
    res.render('assigncoursetoteacher',{
     
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        occupation:occupation
    })
})
router.post('/coursetoteacherlevelbased',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidlevel,
                              department_id: occupationname,
                              training_level:traininglevel,
                              training_type:programtype}})
        const courselist = await Course.findAll({where:{
                          
                            department_id: occupationname,
                            training_level:traininglevel }})

  res.render('courseteacher',{
   programid:programidlevel,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   dpt:occupationname
  }) 
})

router.post('/coursetoteacherindustrybased',ensureAuthenticated,async function(req,res){
  const{programid,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programid,
                              department_id:occupationname,
                              training_type:programtype}})
        const courselist = await IndustryCourse.findAll({where:{
                            batch_id:programid,
                            department_id:occupationname,
                             }})

  res.render('courseteacher',{
   programid:programid,
   teacherlist:teacherlist,
   traininglevel:'',
   programtype:programtype,
   classlist:classlist,
   courselist:courselist
  }) 
})
router.post('/coursetoteacherngobased',ensureAuthenticated,async function(req,res){
  const{programid,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programid,
                              department_id:occupationname,
                           
                              training_type:programtype}})
        const courselist = await NGOCourse.findAll({where:{
                            batch_id:programid,
                            department_id:occupationname,
                            }})

  res.render('courseteacher',{
   programid:programid,
   teacherlist:teacherlist,
   traininglevel:'',
   programtype:programtype,
   classlist:classlist,
   courselist:courselist
  }) 
})
router.post('/assignclassrepresentativelevel',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidlevel,
                              department_id: occupationname,
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

router.post('/assignclassrepresentativengo',ensureAuthenticated,async function(req,res){
  const{programid,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programid,
                              department_id: occupationname,
                            
                              training_type:programtype}})
       

  res.render('classrepresentative',{
   programid:programid,
   teacherlist:teacherlist,
   traininglevel:'',
   programtype:programtype,
   classlist:classlist,

  }) 
})
router.post('/assignclassrepresentativeindustry',ensureAuthenticated,async function(req,res){
  const{programid,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programid,
                              department_id: occupationname,
                           
                              training_type:programtype}})
       

  res.render('classrepresentative',{
   programid:programid,
   teacherlist:teacherlist,
   traininglevel:'',
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
     var dpt = item.dpt;
     
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
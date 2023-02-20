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
const ClassInDept = db.classindepts;
const NGOBasedTrainee = db.ngobasedtrainees;
const LevelBasedTrainee = db.levelbasedtrainees;
const IndustryBasedTrainee = db.industrybasedtrainees;
const LevelBasedProgress = db.levelbasedprogresses;
const CorseTeacherClass = db.courseteacherclasses;
const Occupation = db.occupations;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/managelevelbased',ensureAuthenticated,async function(req,res){
  const [ngobased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const department = await Occupation.findAll({where:{department_id:req.user.department}});
  res.render('managelevelbased',{levelbased:levelbased,department:department})
})
router.get('/managengobased',ensureAuthenticated,async function(req,res){
  const [ngobased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
  );
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const department = await Occupation.findAll({where:{department_id:req.user.department}});
  
  res.render('managengobased',{levelbased:ngobased,department:department})
})
router.get('/manageindustrybased',ensureAuthenticated,async function(req,res){
  const [industrybased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
  );
 
  const department = await Occupation.findAll({where:{department_id:req.user.department}});
  
  res.render('manageindustrybased',{levelbased:industrybased,department:department})
})

router.post('/showclassstudentlevel/(:classname)',ensureAuthenticated,async function(req,res){
    
    const{level,programtype,dpt,batchid,courseid} = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:req.params.classname}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT * FROM  courses where course_id='"+courseid +"' "
      );    
     res.render('alllevelbasedlist',{courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

    })
router.post('/showclassstudentngo/(:classname)',ensureAuthenticated,async function(req,res){

  const{level,programtype,dpt,batchid,courseid} = req.body;
  const levelbased = await NGOBasedTrainee.findAll({where:{class_id:req.params.classname}});
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  ngocourses where course_id='"+courseid +"' "
    );    
    res.render('allngobasedlist',{courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

  })
router.post('/showclassstudentindustry/(:classname)',ensureAuthenticated,async function(req,res){

  const{level,programtype,dpt,batchid,courseid} = req.body;
  const levelbased = await IndustryBasedTrainee.findAll({where:{class_id:req.params.classname}});
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  industrycourses where course_id='"+courseid +"' "
    );    
    res.render('allindustrybasedlist',{courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

  })
router.post('/generatecoursegradelevelbased/(:classname)',ensureAuthenticated,async function(req,res){
  
    const{level,programtype,dpt,batchid,courseid} = req.body;
    const [courselist, metadata] = await sequelize.query(
        "SELECT * FROM  courses where course_id='"+courseid +"' "
      );   
      const [levelbased, metadatalevelbased] = await sequelize.query(
        "select * from levelbasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = levelbasedtrainees.class_id where levelbasedtrainees.class_id = '"+ req.params.classname +"' and levelbasedtrainees.trainee_id = levelbasedprogresses.student_id and levelbasedprogresses.course_id='"+courseid+"'"
      );      
      res.render('genrategradereportlevel',{courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

})
router.post('/generatecoursegradengobased/(:classname)',ensureAuthenticated,async function(req,res){
  
  const{level,programtype,dpt,batchid,courseid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  ngocourses where course_id='"+courseid +"' "
    );   
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * from ngobasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = ngobasedtrainees.class_id where ngobasedtrainees.class_id = '"+ req.params.classname +"' and ngobasedtrainees.trainee_id = levelbasedprogresses.student_id and levelbasedprogresses.course_id='"+courseid+"'"
    );      
    res.render('genrategradereportlevel',{courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

})
router.post('/generatecoursegradeindustrybased/(:classname)',ensureAuthenticated,async function(req,res){
  
  const{level,programtype,dpt,batchid,courseid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  industrycourses where course_id='"+courseid +"' "
    );   
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * from industrybasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = industrybasedtrainees.class_id where industrybasedtrainees.class_id = '"+ req.params.classname +"' and industrybasedtrainees.trainee_id = levelbasedprogresses.student_id and levelbasedprogresses.course_id='"+courseid+"'"
    );      
    res.render('genrategradereportlevel',{courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

})


router.post('/findmyclasstoevaluatecourselevel',ensureAuthenticated,async function(req,res){
     const{batchid,dept,occupationid,level} = req.body;
    
     const [results, metadata] = await sequelize.query(
      "SELECT * from classindepts where batch_id='"+batchid+"' and department_id='"+occupationid+"' and training_level='"+level+"'" );  
 
      const [course, metadatacourse] = await sequelize.query(
        "SELECT * from courses where department_id='"+occupationid+"' and training_level='"+level+"'" );     
      console.log(results)
     res.render('myclasses',{classlist:results,course:course,programtag:"level"})
});
router.post('/findmyclasstoevaluatecoursengo',ensureAuthenticated,async function(req,res){
  const{batchid,dept,occupationid} = req.body;
 
  const [results, metadata] = await sequelize.query(
     "SELECT * from classindepts where batch_id='"+batchid+"' and department_id='"+req.user.department+"' and batch_id='"+batchid+"'");  
   const [course, metadatacourse] = await sequelize.query(
     "SELECT * from ngocourses where batch_id='"+batchid+"' and department_id='"+req.user.department+"'" );     
   console.log(results)
  res.render('myclasses',{classlist:results,course:course,programtag:"ngo"})
});
router.post('/findmyclasstoevaluatecourseindustry',ensureAuthenticated,async function(req,res){
  const{batchid,dept,occupationid} = req.body;
 
  const [results, metadata] = await sequelize.query(
    "SELECT * from classindepts where batch_id='"+batchid+"' and department_id='"+req.user.department+"' and batch_id='"+batchid+"'");  
 
   const [course, metadatacourse] = await sequelize.query(
     "SELECT * FROM industrycourses where  batch_id='"+batchid+"' and department_id='"+req.user.department+"'" );     
   console.log(course)
  res.render('myclasses',{classlist:results,course:course,programtag:"industry"})
});






module.exports = router;
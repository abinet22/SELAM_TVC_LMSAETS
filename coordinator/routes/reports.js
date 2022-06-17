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
const LevelBasedProgress = db.levelbasedprogresses;
const CorseTeacherClass = db.courseteacherclasses;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.post('/searchclasstoshowevaluationprogresslevel',ensureAuthenticated,async function(req,res){
    const{batchid,dept} = req.body;
    
     const [results, metadata] = await sequelize.query(
     " select * from classindepts where batch_id='"+batchid+"' and department_id='"+dept+"'"
        );  
      const [course, metadatacourse] = await sequelize.query(
        "SELECT * FROM courses where department_id='"+dept+"' " );     
      console.log(course)
     res.render('myclasses',{classlist:results,course:course})
})
router.post('/searchclasstoshowevaluationprogressngo',ensureAuthenticated,async function(req,res){
    const{batchid,dept} = req.body;
    
     const [results, metadata] = await sequelize.query(
     " select * from classindepts where batch_id='"+batchid+"' and department_id='"+dept+"'"
        );  
      const [course, metadatacourse] = await sequelize.query(
        "SELECT * FROM ngocourses where department_id='"+dept+"' and batch_id='"+batchid+"' " );     
      console.log(course)
     res.render('myclasses',{classlist:results,course:course})
})
router.post('/searchclasstoshowevaluationprogressindustry',ensureAuthenticated,async function(req,res){
    const{batchid,dept} = req.body;
    
     const [results, metadata] = await sequelize.query(
     " select * from classindepts where batch_id='"+batchid+"' and department_id='"+dept+"'"
        );  
      const [course, metadatacourse] = await sequelize.query(
        "SELECT * FROM industrycourses where department_id='"+dept+"' and batch_id='"+batchid+"' " );     
      console.log(course)
     res.render('myclasses',{classlist:results,course:course})
})
router.post('/showclassevaluation/(:classname)',ensureAuthenticated,async function(req,res){
    
    const{level,programtype,dpt,batchid} = req.body;
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
      );
      const [levelbased, metadatalevelbased] = await sequelize.query(
        "select * from levelbasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = levelbasedtrainees.class_id where levelbasedtrainees.class_id = '"+ req.params.classname +"' and levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id"
      );     
     res.render('showclassevaluation',{dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

    });
router.post('/showclassevaluationngo/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
const [courselist, metadata] = await sequelize.query(
"SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
"INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
);
const [levelbased, metadatalevelbased] = await sequelize.query(
"select * from ngobasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = ngobasedtrainees.class_id where ngobasedtrainees.class_id = '"+ req.params.classname +"' and ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id"
);     
res.render('showclassevaluation',{dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

});
router.post('/showclassevaluationindustry/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
const [courselist, metadata] = await sequelize.query(
"SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
"INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
);
const [levelbased, metadatalevelbased] = await sequelize.query(
"select * from industrybasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = industrybasedtrainees.class_id where industrybasedtrainees.class_id = '"+ req.params.classname +"' and industrybasedtrainees.student_unique_id = studentmarklistlevelbaseds.student_id"
);   
console.log("yyyyyyyyyyyyyyyyyyyyyyyy")  
console.log(levelbased)
console.log(courselist)
res.render('showclassevaluation',{dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

});
router.post('/searchclasstoshowevaluationprogressngo',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('myclasses',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.post('/searchclasstoshowevaluationprogressindustry',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('myclasses',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.post('/searchclasstoshowattendancelevel',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('myclasses',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.post('/searchclasstoshowattendancengo',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('myclasses',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.post('/searchclasstoshowattendanceindustry',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('myclasses',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
module.exports = router;
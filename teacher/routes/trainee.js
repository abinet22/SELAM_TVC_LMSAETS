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
const CorseTeacherClass = db.courseteacherclasses;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.post('/showclassstudentlevel/(:classname)',ensureAuthenticated,async function(req,res){
    
    const{level,programtype,dpt,batchid} = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:req.params.classname}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
      );    
     res.render('alllevelbasedlist',{dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

    })
router.post('/findmyclasstoevaluatecourselevel',ensureAuthenticated,async function(req,res){
     const{batchid} = req.body;
    
     const [results, metadata] = await sequelize.query(
        "SELECT classindepts.class_name,classindepts.department_id,classindepts.batch_id,classindepts.training_level,classindepts.class_id,classindepts.training_type FROM  courseteacherclasses "+
        "INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"'"
      );    
      console.log(results)
     res.render('myclasses',{classlist:results})
});

router.post('/savestudentevaluationtheretical',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  //console.log(copyItems);
    if(copyItems.length >0)
    {
     // console.log("x");
  copyItems.forEach((item) => {
     var courseid = item.courseid;
     var studentid = item.studentid;
     var evaluation = item.evaluation;
     var level = item.level;
     var programtype = item.programtype;
     var classid = item.classid;
     var dpt = item.department;
     var batchid = item.batchid;
     const mark = {
        class_id: classid,
        batch_id: batchid,
        program_type: programtype,
        training_level: level,
        department_id: dpt,
        teacher_id: req.user.userid,
        student_id: studentid,
        course_id:courseid,
        practical_evaluation:0,
        theroretical_evaluation:evaluation,
        field_evaluation:0,
        is_confirm_registrar:"No",
        is_confirm_department:"No",
        is_confirm_teacher:"No"

     }
     console.log(mark);
     StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
         if(!marklist){
            StudentMarkListLevelBased.create(mark);
         }
         else{
            StudentMarkListLevelBased.update({theroretical_evaluation:evaluation},{where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
router.post('/savestudentevaluationpractical',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  //console.log(copyItems);
    if(copyItems.length >0)
    {
     // console.log("x");
  copyItems.forEach((item) => {
     var courseid = item.courseid;
     var studentid = item.studentid;
     var evaluation = item.evaluation;
     var level = item.level;
     var programtype = item.programtype;
     var classid = item.classid;
     var dpt = item.department;
     var batchid = item.batchid;
     const mark = {
        class_id: classid,
        batch_id: batchid,
        program_type: programtype,
        training_level: level,
        department_id: dpt,
        teacher_id: req.user.userid,
        student_id: studentid,
        course_id:courseid,
        practical_evaluation:evaluation,
        theroretical_evaluation:0,
        field_evaluation:0,
        is_confirm_registrar:"No",
        is_confirm_department:"No",
        is_confirm_teacher:"No"

     }
     console.log(mark);
     StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
         if(!marklist){
            StudentMarkListLevelBased.create(mark);
         }
         else{
            StudentMarkListLevelBased.update({practical_evaluation:evaluation},{where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
router.post('/savestudentevaluationinternship',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  //console.log(copyItems);
    if(copyItems.length >0)
    {
     // console.log("x");
  copyItems.forEach((item) => {
     var courseid = item.courseid;
     var studentid = item.studentid;
     var evaluation = item.evaluation;
     var level = item.level;
     var programtype = item.programtype;
     var classid = item.classid;
     var dpt = item.department;
     var batchid = item.batchid;
     const mark = {
        class_id: classid,
        batch_id: batchid,
        program_type: programtype,
        training_level: level,
        department_id: dpt,
        teacher_id: req.user.userid,
        student_id: studentid,
        course_id:courseid,
        practical_evaluation:0,
        theroretical_evaluation:0,
        field_evaluation:evaluation,
        is_confirm_registrar:"No",
        is_confirm_department:"No",
        is_confirm_teacher:"No"

     }
     console.log(mark);
     StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
         if(!marklist){
            StudentMarkListLevelBased.create(mark);
         }
         else{
            StudentMarkListLevelBased.update({field_evaluation:evaluation},{where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
router.post('/singlethoreticalevaluation/(:traineeid)',ensureAuthenticated,async function(req,res){
    const{thoretical,batchid,level,programtype,courseid,dpt,classid}  = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:classid}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+classid+"' "
      );    
  
    if(!thoretical || courseid == "" ){
        res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            error_msg:'Please Add  Evaluation Mark And Select Course Name First'
            })
    }
    else
    {
        const mark = {
            class_id: classid,
            batch_id: batchid,
            program_type: programtype,
            training_level: level,
            department_id: dpt,
            teacher_id: req.user.userid,
            student_id: req.params.traineeid,
            course_id:courseid,
            practical_evaluation:0,
            theroretical_evaluation:thoretical,
            field_evaluation:0,
            is_confirm_registrar:"No",
            is_confirm_department:"No",
            is_confirm_teacher:"No"
    
         }
         StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
            if(!marklist){
                StudentMarkListLevelBased.create(mark).then(marklist =>{
                    res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Add  Theoretical Evaluation'
                    })
        
                 }).catch(error =>{
                     console.log(error)
                 })
            }
            else{
               StudentMarkListLevelBased.update({theroretical_evaluation:thoretical},{where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(uddt =>{
                res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Update Theoretical Evaluation'
                    })
               })
            }
        })
       
    }
})
router.post('/singlepracticalevaluation/(:traineeid)',ensureAuthenticated,async function(req,res){
    const{thoretical,batchid,level,programtype,courseid,dpt,classid}  = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:classid}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+classid+"' "
      );
  
    if(!thoretical || courseid == "" ){
        res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            error_msg:'Please Add  Evaluation Mark And Select Course Name First'
            })
    }
    else
    {
        const mark = {
            class_id: classid,
            batch_id: batchid,
            program_type: programtype,
            training_level: level,
            department_id: dpt,
            teacher_id: req.user.userid,
            student_id: req.params.traineeid,
            course_id:courseid,
            practical_evaluation:thoretical,
            theroretical_evaluation:0,
            field_evaluation:0,
            is_confirm_registrar:"No",
            is_confirm_department:"No",
            is_confirm_teacher:"No"
    
         }
         StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
            if(!marklist){
                StudentMarkListLevelBased.create(mark).then(marklist =>{
                    res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Add  Practical Evaluation'
                    })
        
                 }).catch(error =>{
                     console.log(error)
                 })
            }
            else{
               StudentMarkListLevelBased.update({practical_evaluation:thoretical},{where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(uddt =>{
                res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Update Practical Evaluation'
                    })
               })
            }
        })
       
    }
})
router.post('/singleinternshipevaluation/(:traineeid)',ensureAuthenticated,async function(req,res){
    const{thoretical,batchid,level,programtype,courseid,dpt,classid}  = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:classid}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+classid+"' "
      );
  
    if(!thoretical || courseid == "" ){
        res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            error_msg:'Please Add  Evaluation Mark And Select Course Name First'
            })
    }
    else
    {
        const mark = {
            class_id: classid,
            batch_id: batchid,
            program_type: programtype,
            training_level: level,
            department_id: dpt,
            teacher_id: req.user.userid,
            student_id: req.params.traineeid,
            course_id:courseid,
            practical_evaluation:0,
            theroretical_evaluation:0,
            field_evaluation:thoretical,
            is_confirm_registrar:"No",
            is_confirm_department:"No",
            is_confirm_teacher:"No"
    
         }
         StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
            if(!marklist){
                StudentMarkListLevelBased.create(mark).then(marklist =>{
                    res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Add  Internship Evaluation'
                    })
        
                 }).catch(error =>{
                     console.log(error)
                 })
            }
            else{
               StudentMarkListLevelBased.update({field_evaluation:thoretical},{where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(uddt =>{
                res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Update Internship Evaluation'
                    })
               })
            }
        })
       
    }
})
module.exports = router;
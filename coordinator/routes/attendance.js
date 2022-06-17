const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const LevelBasedTrainee =db.levelbasedtrainees
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const User = db.users;
const ClassInDept = db.classindepts;
const NewApplicant =db.newapplicants;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const uploadFile = require('../middleware/upload.js');
const NGOBasedTrainee = require('../models/NGOBasedTrainee');
const Attendance  = db.attendances;

router.post('/attendancedata',ensureAuthenticated,async function(req,res){
 const {batchid,dept,programtag} = req.body;
  const [classlist, metadata] = await sequelize.query(
    "SELECT * FROM  classindepts where batch_id='"+batchid+"' and department_id='"+dept+"'" );

  res.render('myattendanceclasses',{
      classlist:classlist,programtag:programtag
     
  })
})
router.post('/attendancedatafromclass/(:classname)',ensureAuthenticated,async function(req,res){
    
  const{level,programtype ,dpt,batchid} = req.body;
  const [absent, absentmeta] = await sequelize.query(
    "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Absent'"
  );  
  const [present, persentmeta] = await sequelize.query(
    "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Present'"
  );       
  const [permission, permissionmeta] = await sequelize.query(
    "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Permission'"
  ); 
  const [lbattendancedata, metaattendace] = await sequelize.query(
    "SELECT student_id,count(student_id) as total,sum(attendance_type='Absent') as absent,sum(attendance_type='Present') as present,sum(attendance_type='Permission')as permission  FROM attendances  where class_id='"+req.params.classname +"' group by student_id "

  ); 
  if(programtype == "level"){
    const [courselist, metadata] = await sequelize.query(
      "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
      "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
    );
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * from levelbasedtrainees where class_id = '"+req.params.classname+"'"
    );   
      
 res.render('attendancedataforclassselected',{present:present,permission:permission,absent:absent,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype , lbattendancedata:lbattendancedata})

  }else if(programtype == "ngo"){
    const [courselistngo, metadatango] = await sequelize.query(
      "SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
      "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
    );
    const [ngobased, metadatangobased] = await sequelize.query(
      "select * from ngobasedtrainees where class_id = '"+req.params.classname+"'"
    );   
      
 res.render('attendancedataforclassselected',{present:present,permission:permission,absent:absent,dpt:dpt,batchid:batchid,levelbased:ngobased,courselist:courselistngo,classid:req.params.classname,level:level,programtype:programtype , lbattendancedata:lbattendancedata})

  }else if(programtype == "industry"){
    const [courselistind, metadataind] = await sequelize.query(
      "SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
      "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
    );
    const [industrybased, metadataindustrybased] = await sequelize.query(
      "select * from industrybasedtrainees where class_id = '"+req.params.classname+"'"
    );   
      
 res.render('attendancedataforclassselected',{present:present,permission:permission,absent:absent,dpt:dpt,batchid:batchid,levelbased:industrybased,courselist:courselistind,classid:req.params.classname,level:level,programtype:programtype , lbattendancedata:lbattendancedata})

  } 
 
  })

module.exports = router;
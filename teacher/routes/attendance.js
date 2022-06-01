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
router.get('/takeattendance',ensureAuthenticated,async function(req,res){

    const classlist = await ClassInDept.findAll({where:{rep_teacher_id:req.user.userid}});
    

    res.render('myattendanceclasses',{
        classlist:classlist,
       
    })

});
router.get('/attendancedata',ensureAuthenticated,async function(req,res){

  const classlist = await ClassInDept.findAll({where:{rep_teacher_id:req.user.userid}});
    

  res.render('attendanceclasssearchdata',{
      classlist:classlist,
     
  })
})
router.post('/attendancedatafromclass/(:classname)',ensureAuthenticated,async function(req,res){
    
  const{level,programtype,dpt,batchid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
      "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
    );
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * from levelbasedtrainees where class_id = '"+req.params.classname+"'"
    );   
    const [lbattendancedata, metaattendace] = await sequelize.query(
      "SELECT student_id,sum(attendance_type='Absent') as absent,sum(attendance_type='Present') as present,sum(attendance_type='Permission')as permission  FROM attendances  where class_id='"+req.params.classname +"' group by student_id "

    ); 
    const [absent, absentmeta] = await sequelize.query(
      "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Absent'"
    );  
    const [present, persentmeta] = await sequelize.query(
      "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Present'"
    );       
    const [permission, permissionmeta] = await sequelize.query(
      "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Permission'"
    );   
   res.render('attendancedataforclassselected',{present:present,permission:permission,absent:absent,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype , lbattendancedata:lbattendancedata})

  })
router.post('/takeattendance/(:classname)',ensureAuthenticated,async function(req,res){
    
  const{level,programtype,dpt,batchid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
      "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
    );
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * from levelbasedtrainees where class_id = '"+req.params.classname+"'"
    );   
    const [lbattendancedata, metaattendace] = await sequelize.query(
      "SELECT student_id,sum(attendance_type='Absent') as absent,sum(attendance_type='Present') as present,sum(attendance_type='Permission')as permission  FROM attendances  where class_id='"+req.params.classname +"' group by student_id "

    ); 
    const [absent, absentmeta] = await sequelize.query(
      "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Absent'"
    );  
    const [present, persentmeta] = await sequelize.query(
      "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Present'"
    );       
    const [permission, permissionmeta] = await sequelize.query(
      "SELECT student_id,attendance_date FROM attendances  where class_id='"+req.params.classname +"' and attendance_type='Permission'"
    );   
   res.render('myattendanceclassstudentlist',{present:present,permission:permission,absent:absent,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype , lbattendancedata:lbattendancedata})

  })

router.post('/saveclassattendance',ensureAuthenticated,async function(req,res){
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
     var attendancetype = item.attendancetype ;
     var studentid = item.studentid;
     var attendancedate = item.attendancedate;
     var classid = item.classid;
         var department = item.department;
         var batchid = item.batchid;
     const attendanceData = {
        class_id: classid,
        batch_id: batchid,
        student_id:studentid,
        attendance_type:attendancetype,
      attendance_date:attendancedate
    
     }
    
     Attendance.findOne({where:{student_id:studentid,class_id:classid,attendance_date:attendancedate}}).then(marklist =>{
         if(!marklist){
            Attendance.create(attendanceData);
         }
         else{
            Attendance.update({attendance_date:attendancedate},{where:{student_id:studentid,class_id:classid}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
module.exports = router;
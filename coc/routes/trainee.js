const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const JBSStudentData = db.jbsstudentdatas;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const User = db.users;
const ClassInDept = db.classindepts;
const TraineeCOCHistory = db.traineecochistory;
const sequelize = db.sequelize ;
const Occupation = db.occupations;
const Company = db.companies;
const EmployeementHistory = db.employementhistories;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const LevelBasedTrainee = db.levelbasedtrainees;
const Batch = db.batches;

router.post('/updatetraineestatussendtococ',ensureAuthenticated,async function(req,res){
    const{level,traineeid,programidbatch,dept,programtag} = req.body;
  
  const [department,dptmeta] = await sequelize.query(
    " select * from occupations inner join departments on"+
     " departments.department_id=occupations.department_id inner join sectorlists on"+
     " sectorlists.sector_id = departments.training_id where occupations.occupation_id='"+dept+"' "
  );
  const batch = await Batch.findOne({where:{batch_id:programidbatch}});
  const student = await LevelBasedTrainee.findAll({where:{trainee_id:traineeid,department_id:dept,batch_id:programidbatch,current_level:level}});
    
      const [courselist,metacourselist] = await sequelize.query(
        "select * from courses where department_id='"+dept+"' and training_level='"+level+"'");
       
       
      const [marklist, metaclasslist] = await sequelize.query(
        "SELECT * FROM levelbasedtrainees  INNER JOIN studentmarklistlevelbaseds "+
        " ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        "inner join courses on courses.course_id = studentmarklistlevelbaseds.course_id "+
    " where levelbasedtrainees.trainee_id ='"+traineeid+"'" +
    " and levelbasedtrainees.current_level ='"+level+"'"+
    " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
   " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
    "  and courses.training_level='"+level+"'" +
    "  and courses.department_id='"+dept+"'" 
      );
       var x = new Date()
      const cochis = {
        batch_id: programidbatch,
      trainee_id: traineeid,
      message:"Sent to take coc exam on"+ x
      }
      TraineeCOCHistory.create(cochis).then(()=>{
        res.render('singlestudenttococ',{
          marklist:marklist,
          programtag:'level',
          deptid:dept,
          batchid:programidbatch,
          classid:'',
          courseid:'',
          student:student,
          department:department,
          batch:batch,
          courselist:courselist,
          classinfo:'',
          level:level,
          traineeid:traineeid,
          success_msg:"Successfully Update Trainee Status Sent To Take COC Exam"
      })
      }).catch(err =>{
        res.render('singlestudenttococ',{
          marklist:marklist,
          programtag:'level',
          deptid:dept,
          batchid:programidbatch,
          classid:'',
          courseid:'',
          student:student,
          department:department,
          batch:batch,
          courselist:courselist,
          classinfo:'',
          level:level,
          traineeid:traineeid,
          error_msg:"Error Occurs Please Try Later"
      })
      })
        
})
router.post('/seetraineecochistory/(:traineeid)',ensureAuthenticated,async function(req,res){
    const emphistory = await TraineeCOCHistory.findAll({where:{trainee_id:req.params.traineeid}});
    const student   =await  LevelBasedTrainee.findOne({where:{trainee_id:req.params.traineeid}});
    const batch = await Batch.findOne({where:{batch_id:student.batch_id}});
    const [department,dptmeta] = await sequelize.query(
        " select * from occupations inner join departments on"+
         " departments.department_id=occupations.department_id inner join sectorlists on"+
         " sectorlists.sector_id = departments.training_id where occupations.occupation_id='"+student.department_id+"' "
      )
res.render('singletraineecochistory',{
    emphistory:emphistory,
    batch:batch,
    department:department,
    student:student

    
})
})


module.exports = router;

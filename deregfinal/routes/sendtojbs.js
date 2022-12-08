const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const JBSStudentData = db.jbsstudentdatas;
const Course = db.courses;
const User = db.users;
const ClassInDept = db.classindepts;
const IndustryBasedTrainee = db.industrybasedtrainees;
const NGOBasedTrainee = db.ngobasedtrainees;
const LevelBasedTrainee = db.levelbasedtrainees;
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Batch = db.batches;
const LevelBasedProgram = db.levelbasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const NGOBasedProgram = db.ngobasedprograms;
const Occupation = db.occupations;
router.post('/allgraduatelevelbaseddatabydepartment',ensureAuthenticated,async function(req,res){
  const {batchid,deptid,level} = req.body;
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedtrainees where is_graduated='Yes' and is_pass_coc='PASS'"+
        " and batch_id ='"+batchid+"'"+
        " and department_id ='"+deptid+"'"+
        " and current_level= '"+level+"'"
      );
    
    const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('graduatestudentlist',{
    studentlist:levelbased,
    department:department,
    classlist:classlist,
    batchid:batchid,
    deptid:deptid,
    programtag:"level"
})
})
router.post('/allgraduatengobaseddatabydepartment',ensureAuthenticated,async function(req,res){
    const {batchid,deptid,level} = req.body;
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedtrainees where is_graduated='Yes' "+
        " and batch_id ='"+batchid+"'"+
        " and department_id ='"+deptid+"'"
      );
    const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('graduatestudentlist',{
    studentlist:ngobased,
    department:department,
    classlist:classlist,
    batchid:batchid,
    deptid:deptid,
    programtag:"ngo"
})
})
router.post('/allgraduateindustrybaseddatabydepartment',ensureAuthenticated,async function(req,res){
    
    const {batchid,deptid,level} = req.body;
    const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedtrainees where is_graduated='Yes' "+
        " and batch_id ='"+batchid+"'"+
        " and department_id ='"+deptid+"'"
      );
    const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('graduatestudentlist',{
    studentlist:industrybased,
    department:department,
    classlist:classlist,
    batchid:batchid,
    deptid:deptid,
    programtag:"industry"
})
})

router.post('/sendgraduatedstudentlisttojbsdb',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
    let errors =[];
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
  
   var studentid=item.student_id;
   var programtag = item.programtag;
   var deptid = item.department_id;
   var batchid = item.batch_id;
    if(!studentid ){
     errors.push({msg:'please make sure your mark list is correct'})
    }
   else{
    
    sendtojbsdb(studentid,programtag,deptid,batchid);
  
    
  
   }
      
  
  });
  
  
    if(errors.length >0){
  
      res.send({message:'error'})
    }else{
      res.send({message:'success'})
    }
    
  
    }
    else{
  
      res.send({message:'error'})
  
    }

    async function sendtojbsdb(student,programtag,dept,batch){
          var applicant;
        if(programtag =="level"){
             applicant = await LevelBasedTrainee.findOne({where:{batch_id:batch,trainee_id:student}});
          
           }else if(programtag =="ngo"){
            applicant = await NGOBasedTrainee.findOne({where:{batch_id:batch,trainee_id:student}});
          
           }else if (programtag == "industry"){
             applicant = await IndustryBasedTrainee.findOne({where:{batch_id:batch,trainee_id:student}});
          
           }
           var name = JSON.parse(JSON.stringify(applicant.personal_info));
           var address = JSON.parse(JSON.stringify(applicant.contact_info));
           var birthday = new Date(name.birthday).toLocaleDateString();
           var ageval = new Date(new Date() - new Date(birthday)).getFullYear() - 1970;
           const newtraineetojbs = {
            batch_id: applicant.batch_id,
            trainee_id:applicant.trainee_id,
            student_unique_id:applicant.student_unique_id,
            full_name:name.firstname+ " "+name.middlename+" "+name.lastname,
           
            region:address.region,
            woreda: address.woredakebele,
            zone: address.zonesubcity,
            hno:address.hno,
            birthdate: name.birthday,
            sex: name.gender,
            age: ageval,
            intake_date: new Date(),
            personal_phone: address.phoneNumber_1+"/"+address.phoneNumber_2,
            family_phone:address.emergencyphone,
            family_name: address.emergencyname,
         
            graduated: 1,
            graduated_date: applicant.updatedAt,
            placed_in_app: 1,
            placed_in_app_date: new Date(),
        
            employed_self: 0,
    
            employed_six_months:0,
         
            employed_in_fl:0 ,
         
            department_id:applicant.department_id,
            admission_type:applicant.admission_type,
            class_id: applicant.class_id,
            entry_level: applicant.entry_level,
            current_level:applicant.current_level,
            is_disable:applicant.is_disable,
            payment_info:applicant.payment_info,
            programtag:programtag
            
        }
        JBSStudentData.findOne({where:{trainee_id:student}}).then(traineE =>{
            if(traineE){
                }
            else{
                JBSStudentData.create(newtraineetojbs);
                if(programtag =="level"){
                  LevelBasedTrainee.update({is_send_to_jbs:'Yes'},{where:{trainee_id:applicant.trainee_id}})
    
                }else if(programtag =="ngo"){
                  NGOBasedTrainee.update({is_send_to_jbs:'Yes'},{where:{trainee_id:applicant.trainee_id}})
    
                }else if (programtag == "industry"){
                  IndustryBasedTrainee.update({is_send_to_jbs:'Yes'},{where:{trainee_id:applicant.trainee_id}})
    
                }
                      }
        })
       
        }
  
  })
module.exports = router;
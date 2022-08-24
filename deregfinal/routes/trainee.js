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
const Occupation = db.occupations;
const Batch = db.batches;
const LevelBasedProgram = db.levelbasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const NGOBasedProgram = db.ngobasedprograms;

router.get('/managelevelbased',ensureAuthenticated,async function(req,res){
  
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
      );
    
    const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('managelevelbased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.get('/managengobased',ensureAuthenticated,async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
      );
      const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('managengobased',{
    levelbased:ngobased,
    department:department,
    classlist:classlist
})
})
router.get('/manageindustrybased',ensureAuthenticated,async function(req,res){
    const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
      );
      const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('manageindustrybased',{
    levelbased:industrybased,
    department:department,
    classlist:classlist
})
})
router.post('/printgraduatescertificate',ensureAuthenticated,async function(req,res){

    res.render('printcertificate');
})

router.post('/printgraduatesgradereport',ensureAuthenticated,async function(req,res){
    const{level,traineeid,programidbatch,dept,programtag} = req.body;
    const [courselist,metacourselist] = await sequelize.query(
      "select * from industrycourses where batch_id='"+programidbatch+"'");
      const [sectordept, metaclasslist] = await sequelize.query(
    "    SELECT * FROM sectorlists INNER JOIN  departments on sectorlists.sector_id = departments.training_id "+
   "    inner join occupations on occupations.department_id = departments.department_id "+
      " where occupations.occupation_id ='"+dept+"'"
       
      );
      console.log("cccccccccccccccccccccc");
      console.log(sectordept);
     const department = await Occupation.findOne({where:{occupation_id:dept}});
       const batch = await Batch.findOne({where:{batch_id:programidbatch}});
      if(programtag =="level"){
        const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM levelbasedtrainees  INNER JOIN studentmarklistlevelbaseds ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
          "inner join courses on courses.course_id = studentmarklistlevelbaseds.course_id "+
      " where levelbasedtrainees.student_unique_id ='"+traineeid+"'" +
      " and levelbasedtrainees.current_level ='"+level+"'"+
      " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
     " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
      "  and courses.training_level='"+level+"'" +
      "  and courses.department_id='"+dept+"'" 
        );
            res.render('printgradereport',{
              marklist:marklist,
              programtag:programtag,
              deptid:dept,
              batchid:programidbatch,
              classid:'',
              courseid:'',
              department:department,
              batch:batch,
              classinfo:'',
              level:level,
              traineeid:traineeid,
              courselist:marklist,
              sectorlist:sectordept
          })
      }else if(programtag =="ngo"){
          const [marklist, metaclasslist] = await sequelize.query(
              "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
            " where  ngobasedtrainees.student_unique_id ='"+traineeid+"'" +
            " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
            " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
            );
            res.render('printgradereport',{
              marklist:marklist,
              programtag:programtag,
              deptid:dept,
              batchid:programidbatch,
              classid:'',
              courseid:'',
              department:department,
              traineeid:traineeid,
              batch:batch,
              classinfo:'',
              level:''
          })
      }else if(programtag == "industry"){
        const [courselist,metacourselist] = await sequelize.query(
            "select * from industrycourses where batch_id='"+programidbatch+"'");
           
          const [marklist, metaclasslist] = await sequelize.query(
            "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
             " where  industrybasedtrainees.student_unique_id ='"+traineeid+"'" +
          " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
          " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
            );
              res.render('printgradereport',{
                  marklist:marklist,
                  programtag:programtag,
                  deptid:dept,
                  batchid:programidbatch,
                  classid:'',
                  department:department,
                  batch:batch,
                  traineeid:traineeid,
                  courselist:courselist,
                  classinfo:'',
                  level:''
              })
      }
   
})



router.post('/selecttraineeebyidtogradereport',ensureAuthenticated,async function(req,res){
const{level,traineeid,programidbatch,dept,programtag} = req.body;

const [classinfo,metaclassinfo] = await sequelize.query(
    "select * from classindepts inner join batches on batches.batch_id = classindepts.batch_id "+
    " inner join occupations on occupations.occupation_id= classindepts.department_id "+
    " where occupations.occupation_id = '"+ dept +"' and batches.batch_id='"+programidbatch+"'");
  
    const department = await Occupation.findOne({where:{occupation_id:dept}});
   const batch = await Batch.findOne({where:{batch_id:programidbatch}});
  if(programtag =="level"){
    const [courselist,metacourselist] = await sequelize.query(
      "select * from courses where department_id='"+dept+"' and training_level='"+level+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM levelbasedtrainees  INNER JOIN studentmarklistlevelbaseds ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
          "inner join courses on courses.course_id = studentmarklistlevelbaseds.course_id "+
      " where levelbasedtrainees.student_unique_id ='"+traineeid+"'" +
      " and levelbasedtrainees.current_level ='"+level+"'"+
      " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
     " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
      "  and courses.training_level='"+level+"'" +
      "  and courses.department_id='"+dept+"'" 
        );
        res.render('singlestudentdata',{
          marklist:marklist,
          programtag:programtag,
          deptid:dept,
          batchid:programidbatch,
          classid:'',
          courseid:'',
          department:department,
          batch:batch,
          courselist:courselist,
          classinfo:'',
          level:level,
          traineeid:traineeid
      })
  }else if(programtag =="ngo"){
    const [courselist,metacourselist] = await sequelize.query(
      "select * from ngocourses where batch_id='"+programidbatch+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        " where  ngobasedtrainees.student_unique_id ='"+traineeid+"'" +
        " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
        " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
        );
        res.render('singlestudentdata',{
          marklist:marklist,
          programtag:programtag,
          deptid:dept,
          batchid:programidbatch,
          classid:'',
          courseid:'',
          department:department,
          traineeid:traineeid,
          courselist:courselist,
          batch:batch,
          classinfo:'',
          level:''
      })
  }else if(programtag == "industry"){
    const [courselist,metacourselist] = await sequelize.query(
        "select * from industrycourses where batch_id='"+programidbatch+"'");
       
      const [marklist, metaclasslist] = await sequelize.query(
        "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
         " where  industrybasedtrainees.student_unique_id ='"+traineeid+"'" +
      " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
        );
          res.render('singlestudentdata',{
              marklist:marklist,
              programtag:programtag,
              deptid:dept,
              batchid:programidbatch,
              classid:'',
              department:department,
              batch:batch,
              traineeid:traineeid,
              courselist:courselist,
              classinfo:'',
              level:''
          })
  }
  
})
router.post('/searchtraineebydepartmentgradereport',ensureAuthenticated,async function(req,res){
const{level,programidbatch,dept,programtag} = req.body;

const [classinfo,metaclassinfo] = await sequelize.query(
    "select * from classindepts where department_id = '"+dept+"' and batch_id='"+programidbatch+"'");

  if(programtag =="level"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from courses where department_id = '"+dept+"' and training_level='"+level+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN levelbasedtrainees ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
      " where  levelbasedtrainees.current_level ='"+level+"'"+
      " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        res.render('studentdataindepartment',{
          marklist:marklist,
          programtag:programtag,
          deptid:dept,
          batchid:programidbatch,
          classid:'',
          courseid:courseinfo,
          classinfo:classinfo,
          level:level
      })
  }else if(programtag =="ngo"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from ngocourses where department_id = '"+dept+"' and batch_id='"+programidbatch+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        " where studentmarklistlevelbaseds.department_id ='"+dept+"' "+
        " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        res.render('studentdataindepartment',{
          marklist:marklist,
          programtag:programtag,
          deptid:dept,
          batchid:programidbatch,
          classid:'',
          courseid:courseinfo,
          classinfo:classinfo,
          level:''
      })
  }else if(programtag == "industry"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from industrycourses where department_id = '"+dept+"' and batch_id='"+programidbatch+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
        "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
      " where studentmarklistlevelbaseds.department_id ='"+dept+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
          res.render('studentdataindepartment',{
              marklist:marklist,
              programtag:programtag,
              deptid:dept,
              batchid:programidbatch,
              classid:'',
              courseid:courseinfo,
              classinfo:classinfo,
              level:''
          })
  }
  
})

router.post('/reportproblemtodepartment/(:traineeid)',ensureAuthenticated,async function(req,res){
 
  const{batchid,courseid,classid,deptid,programtag,teacherid, level} = req.body;
  const [classinfo,metaclassinfo] = await sequelize.query(
    "select * from classindepts where department_id = '"+deptid+"' and batch_id='"+batchid+"'");

  if(programtag =="level"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from courses where department_id = '"+deptid+"' and training_level='"+level+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN levelbasedtrianees ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
      " and studentmarklistlevelbaseds.class_id ='"+classid+"' " +
      " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        StudentMarkListLevelBased.update({is_confirm_department:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,teacher_id:teacherid,student_id:req.params.traineeid}}).then(()=>{
          res.render('studentdataindepartment',{
            marklist:marklist,
            programtag:programtag,
            deptid:deptid,
            batchid:batchid,
            classid:classid,
            courseid:courseinfo,
            classinfo:classinfo,
            level:level,
            success_msg:'Successfully sent evaluation report problem to department for correction '
        })
        }) 
  }else if(programtag =="ngo"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from ngocourses where department_id = '"+deptid+"' and batch_id='"+batchid+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrianees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
        " and studentmarklistlevelbaseds.class_id ='"+classid+"' " +
        " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
        " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
        " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
        " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        StudentMarkListLevelBased.update({is_confirm_department:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,teacher_id:teacherid,student_id:req.params.traineeid}}).then(()=>{
          res.render('studentdataindepartment',{
            marklist:marklist,
            programtag:programtag,
            deptid:deptid,
            batchid:batchid,
            classid:classid,
            courseid:courseinfo,
            classinfo:classinfo,
            level:'',
            success_msg:'Successfully sent evaluation report problem to department for correction '
        })
        }) 
  }else if(programtag == "industry"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from industrycourses where department_id = '"+deptid+"' and batch_id='"+batchid+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
        "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
      " and studentmarklistlevelbaseds.class_id ='"+classid+"' " +
      " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        StudentMarkListLevelBased.update({is_confirm_department:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,teacher_id:teacherid,student_id:req.params.traineeid}}).then(()=>{
          res.render('studentdataindepartment',{
            marklist:marklist,
            programtag:programtag,
            deptid:deptid,
            batchid:batchid,
            classid:classid,
            courseid:courseinfo,
            classinfo:classinfo,
            level:'',
            success_msg:'Successfully sent evaluation report problem to department for correction '
        })
        }) 
        
  }
  
 
})

router.post('/searchfiltermarklistbycourseclass',ensureAuthenticated,async function(req,res){
 
  const{batchid,courseid,classid,deptid,programtag, level} = req.body;
  const [classinfo,metaclassinfo] = await sequelize.query(
    "select * from classindepts where department_id = '"+deptid+"' and batch_id='"+batchid+"'");

  if(programtag =="level"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from courses where department_id = '"+deptid+"' and training_level='"+level+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN levelbasedtrianees ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
      " and studentmarklistlevelbaseds.class_id ='"+classid+"' " +
      " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        res.render('studentdataindepartment',{
          marklist:marklist,
          programtag:programtag,
          deptid:deptid,
          batchid:batchid,
          classid:classid,
          courseid:courseinfo,
          classinfo:classinfo,
          level:level,
     })
  }else if(programtag =="ngo"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from ngocourses where department_id = '"+deptid+"' and batch_id='"+batchid+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
          "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrianees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
        " and studentmarklistlevelbaseds.class_id ='"+classid+"' " +
        " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
        " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
        " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
        " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        res.render('studentdataindepartment',{
          marklist:marklist,
          programtag:programtag,
          deptid:deptid,
          batchid:batchid,
          classid:classid,
          courseid:courseinfo,
          classinfo:classinfo,
          level:'',
      })
  }else if(programtag == "industry"){
    const [courseinfo,metacourseinfo] = await sequelize.query(
      "select * from industrycourses where department_id = '"+deptid+"' and batch_id='"+batchid+"'");
     
      const [marklist, metaclasslist] = await sequelize.query(
        "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
      " and studentmarklistlevelbaseds.class_id ='"+classid+"' " +
      " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
      " and studentmarklistlevelbaseds.is_confirm_department ='Yes' "+
      " and studentmarklistlevelbaseds.is_confirm_teacher ='Yes' "
        );
        res.render('studentdataindepartment',{
          marklist:marklist,
          programtag:programtag,
          deptid:deptid,
          batchid:batchid,
          classid:classid,
          courseid:courseinfo,
          classinfo:classinfo,
          level:'',
        })
        
  }
  
 
})

router.post('/confirmsingleclasscoursegradereportaccepted',ensureAuthenticated,async function(req,res){
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

 var student_id=item.student_id;
  var course_id=item.course_id;
  if(!student_id || !course_id){
   errors.push({msg:'please make sure your mark list is correct'})
  }
 else{
  const graderpt ={
    batch_id:item.batch_id,
    department_id:item.department_id,
    class_id:item.class_id,
    student_id:item.student_id,
    course_id:item.course_id,
    is_confirm_registrar:"Yes",
    teacher_id:req.user.userid
 }
 StudentMarkListLevelBased.findOne({where:{student_id:item.student_id,course_id:item.course_id,class_id:item.class_id,department_id:item.department_id,batch_id:item.batch_id}}).then(student =>{
 if(student){

 StudentMarkListLevelBased.update({
   is_confirm_registrar:"Yes"},{where:{student_id:item.student_id,course_id:item.course_id,class_id:item.class_id, department_id:item.department_id,batch_id:item.batch_id}}) 

 }
 }).catch(error =>{
  errors.push({msg:'please makesure your mark list is correct'})
  console.log(error)
 })

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

})

router.post('/updatestudentdatagraduated',ensureAuthenticated,async function(req,res){
  const {programtag,batchid,traineeid,deptid,level} = req.body;
  const department = await Occupation.findOne({where:{occupation_id:deptid}});
  const batch = await Batch.findOne({where:{batch_id:batchid}});
  if(programtag =="level"){
    const [courselist,metacourselist] = await sequelize.query(
      "select * from courses where  training_level='"+level+"' and department_id='"+deptid+"'");
     
    const [marklist, metaclasslist] = await sequelize.query(
      "SELECT * FROM studentmarklistlevelbaseds INNER JOIN levelbasedtrainees ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
      "inner join courses on courses.department_id = levelbasedtrainees.department_id "+
  " where levelbasedtrainees.student_unique_id ='"+traineeid+"'" +
  " and levelbasedtrainees.current_level ='"+level+"'"+
  " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
  " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "
    );
    LevelBasedTrainee.findOne({where:{batch_id:batchid,trainee_id:traineeid,department_id:deptid,current_level:level}}).then(trainee =>{
      console.log(trainee);
      console.log("sfffffffffffffffff")
      if(!trainee){
        res.render('singlestudentdata',{
          marklist:marklist,
          programtag:programtag,
          deptid:deptid,
          batchid:batchid,
          classid:'',
          department:department,
          batch:batch,
          traineeid:traineeid,
          courselist:courselist,
          classinfo:'',
          level:'',
          error_msg:"trainee not found"
      })
      console.log(trainee)
      }
      else{
       
        LevelBasedTrainee.update({is_graduated:'Yes'},{where:{batch_id:batchid,trainee_id:traineeid,department_id:deptid,current_level:level}}).then(()=>{
          res.render('singlestudentdata',{
            marklist:marklist,
            programtag:programtag,
            deptid:deptid,
            batchid:batchid,
            classid:'',
            department:department,
            batch:batch,
            traineeid:traineeid,
            courselist:courselist,
            classinfo:'',
            level:''
        })
        })
      }
    })

  }else if(programtag =="ngo"){
    const [courselist,metacourselist] = await sequelize.query(
      "select * from ngocourses where batch_id='"+batchid+"'");
     
    const [marklist, metaclasslist] = await sequelize.query(
      "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
    " where  ngobasedtrainees.student_unique_id ='"+traineeid+"'" +
    " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
    " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "
    );
    NGOBasedTrainee.findOne({where:{batch_id:batchid,trainee_id:traineeid,department_id:deptid}}).then(trainee =>{
      if(!trainee){

      }
      else{
       
        NGOBasedTrainee.update({is_graduated:'Yes'},{where:{batch_id:batchid,trainee_id:traineeid,department_id:deptid}}).then(()=>{
          res.render('singlestudentdata',{
            marklist:marklist,
            programtag:programtag,
            deptid:dept,
            batchid:batchid,
            classid:'',
            department:department,
            batch:batch,
            traineeid:traineeid,
            courselist:courselist,
            classinfo:'',
            level:''
        })
        })
      }
    })
  }else if(programtag =="industry"){
    const [courselist,metacourselist] = await sequelize.query(
      "select * from industrycourses where batch_id='"+batchid+"'");
     
    const [marklist, metaclasslist] = await sequelize.query(
      "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
       " where  industrybasedtrainees.student_unique_id ='"+traineeid+"'" +
    " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
    " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "
      );
    IndustryBasedTrainee.findOne({where:{batch_id:batchid,trainee_id:traineeid,department_id:deptid}}).then(trainee =>{
      if(!trainee){

      }
      else{
        IndustryBasedTrainee.update({is_graduated:'Yes'},{where:{batch_id:batchid,trainee_id:traineeid,department_id:deptid}}).then(()=>{
          res.render('singlestudentdata',{
            marklist:marklist,
            programtag:programtag,
            deptid:dept,
            batchid:batchid,
            classid:'',
            department:department,
            batch:batch,
            traineeid:traineeid,
            courselist:courselist,
            classinfo:'',
            level:''
        })
        })
      }
    })
  }

})
module.exports = router;
const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;

const User = db.users;
const Occupation = db.occupations;
const NewApplicant =db.newapplicants;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4, parse } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const ClassInDept = db.classindepts;
const Course = db.courses;
const LevelBasedProgress = db.levelbasedprogresses;
const NGOCourse = db.ngocourses;
const IndustryCourse = db.industrycourses;
const LevelBasedProgram = db.levelbasedprograms;
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;

router.get('/searchgradereport',ensureAuthenticated,async function(req,res){
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
  
        res.render('searchgradereport',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        occupation:occupation
    });
});
router.post('/searchgrade',ensureAuthenticated,async function(req,res){
    const{programid,programtag,occupationname,level} = req.body; 
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
  
     if(programid == "0" || occupationname == "0")
     {
        res.render('searchgradereport',{
            levelbased:levelbased,
            ngobased:ngobased,
            industrybased:industrybased,
            error_msg:'please select batch name first to see grade reports',
            occupation:occupation
        });
     }
     else{
         var courselist;
         if(programtag == "level"){
         courselist = await Course.findAll({where:{department_id:occupationname,training_level:level}})
         }else if(programtag == "ngo"){
         courselist = await NGOCourse.findAll({where:{batch_id:programid,department_id:req.user.department}})
         }else if (programtag == "industry"){
         courselist = await IndustryCourse.findAll({where:{batch_id:programid,department_id:req.user.department}})
       
         }
        const [classlist, metaclasslist] = await sequelize.query(
            "SELECT class_id,batches.batch_id,batches.batch_name,occupations.occupation_id,occupations.occupation_name,class_name,staff_f_name,staff_m_name,staff_l_name  FROM classindepts INNER JOIN batches ON batches.batch_id = classindepts.batch_id "+
            " inner join stafflists on stafflists.staff_id = classindepts.rep_teacher_id "+
            " inner join occupations on occupations.occupation_id =classindepts.department_id where classindepts.batch_id='"+programid+"' and classindepts.department_id='"+occupationname+"'"
          );
      
        res.render('allclasslist',{
            classlist:classlist,
            programtag:programtag,
            courselist:courselist,
            occupation:occupation
        })
     }
   
    
});
router.post('/searchgraden',ensureAuthenticated,async function(req,res){
  const{programidn,programtag,occupationnamen,level} = req.body; 
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

   if(programidn == "0" )
   {
      res.render('searchgradereport',{
          levelbased:levelbased,
          ngobased:ngobased,
          industrybased:industrybased,
          error_msg:'please select batch name first to see grade reports',
          occupation:occupation
      });
   }
   else{
       var courselist;
       if(programtag == "level"){
       courselist = await Course.findAll({where:{department_id:occupationnamen,training_level:level}})
       }else if(programtag == "ngo"){
       courselist = await NGOCourse.findAll({where:{batch_id:programidn,department_id:req.user.department}})
       }else if (programtag == "industry"){
       courselist = await IndustryCourse.findAll({where:{batch_id:programidn,department_id:req.user.department}})
     
       }
      const [classlist, metaclasslist] = await sequelize.query(
          "SELECT class_id,batches.batch_id,batches.batch_name,departments.department_id,departments.department_name,class_name,staff_f_name,staff_m_name,staff_l_name  FROM classindepts INNER JOIN batches ON batches.batch_id = classindepts.batch_id "+
          " inner join stafflists on stafflists.staff_id = classindepts.rep_teacher_id "+
          " inner join departments on departments.department_id =classindepts.department_id where classindepts.batch_id='"+programidn+"' and classindepts.department_id='"+req.user.department+"'"
        );
    
      res.render('allclasslist',{
          classlist:classlist,
          programtag:programtag,
          courselist:courselist,
          occupation:occupation
      })
   }
 
  
});
router.post('/searchgradei',ensureAuthenticated,async function(req,res){
  const{programidi,programtag,occupationnamei,level} = req.body; 
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

   if(programidi == "0" )
   {
      res.render('searchgradereport',{
          levelbased:levelbased,
          ngobased:ngobased,
          industrybased:industrybased,
          error_msg:'please select batch name first to see grade reports',
          occupation:occupation
      });
   }
   else{
       var courselist;
       if(programtag == "level"){
       courselist = await Course.findAll({where:{department_id:occupationnamei,training_level:level}})
       }else if(programtag == "ngo"){
       courselist = await NGOCourse.findAll({where:{batch_id:programidi,department_id:req.user.department}})
       }else if (programtag == "industry"){
       courselist = await IndustryCourse.findAll({where:{batch_id:programidi,department_id:req.user.department}})
     
       }
      const [classlist, metaclasslist] = await sequelize.query(
          "SELECT class_id,batches.batch_id,batches.batch_name,departments.department_id,departments.department_name,class_name,staff_f_name,staff_m_name,staff_l_name  FROM classindepts INNER JOIN batches ON batches.batch_id = classindepts.batch_id "+
          " inner join stafflists on stafflists.staff_id = classindepts.rep_teacher_id "+
          " inner join departments on departments.department_id=classindepts.department_id where classindepts.batch_id='"+programidi+"' and classindepts.department_id='"+req.user.department+"'"
        );
    
      res.render('allclasslist',{
          classlist:classlist,
          programtag:programtag,
          courselist:courselist,
          occupation:occupation
      })
   }
 
  
});
router.post('/showgradeforclasscourse/(:classid)',ensureAuthenticated,async function(req,res){
const{courseid,programtag,deptid,batchid} = req.body;
const occupation  = await Occupation.findAll({where:{department_id:req.user.department}})
  

if(programtag =="level"){
    const [marklist, metaclasslist] = await sequelize.query(
        "SELECT * FROM studentmarklistlevelbaseds INNER JOIN levelbasedtrainees ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        " inner join levelbasedprogresses on levelbasedprogresses.student_id = studentmarklistlevelbaseds.student_id "+
    " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
    " and studentmarklistlevelbaseds.class_id ='"+req.params.classid+"' " +
    " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
    " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
    " and levelbasedprogresses.is_confirm_teacher = 'Yes'" +
    " and studentmarklistlevelbaseds.is_confirm_department ='No'"
      );
      const [classinfo,metaclassinfo] = await sequelize.query(
        "select * from classindepts inner join batches on batches.batch_id = classindepts.batch_id "+
        " inner join occupations on occupations.occupation_id = classindepts.department_id "+
        " inner join departments on occupations.department_id = departments.department_id "+
        " where occupations.occupation_id = '"+deptid+"' and batches.batch_id='"+batchid+"' and classindepts.class_id='"+req.params.classid+"'");
       const coourseinfo =await Course.findOne({where:{course_id:courseid}})
      res.render('showsinglecoursegradereport',{
        marklist:marklist,
        programtag:programtag,
        deptid:deptid,
        batchid:batchid,
        classid:req.params.classid,
        courseid:courseid,
        classinfo:classinfo,
        coourseinfo:coourseinfo
    })
}else if(programtag =="ngo"){
    const [marklist, metaclasslist] = await sequelize.query(
        "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        " inner join levelbasedprogresses on levelbasedprogresses.student_id = studentmarklistlevelbaseds.student_id "+
        " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
      " and studentmarklistlevelbaseds.class_id ='"+req.params.classid+"' " +
      " and studentmarklistlevelbaseds.department_id ='"+req.user.department+"' "+
      " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
      " and levelbasedprogresses.is_confirm_teacher = 'Yes'"+
      " and studentmarklistlevelbaseds.is_confirm_department ='No'"
      );
      const [classinfo,metaclassinfo] = await sequelize.query(
        "select * from classindepts inner join batches on batches.batch_id = classindepts.batch_id "+
        " inner join occupations on occupations.occupation_id = classindepts.department_id "+
        " inner join departments on occupations.department_id = departments.department_id "+
        " where occupations.occupation_id = '"+deptid+"' and batches.batch_id='"+batchid+"' and classindepts.class_id='"+req.params.classid+"'");
       const coourseinfo =await NGOCourse.findOne({where:{course_id:courseid}})
      res.render('showsinglecoursegradereport',{
        marklist:marklist,
        programtag:programtag,
        deptid:req.user.department,
        batchid:batchid,
        classid:req.params.classid,
        courseid:courseid,
        classinfo:classinfo,
        coourseinfo:coourseinfo
    })
}else if(programtag == "industry"){
    const [marklist, metaclasslist] = await sequelize.query(
      "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
      " inner join levelbasedprogresses on levelbasedprogresses.student_id = studentmarklistlevelbaseds.student_id "+
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
    " and studentmarklistlevelbaseds.class_id ='"+req.params.classid+"' " +
    " and studentmarklistlevelbaseds.department_id ='"+req.user.department+"' "+
    " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
    " and levelbasedprogresses.is_confirm_teacher = 'Yes'"+
    " and studentmarklistlevelbaseds.is_confirm_department ='No'"
      );
      const [classinfo,metaclassinfo] = await sequelize.query(
        "select * from classindepts inner join batches on batches.batch_id = classindepts.batch_id "+
        " inner join occupations on occupations.occupation_id = classindepts.department_id "+
        " inner join departments on occupations.department_id = departments.department_id "+
        " where occupations.occupation_id = '"+deptid+"' and batches.batch_id='"+batchid+"' and classindepts.class_id='"+req.params.classid+"'");
        const coourseinfo =await IndustryCourse.findOne({where:{course_id:courseid}})
         res.render('showsinglecoursegradereport',{
            marklist:marklist,
            programtag:programtag,
            deptid:req.user.department,
            batchid:batchid,
            classid:req.params.classid,
            courseid:courseid,
            classinfo:classinfo,
            coourseinfo:coourseinfo
        })
}



})
router.post('/reportproblemtoteacher/(:traineeid)',ensureAuthenticated,async function(req,res){
 
  const{batchid,courseid,classid,deptid,programtag,teacherid} = req.body;
  const [classinfo,metaclassinfo] = await sequelize.query(
    "select * from classindepts inner join batches on batches.batch_id = classindepts.batch_id "+
    " inner join occupations on occupations.occupation_id = classindepts.department_id "+
    " inner join departments on occupations.department_id = departments.department_id "+
    " where occupations.occupation_id = '"+deptid+"' and batches.batch_id='"+batchid+"' and classindepts.class_id='"+classid+"'");
   const occupation  = await Occupation.findAll({where:{department_id:req.user.department}})
  
  if(programtag =="level"){
    const [marklist, metaclasslist] = await sequelize.query(
      "SELECT * FROM studentmarklistlevelbaseds INNER JOIN levelbasedtrainees ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
      " inner join levelbasedprogresses on levelbasedprogresses.student_id = studentmarklistlevelbaseds.student_id "+
  " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
  " and studentmarklistlevelbaseds.class_id ='"+req.params.classid+"' " +
  " and studentmarklistlevelbaseds.department_id ='"+deptid+"' "+
  " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
  " and levelbasedprogresses.is_confirm_teacher = 'Yes'" +
  " and studentmarklistlevelbaseds.is_confirm_department ='No'"
    );
        const coourseinfo =await Course.findOne({where:{course_id:courseid}})
        LevelBasedProgress.update({is_confirm_teacher:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,teacher_id:teacherid,student_id:req.params.traineeid}}).then(()=>{
          StudentMarkListLevelBased.update({is_confirm_teacher:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,student_id:req.params.traineeid}}).then(alludt =>{
            res.render('showsinglecoursegradereport',{
              marklist:marklist,
              programtag:programtag,
              deptid:deptid,
              batchid:batchid,
              classid:req.params.classid,
              courseid:courseid,
              coourseinfo:coourseinfo,
              classinfo:classinfo,
              success_msg:'Successfully sent evaluation report problem to teacher for correction '
          })
          })
       
        }) 
  }else if(programtag =="ngo"){
    const [marklist, metaclasslist] = await sequelize.query(
      "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
      " inner join levelbasedprogresses on levelbasedprogresses.student_id = studentmarklistlevelbaseds.student_id "+
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"'"+
    " and studentmarklistlevelbaseds.class_id ='"+req.params.classid+"' " +
    " and studentmarklistlevelbaseds.department_id ='"+req.user.department+"' "+
    " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
    " and levelbasedprogresses.is_confirm_teacher = 'Yes'"+
    " and studentmarklistlevelbaseds.is_confirm_department ='No'"
    );
        const coourseinfo =await NGOCourse.findOne({where:{course_id:courseid}})
  
        LevelBasedProgress.update({is_confirm_teacher:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,teacher_id:teacherid,student_id:req.params.traineeid}}).then(()=>{
          StudentMarkListLevelBased.update({is_confirm_teacher:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,student_id:req.params.traineeid}}).then(alludt =>{
        
          res.render('showsinglecoursegradereport',{
            marklist:marklist,
            programtag:programtag,
            deptid:deptid,
            coourseinfo:coourseinfo,
            batchid:batchid,
            classid:req.params.classid,
            courseid:courseid,
            classinfo:classinfo,
            success_msg:'Successfully sent evaluation report problem to teacher for correction '
        })})
        }) 
  }else if(programtag == "industry"){
    const [marklist, metaclasslist] = await sequelize.query(
      "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
      " inner join levelbasedprogresses on levelbasedprogresses.student_id = studentmarklistlevelbaseds.student_id "+
      " where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
    " and studentmarklistlevelbaseds.class_id ='"+req.params.classid+"' " +
    " and studentmarklistlevelbaseds.department_id ='"+req.user.department+"' "+
    " and studentmarklistlevelbaseds.batch_id ='"+batchid+"' "+
    " and levelbasedprogresses.is_confirm_teacher = 'Yes'"+
    " and studentmarklistlevelbaseds.is_confirm_department ='No'"
      );
        const coourseinfo =await IndustryCourse.findOne({where:{course_id:courseid}})
     
        LevelBasedProgress.update({is_confirm_teacher:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,teacher_id:teacherid,student_id:req.params.traineeid}}).then(()=>{
          StudentMarkListLevelBased.update({is_confirm_teacher:'No'},{where:{batch_id:batchid,course_id:courseid,department_id:deptid,student_id:req.params.traineeid}}).then(alludt =>{
        
          res.render('showsinglecoursegradereport',{
            marklist:marklist,
            programtag:programtag,
            deptid:deptid,
            batchid:batchid,
            classid:req.params.classid,
            courseid:courseid,
            coourseinfo:coourseinfo,
            classinfo:classinfo,
            success_msg:'Successfully sent evaluation report problem to teacher for correction '
        })})
        }) 
        
  }
  
 
})
router.post('/confirmsingleclasscoursegradereporttoregistrar',ensureAuthenticated,async function(req,res){
  const {pTableData} =req.body ;
  const occupation  = await Occupation.findAll({where:{department_id:req.user.department}})
  
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
    is_confirm_department:"Yes",
    teacher_id:req.user.userid
 }
 StudentMarkListLevelBased.findOne({where:{student_id:item.student_id,course_id:item.course_id,class_id:item.class_id,department_id:item.department_id,batch_id:item.batch_id}}).then(student =>{
 if(student){

 StudentMarkListLevelBased.update({
   is_confirm_department:"Yes"},{where:{student_id:item.student_id,course_id:item.course_id,class_id:item.class_id, department_id:item.department_id,batch_id:item.batch_id}}) 

 }
 }).catch(error =>{
  errors.push({msg:'Please make sure your mark list is correct'})
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
module.exports = router;
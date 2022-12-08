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
router.post('/classlistbeforecourseteacher',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype,occupationname,tag} = req.body;
        const teacherlist = await StaffList.findAll({});
        var classlist ;
        var courselist;
        if(tag ==="level"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidlevel,
            department_id: occupationname,
            training_level:traininglevel,
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationname,
          training_level:traininglevel }})
        }
        else if (tag ==="ngo"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidlevel,
            department_id: occupationname,
           
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationname,
          }})
        }else if(tag ==="industry"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidlevel,
            department_id: occupationname,
           
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationname,
          }})
        }
     
        const occinfo =await Occupation.findOne({where:{occupation_id:occupationname}});
        const batchinfo =await Batch.findOne({where:{batch_id:programidlevel}});
  res.render('classlistbeforecourseteacher',{
    programidlevel:programidlevel,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
   occupationname:occupationname
  }) 
})
router.post('/classlistbeforecourseteachern',ensureAuthenticated,async function(req,res){
  const{programidleveln,traininglevel,programtype,occupationnamen,tag} = req.body;
        const teacherlist = await StaffList.findAll({});
        var classlist ;
        var courselist;
        if(tag ==="level"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveln,
            department_id: occupationnamen,
            training_level:traininglevel,
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationname,
          training_level:traininglevel }})
        }
        else if (tag ==="ngo"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveln,
            department_id: occupationnamen,
           
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationname,
          }})
        }else if(tag ==="industry"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveln,
            department_id: occupationnamen,
           
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationnamen,
          }})
        }
     
        const occinfo =await Occupation.findOne({where:{occupation_id:occupationnamen}});
        const batchinfo =await Batch.findOne({where:{batch_id:programidleveln}});
  res.render('classlistbeforecourseteacher',{
    programidlevel:programidleveln,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
   occupationname:occupationnamen
  }) 
})
router.post('/classlistbeforecourseteacheri',ensureAuthenticated,async function(req,res){
  const{programidleveli,traininglevel,programtype,occupationnamei,tag} = req.body;
        const teacherlist = await StaffList.findAll({});
        var classlist ;
        var courselist;
        if(tag ==="level"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveli,
            department_id: occupationnamei,
            training_level:traininglevel,
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationname,
          training_level:traininglevel }})
        }
        else if (tag ==="ngo"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveli,
            department_id: occupationnamei,
           
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationnamei,
          }})
        }else if(tag ==="industry"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveli,
            department_id: occupationnamei,
           
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: occupationnamei,
          }})
        }
     
        const occinfo =await Occupation.findOne({where:{occupation_id:occupationnamei}});
        const batchinfo =await Batch.findOne({where:{batch_id:programidleveli}});
  res.render('classlistbeforecourseteacher',{
    programidlevel:programidleveli,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
   occupationname:occupationnamei
  }) 
})
router.post('/coursetoteacherlevelbased/(:classname)',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findOne({where:{
                              class_id:req.params.classname,
                              batch_id:programidlevel,
                              department_id: occupationname,
                              training_level:traininglevel,
                              training_type:programtype}})
        const courselist = await Course.findAll({where:{
                            
                            department_id: occupationname,
                            training_level:traininglevel }})
        const [courseteacher,ctmeta] = await sequelize.query(
          "select * from courses inner join courseteacherclasses on"+
        "  courses.course_id = courseteacherclasses.course_id inner join stafflists on "+
        " stafflists.staff_id = courseteacherclasses.teacher_id where courses.department_id='"+ occupationname+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
        );
        console.log(courseteacher);
        const occinfo =await Occupation.findOne({where:{occupation_id:occupationname}});
        const batchinfo =await Batch.findOne({where:{batch_id:programidlevel}});
  res.render('courseteacher',{
   programid:programidlevel,
   classname:req.params.classname,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
   dpt:occupationname,
   courseteacher:courseteacher
  }) 
})

router.post('/coursetoteacherindustrybased',ensureAuthenticated,async function(req,res){
  const{programidlevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidlevel,
                              department_id:occupationname,
                              training_type:programtype}})
        const courselist = await IndustryCourse.findAll({where:{
                            batch_id:programidlevel,
                            department_id:occupationname,
                             }})
                             const occinfo =await Occupation.findOne({where:{occupation_id:occupationname}});
                             const batchinfo = await Batch.findOne({where:{batch_id:programidlevel}});
  res.render('courseteacher',{
   programid:programid,
   teacherlist:teacherlist,
   traininglevel:'',
 dpt:occupationname,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
  }) 
})
router.post('/coursetoteacherngobased',ensureAuthenticated,async function(req,res){
  const{programidlevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidlevel,
                              department_id:occupationname,
                           
                              training_type:programtype}})
        const courselist = await NGOCourse.findAll({where:{
                            batch_id:programidlevel,
                            department_id:occupationname,
                            }})
                            const occinfo = await Occupation.findOne({where:{occupation_id:occupationname}});
                            const batchinfo = await Batch.findOne({where:{batch_id:programidlevel}});
  res.render('courseteacher',{
   programid:programid,
   teacherlist:teacherlist,
   traininglevel:'',
dpt:occupationname,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
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
       
                              const [occcdpt,om] = await sequelize.query(
                                "select * from occupations inner join departments on departments.department_id=occupations.department_id"+
                                " where departments.department_id='"+req.user.department +"'"
                              )
  res.render('classrepresentative',{
   programid:programidlevel,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
 occcdpt:occcdpt
  }) 
})

router.post('/assignclassrepresentativengo',ensureAuthenticated,async function(req,res){
  const{programidn,traininglevel,programtype,occupationnamen} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidn,
                              department_id: occupationnamen,
                            
                              training_type:programtype}})
       const [occcdpt,om] = await sequelize.query(
         "select * from occupations inner join departments on departments.department_id=occupations.department_id"+
         " where departments.department_id='"+req.user.department +"'"
       )

  res.render('classrepresentative',{
   programid:programidn,
   occcdpt:occcdpt,
   teacherlist:teacherlist,
   traininglevel:'',
   programtype:programtype,
   classlist:classlist,

  }) 
})
router.post('/assignclassrepresentativeindustry',ensureAuthenticated,async function(req,res){
  const{programidi,traininglevel,programtype,occupationnamei} = req.body;
        const teacherlist = await StaffList.findAll({where:{isteacher:'Yes'}})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidi,
                              department_id: occupationnamei,
                           
                              training_type:programtype}})
       
                              const [occcdpt,om] = await sequelize.query(
                                "select * from occupations inner join departments on departments.department_id=occupations.department_id"+
                                " where departments.department_id='"+req.user.department +"'"
                              )
  res.render('classrepresentative',{
   programid:programidi,
   teacherlist:teacherlist,
   traininglevel:'',
   programtype:programtype,
   classlist:classlist,
 occcdpt:occcdpt
  }) 
})
router.post('/saveclassteachercourse/(:courseid)',ensureAuthenticated,async function(req,res){
    const {programid,dpt,classname,traininglevel,programtype,teachername,enddate,startdate} =req.body ;
   
    let errors=[];
     const [courseteacher,ctmeta]  = await sequelize.query(
      "select courses.course_id,stafflists.staff_f_name,stafflists.staff_m_name,stafflists.staff_l_name from courses inner join courseteacherclasses on"+
    "  courses.course_id = courseteacherclasses.course_id inner join stafflists on "+
    " stafflists.staff_id = courseteacherclasses.teacher_id where courses.department_id='"+ dpt+"' and courseteacherclasses.class_id='"+classname+"'"
    );
     
    const teacherlist = await StaffList.findAll({})
    const classlist = await ClassInDept.findOne({where:{
                          class_id:classname,
                          batch_id:programid,
                          department_id: dpt,
                          training_level:traininglevel,
                          training_type:programtype}})
    const courselist = await Course.findAll({where:{
                      
                        department_id: dpt,
                        training_level:traininglevel }})
    const occinfo =await Occupation.findOne({where:{occupation_id:dpt}});
    const batchinfo =await Batch.findOne({where:{batch_id:programid}});
    if(!programid || !dpt || !classname || !teachername || !enddate || !startdate){
      errors.push({msg:'Please Add All Required Fields'})
    }
    if( teachername =="0"){
      errors.push({msg:'Please Select Teacher Name'})
    }
    if(errors.length >0){
      res.render('courseteacher',{errors,
        programid:programid,
        classname:classname,
        teacherlist:teacherlist,
        traininglevel:traininglevel,
        programtype:programtype,
        classlist:classlist,
        courselist:courselist,
        occinfo:occinfo,
        batchinfo:batchinfo,
        dpt:dpt,
        courseteacher:courseteacher
      })
    }
    else{
      const courseteachercomData={
        batch_id:programid,
      course_id : req.params.courseid,
      teacher_id: teachername,
      level :traininglevel,
      department_id :dpt,
      class_id:classname,
      program_type:programtype,
      startdate:startdate,
      enddate:enddate
      }
      CourseTeacherClass.findOne({where:{class_id:classname,course_id:req.params.courseid,department_id:dpt,batch_id:programid}}).then(data =>{
        console.log("fffffffffffff");
            if(!data)
            {
              CourseTeacherClass.create(courseteachercomData).then(classteachercourse =>{
                res.render('courseteacher',{programid:programid,
                  classname:classname,
                  teacherlist:teacherlist,
                  traininglevel:traininglevel,
                  programtype:programtype,
                  classlist:classlist,
                  courselist:courselist,
                  occinfo:occinfo,
                  batchinfo:batchinfo,
                  courseteacher:courseteacher,
                  dpt:dpt,success_msg:"Successfully Assign Course To Teacher"})
              }).catch(error =>{
                res.render('courseteacher',{programid:programid,
                  classname:classname,
                  teacherlist:teacherlist,
                  traininglevel:traininglevel,
                  programtype:programtype,
                  classlist:classlist,
                  courseteacher:courseteacher,
                  courselist:courselist,
                  occinfo:occinfo,
                  batchinfo:batchinfo,
                  dpt:dpt,error_msg:"Error While Assign Teacher To Course"})
   
              })
                
            }
          
           else {
              CourseTeacherClass.update({teacher_id:teachername},{where:{class_id:classname,course_id:req.params.courseid,department_id:dpt,batch_id:programid}}).then(assigned =>{
                res.render('courseteacher',{programid:programid,
                  classname:classname,
                  teacherlist:teacherlist,
                  traininglevel:traininglevel,
                  programtype:programtype,
                  classlist:classlist,
                  courselist:courselist,
                  occinfo:occinfo,
                  courseteacher:courseteacher,
                  batchinfo:batchinfo,
                  dpt:dpt,success_msg:"Successfully Update And Assign Course To Teacher"})
              }).catch(err =>{
                res.render('courseteacher',{programid:programid,
                  classname:classname,
                  teacherlist:teacherlist,
                  traininglevel:traininglevel,
                  programtype:programtype,
                  courseteacher:courseteacher,
                  classlist:classlist,
                  courselist:courselist,
                  occinfo:occinfo,
                  batchinfo:batchinfo,
                  dpt:dpt,error_msg:"Error While Update And  Assign Teacher To Course"})
   
              })
            }
         
       }).catch(error =>{
           console.log(error)
       })
    
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

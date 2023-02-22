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
const Notification = db.notifications;
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
            department_id: req.user.department,
           
            training_type:programtype}})
 courselist = await NGOCourse.findAll({where:{
        
          department_id:req.user.department,
          }})
        }else if(tag ==="industry"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidlevel,
            department_id: req.user.department,
           
            training_type:programtype}})
 courselist = await IndustryCourse.findAll({where:{
        
          department_id: req.user.department,
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
   tag:tag,
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
            department_id: req.user.department,
            training_level:traininglevel,
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: req.user.department,
          training_level:traininglevel }})
        }
        else if (tag ==="ngo"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveln,
            department_id: req.user.department,
           
            training_type:programtype}})
 courselist = await NGOCourse.findAll({where:{
        
          department_id: req.user.department,
          }})
        }else if(tag ==="industry"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveln,
            department_id: req.user.department,
           
            training_type:programtype}})
 courselist = await IndustryCourse.findAll({where:{
        
          department_id: req.user.department,
          }})
        }
     
        const occinfo =await Department.findOne({where:{department_id:req.user.department}});
        const batchinfo =await Batch.findOne({where:{batch_id:programidleveln}});
  res.render('classlistbeforecourseteacher',{
    programidlevel:programidleveln,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   tag:tag,
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
            department_id: req.user.department,
            training_level:traininglevel,
            training_type:programtype}})
 courselist = await Course.findAll({where:{
        
          department_id: req.user.department,
          training_level:traininglevel }})
        }
        else if (tag ==="ngo"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveli,
            department_id: req.user.department,
           
            training_type:programtype}})
 courselist = await NGOCourse.findAll({where:{
        
          department_id: req.user.department,
          }})
        }else if(tag ==="industry"){
           classlist = await ClassInDept.findAll({where:{
            batch_id:programidleveli,
            department_id: req.user.department,
           
            training_type:programtype}})
 courselist = await IndustryCourse.findAll({where:{
        
          department_id: req.user.department,
          }})
        }
     
        const occinfo =await Department.findOne({where:{department_id:req.user.department}});
        const batchinfo =await Batch.findOne({where:{batch_id:programidleveli}});
  res.render('classlistbeforecourseteacher',{
    programidlevel:programidleveli,
   teacherlist:teacherlist,
   traininglevel:traininglevel,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   tag:tag,
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
          "select * from courseteacherclasses  inner join courses on"+
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
   tag:"level",
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
   dpt:occupationname,
   courseteacher:courseteacher
  }) 
})

router.post('/coursetoteacherindustrybased/(:classid)',ensureAuthenticated,async function(req,res){
  const{programidlevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findOne({where:{
                              batch_id:programidlevel,
                              class_id:req.params.classid,
                              department_id:req.user.department,
                              training_type:programtype}})
        const courselist = await IndustryCourse.findAll({where:{
                            batch_id:programidlevel,
                            department_id:req.user.department,
                             }})
                             const occinfo =await Department.findOne({where:{department_id:req.user.department}});
                             const batchinfo = await Batch.findOne({where:{batch_id:programidlevel}});
 
                             const [courseteacher,ctmeta] = await sequelize.query(
                              "select * from courseteacherclasses  inner join industrycourses on"+
                            "  industrycourses.course_id = courseteacherclasses.course_id inner join stafflists on "+
                            " stafflists.staff_id = courseteacherclasses.teacher_id where industrycourses.department_id='"+ req.user.department+"' and courseteacherclasses.class_id='"+req.params.classid+"' "
                            );
                             res.render('courseteacher',{
   programid:programidlevel,
   teacherlist:teacherlist,
   courseteacher:courseteacher,
   traininglevel:'',
   tag:"industry",
   classname:req.params.classid,
 dpt:req.user.department,
   programtype:programtype,
   classlist:classlist,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
  }) 
})
router.post('/coursetoteacherngobased/(:classid)',ensureAuthenticated,async function(req,res){
  const{programidlevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findOne({where:{
                              batch_id:programidlevel,
                              department_id:req.user.department,
                              class_id:req.params.classid,
                              training_type:programtype}})
        const courselist = await NGOCourse.findAll({where:{
                            batch_id:programidlevel,
                            department_id:req.user.department,
                            }})
                            const [courseteacher,ctmeta] = await sequelize.query(
                              "select * from courseteacherclasses  inner join ngocourses on"+
                            "  ngocourses.course_id = courseteacherclasses.course_id inner join stafflists on "+
                            " stafflists.staff_id = courseteacherclasses.teacher_id where ngocourses.department_id='"+ req.user.department+"' and courseteacherclasses.class_id='"+req.params.classid+"' "
                            );
                            const occinfo = await Department.findOne({where:{department_id:req.user.department}});
                            const batchinfo = await Batch.findOne({where:{batch_id:programidlevel}});
  res.render('courseteacher',{
   programid:programidlevel,
   courseteacher:courseteacher,
   teacherlist:teacherlist,
   traininglevel:'',
   tag:"ngo",
dpt:req.user.department,
   programtype:programtype,
   classlist:classlist,
   classname:req.params.classid,
   courselist:courselist,
   occinfo:occinfo,
   batchinfo:batchinfo,
  }) 
})
router.post('/assignclassrepresentativelevel',ensureAuthenticated,async function(req,res){
  const{programidlevel,traininglevel,programtype,occupationname} = req.body;
        const teacherlist = await StaffList.findAll({})
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
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidn,
                              department_id: req.user.department,
                            
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
        const teacherlist = await StaffList.findAll({})
        const classlist = await ClassInDept.findAll({where:{
                              batch_id:programidi,
                              department_id: req.user.department,
                           
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
    const {programid,dpt,classname,traininglevel,tag,programtype,teachername,enddate,startdate} =req.body ;
   
    let errors=[];
  
    var courselist,occinfo,qry;
    var courseinfo;
    const teacherlist = await StaffList.findAll({})
    const v1options = {
      node: [0x01, 0x23],
      clockseq: 0x1234,
      msecs: new Date('2011-11-01').getTime(),
      nsecs: 5678,
    };
   
    nid = uuidv4(v1options)
    const depinfo  = await Department.findOne({where:{department_id:req.user.department}})
    const classlist = await ClassInDept.findOne({where:{
                          class_id:classname,
                          batch_id:programid,
                          department_id: dpt,
                         
                          training_type:programtype}});
                          if(tag==="level"){
                            qry  = 
                              "select startdate,enddate,courses.course_id,stafflists.staff_f_name,stafflists.staff_m_name,stafflists.staff_l_name from courseteacherclasses  inner join courses on"+
                            "  courses.course_id = courseteacherclasses.course_id inner join stafflists on "+
                            " stafflists.staff_id = courseteacherclasses.teacher_id where courses.department_id='"+ dpt+"' and courseteacherclasses.class_id='"+classname+"'"
                            ;
                            courseinfo = await Course.findOne({where:{course_id:req.params.courseid}})
                            courselist = await Course.findAll({where:{
                              training_level:traininglevel,
                              department_id: dpt,
                               }})
                              occinfo =await Occupation.findOne({where:{occupation_id:dpt}});
                          }else if(tag==="ngo"){
                            qry  =
                              "select startdate,enddate,ngocourses.course_id,stafflists.staff_f_name,stafflists.staff_m_name,stafflists.staff_l_name from courseteacherclasses  inner join ngocourses on"+
                            "  ngocourses.course_id = courseteacherclasses.course_id inner join stafflists on "+
                            " stafflists.staff_id = courseteacherclasses.teacher_id where ngocourses.department_id='"+ dpt+"' and courseteacherclasses.class_id='"+classname+"'"
                            ;
                            courseinfo = await NGOCourse.findOne({where:{course_id:req.params.courseid}})
                 
                            courselist = await NGOCourse.findAll({where:{
                      
                              department_id: dpt,
                              batch_id:programid }})
                              occinfo =await Department.findOne({where:{department_id:dpt}});
                          }else if(tag==="industry"){
                          qry =
                              "select industrycourses.course_id,stafflists.staff_f_name,stafflists.staff_m_name,stafflists.staff_l_name,startdate,enddate from courseteacherclasses  inner join industrycourses on"+
                            "  industrycourses.course_id = courseteacherclasses.course_id inner join stafflists on "+
                            " stafflists.staff_id = courseteacherclasses.teacher_id where industrycourses.department_id='"+ dpt+"' and courseteacherclasses.class_id='"+classname+"'"
                            ;
                            courseinfo = await IndustryCourse.findOne({where:{course_id:req.params.courseid}})
                 
                              courselist = await IndustryCourse.findAll({where:{
                      
                              department_id: dpt,
                              batch_id:programid }})
           occinfo =await Department.findOne({where:{department_id:dpt}});
                          }
          const [courseteacher,ctmeta]  = await sequelize.query(qry);
                       
    const batchinfo =await Batch.findOne({where:{batch_id:programid}});
    if(!programid || !dpt || !classname || !teachername || !enddate || !startdate){
      errors.push({msg:'Please Add All Required Fields'})
    }
    if( teachername =="0"){
      errors.push({msg:'Please Select Trainer Name'})
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
        tag:tag,
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
              
                const note ={
                  note_id:nid,
                  notefrom:depinfo.department_name+"Department",
                  noteto:teachername,
                  is_read:"No",
                  note:"You Are Assigned For "+
                  " Batch Name "+ batchinfo.batch_name+
                  " Department Name "+depinfo.department_name+
                  " With Section Name " + classlist.class_name+ 
                  " UOCs Name "+courseinfo.course_name+
                  ". You Can Manage Trainees UOC Evaluation Now!"
                }
                Notification.create(note).then(()=>{
                  res.render('courseteacher',{programid:programid,
                    classname:classname,
                    teacherlist:teacherlist,
                    traininglevel:traininglevel,
                    programtype:programtype,
                    classlist:classlist,
                    courselist:courselist,
                    occinfo:occinfo,
                    tag:tag,
                    batchinfo:batchinfo,
                    courseteacher:courseteacher,
                    dpt:dpt,success_msg:"Successfully Assign UOCs To Trainer"})
               
                })
              
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
                  tag:tag,
                  batchinfo:batchinfo,
                  dpt:dpt,error_msg:"Error While Assign Trainer To UOCs"})
   
              })
                
            }
          
           else {
              CourseTeacherClass.update({teacher_id:teachername},{where:{class_id:classname,course_id:req.params.courseid,department_id:dpt,batch_id:programid}}).then(assigned =>{
                const note ={
                  note_id:nid,
                  notefrom:depinfo.department_name+"Department",
                  noteto:teachername,
                  is_read:"No",
                  note:"You Are Assigned As New Trainer For "+
                  " Batch Name "+ batchinfo.batch_name+
                  " Department Name "+depinfo.department_name+
                  " With Section Name " + classlist.class_name+ 
                  " UOCs Name "+courseinfo.course_name+
                  ". You Can Manage Trainees UOC Evaluation Now!"
                }
                Notification.create(note).then(()=>{
                res.render('courseteacher',{programid:programid,
                  classname:classname,
                  teacherlist:teacherlist,
                  traininglevel:traininglevel,
                  programtype:programtype,
                  classlist:classlist,
                  courselist:courselist,
                  occinfo:occinfo,
                  tag:tag,
                  courseteacher:courseteacher,
                  batchinfo:batchinfo,
                  dpt:dpt,success_msg:"Successfully Update And Assign UOC To Trainer"})
                 })
              }).catch(err =>{
                res.render('courseteacher',{programid:programid,
                  classname:classname,
                  teacherlist:teacherlist,
                  traininglevel:traininglevel,
                  programtype:programtype,
                  courseteacher:courseteacher,
                  classlist:classlist,
                  courselist:courselist,
                  tag:tag,
                  occinfo:occinfo,
                  batchinfo:batchinfo,
                  dpt:dpt,error_msg:"Error While Update And  Assign Trainer To UOC"})
   
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
           const v1options = {
            node: [0x01, 0x23],
            clockseq: 0x1234,
            msecs: new Date('2011-11-01').getTime(),
            nsecs: 5678,
          };
        
          nid = uuidv4(v1options)
           ClassInDept.update({rep_teacher_id:teacherid},{where:{class_id:classid}}).then(()=>{
             
            Department.findOne({where:{department_id:req.user.department}}).then(dep =>{
              const depnote =dep
              ClassInDept.findOne({where:{class_id:classid}}).then(cls =>{
                const cl =cls 
                Batch.findOne({where:{batch_id:cl.batch_id}}).then(ba =>{
                  const batchinfo = ba
                  const note ={
                    note_id:nid,
                    notefrom:depnote.department_name+"Department",
                    noteto:teacherid,
                    is_read:"No",
                    note:"You Are Assigned As Section Representative For "+
                    " Batch Name "+ batchinfo.batch_name+
                    " Department Name "+depnote.department_name+
                    " With Section Name " + cl.class_name+ 
                    ". You Can Manage Trainees Attendance  Now!"
                  }
                  Notification.create(note)
                })
              })
            
            })
            
           })
         
        
          });
      
        
        
         
  
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
module.exports = router;

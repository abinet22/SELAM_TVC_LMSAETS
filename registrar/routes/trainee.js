const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const LevelBasedTrainee = db.levelbasedtrainees;
const NGOBasedTrainee = db.ngobasedtrainees;
const IndustryBasedTrainee = db.industrybasedtrainees;
const Occupation  = db.occupations;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const Batch =db.batches;
const User = db.users;
const ClassInDept = db.classindepts;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/alltraineelist',async function(req,res){
    const department = await Occupation.findAll({});
        const [levelbased, metalevelbaseddata] = await sequelize.query(
          "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id "
        );
        const [ngobased, metangobaseddata] = await sequelize.query(
          "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id "
        );
        const [industry, metaindustrybaseddata] = await sequelize.query(
          "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id "
        );
        res.render('alltraineelist',{
          levelbased:levelbased,
          ngobased:ngobased,
          industrybased:industry,
          department:department
      })
  })
  router.post('/showgraduatetranieegrade',ensureAuthenticated,async function(req,res){
    const{level,traineeid,programidbatch,deptt,programtag} = req.body;
    
        const [department,dptmeta] = await sequelize.query(
          " select * from occupations inner join departments on"+
           " departments.department_id=occupations.department_id inner join sectorlists on"+
           " sectorlists.sector_id = departments.training_id where occupations.occupation_id='"+deptt+"' "
        )
        console.log("deptttttttttttttt")
        console.log(department)
       const batch = await Batch.findOne({where:{batch_id:programidbatch}});
      if(programtag =="level"){
        const [courselist,metacourselist] = await sequelize.query(
          "select * from courses where department_id='"+deptt+"' and training_level='"+level+"'");
          const student = await LevelBasedTrainee.findOne({where:{student_unique_id:traineeid,department_id:deptt,batch_id:programidbatch,current_level:level}});
          const [marklist, metaclasslist] = await sequelize.query(
              "SELECT * FROM levelbasedtrainees  INNER JOIN studentmarklistlevelbaseds "+
              " ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
              "inner join courses on courses.course_id = studentmarklistlevelbaseds.course_id "+
          " where levelbasedtrainees.student_unique_id ='"+traineeid+"' and " +
          " studentmarklistlevelbaseds.is_confirm_registrar='Yes'  "+
          " and levelbasedtrainees.current_level ='"+level+"'"+ 
          " and studentmarklistlevelbaseds.department_id ='"+deptt+"' "+
         " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
          "  and courses.training_level='"+level+"'" +
          "  and courses.department_id='"+deptt+"'" 
            );
            console.log("wtffffffffffff")
            console.log(student)
            res.render('singlestudentdata',{
              marklist:marklist,
              programtag:programtag,
              deptid:deptt,
              batchid:programidbatch,
              classid:'',
              student:student,
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
          const student = await NGOBasedTrainee.findAll({where:{student_unique_id:traineeid,department_id:deptt,batch_id:programidbatch}});
        
          const [marklist, metaclasslist] = await sequelize.query(
              "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees"+
              "  ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
            " where  ngobasedtrainees.student_unique_id ='"+traineeid+"' and " +
            " studentmarklistlevelbaseds.is_confirm_registrar='Yes'  "+
            " and studentmarklistlevelbaseds.department_id ='"+deptt+"' "+
            " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
            );
            res.render('singlestudentdata',{
              marklist:marklist,
              programtag:programtag,
              deptid:deptt,
              batchid:programidbatch,
              classid:'',
              student:student,
              courseid:'',
              department:department,
              traineeid:traineeid,
              courselist:courselist,
              batch:batch,
              classinfo:'',
              level:level
          })
      }else if(programtag == "industry"){
        const [courselist,metacourselist] = await sequelize.query(
            "select * from industrycourses where batch_id='"+programidbatch+"'");
            const student = await IndustryBasedTrainee.findAll({where:{student_unique_id:traineeid,department_id:deptt,batch_id:programidbatch}});
        
          const [marklist, metaclasslist] = await sequelize.query(
            "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees"+
            " ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
             " where  industrybasedtrainees.student_unique_id ='"+traineeid+"'" +
          " and studentmarklistlevelbaseds.department_id ='"+deptt+"' and "+
          " studentmarklistlevelbaseds.is_confirm_registrar='Yes'  "+
          " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
            );
              res.render('singlestudentdata',{
                  marklist:marklist,
                  programtag:programtag,
                  deptid:deptt,
                  batchid:programidbatch,
                  classid:'',
                  student:student,
                  department:department,
                  batch:batch,
                  traineeid:traineeid,
                  courselist:courselist,
                  classinfo:'',
                  level:level
              })
      }
      
    })
router.post('/alllevelbasedtrainee', ensureAuthenticated,async function(req,res){
    const {programidlevel,occlevel} = req.body;
    const applicantlist = await LevelBasedTrainee.findAll({where:{batch_id:programidlevel,department_id:occlevel}});
    const department = await Occupation.findAll({})
    res.render('alltraineeregisteredlist',{
        applicantlist,applicantlist,
        department:department,
        tag:"level"
   
    })
})

router.post('/allngobasedtrainee', ensureAuthenticated,async function(req,res){
    const {programidngo,occngo} = req.body;
    const applicantlist = await NGOBasedTrainee.findAll({where:{batch_id:programidngo,department_id:occngo}});
  
    const department = await Occupation.findAll({})
    res.render('alltraineeregisteredlist',{
        applicantlist,applicantlist,
        department:department,
        tag:"ngo"
    })
})
router.post('/allindustrybasedtrainee', ensureAuthenticated,async function(req,res){
    const {programidind,occind} = req.body;
    const applicantlist = await IndustryBasedTrainee.findAll({where:{batch_id:programidind,department_id:occind}});
  
    const department = await Occupation.findAll({})
    res.render('alltraineeregisteredlist',{
        applicantlist,applicantlist,
        department:department,
        tag:"industry"
    
    })
})
router.post('/printgraduatescertificate',ensureAuthenticated,async function(req,res){
  const{level,traineeid,programidbatch,dept,programtag} = req.body;
  const batch = await Batch.findOne({where:{batch_id:programidbatch}});
  if(programtag =="level"){
    const occ = await Occupation.findOne({where:{occupation_id:dept}})
    console.log(occ)
    const traineegradute = await LevelBasedTrainee.findOne({where:{is_graduated:'Yes',student_unique_id:traineeid,current_level:level,department_id:dept,batch_id:programidbatch}});
    res.render('printcertificate',{batch:batch,traineegradute:traineegradute,dept:occ});
  }else if(programtag =="ngo"){
    const occ =await Department.findOne({where:{department_id:dept}})
    const traineegradute = await NGOBasedTrainee.findOne({where:{is_graduated:'Yes',student_unique_id:traineeid,department_id:dept,batch_id:programidbatch}});
    
    res.render('printcertificate',{batch:batch,traineegradute:traineegradute,dept:occ});
  }else if(programtag == "industry"){
    const occ =await Department.findOne({where:{department_id:dept}})
    const traineegradute = await IndustryBasedTrainee.findOne({where:{is_graduated:'Yes',student_unique_id:traineeid,department_id:dept,batch_id:programidbatch}});
    
    res.render('printcertificate',{batch:batch,traineegradute:traineegradute,dept:occ});
  }
 
})

router.post('/printgraduatesgradereport',ensureAuthenticated,async function(req,res){
    const{level,traineeid,programidbatch,dept,programtag} = req.body;
    const [courselist,metacourselist] = await sequelize.query(
      "select * from industrycourses where batch_id='"+programidbatch+"'");
      
      console.log("cccccccccccccccccccccc");
     
    // const department = await Occupation.findOne({where:{occupation_id:dept}});
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
        const [department,dptmeta] = await sequelize.query(
          " select * from occupations inner join departments on"+
           " departments.department_id=occupations.department_id inner join sectorlists on"+
           " sectorlists.sector_id = departments.training_id "+
           
           " where occupations.occupation_id='"+dept+"' "
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
              sectorlist:department
          })
      }else if(programtag =="ngo"){
        const [courselist,metacourselist] = await sequelize.query(
          "select * from ngocourses where batch_id='"+programidbatch+"' and department_id='"+dept+"'");
         
          const [marklist, metaclasslist] = await sequelize.query(
              "SELECT * FROM studentmarklistlevelbaseds INNER JOIN ngobasedtrainees ON ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
              "inner join ngocourses on ngocourses.course_id = studentmarklistlevelbaseds.course_id "+
            " where  ngobasedtrainees.student_unique_id ='"+traineeid+"'" +
            " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
            " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "
            );
            const [department,dptmeta] = await sequelize.query(
              " select * from departments inner  join sectorlists on"+
               " sectorlists.sector_id = departments.training_id where departments.department_id='"+dept+"' "
            );
            res.render('printgradereport',{
              marklist:marklist,
              programtag:programtag,
              deptid:dept,
              batchid:programidbatch,
              classid:'',
              courseid:'',
              sectorlist:department,
              department:department,
              traineeid:traineeid,
              courselist:marklist,
              batch:batch,
              classinfo:'',
              level:''
          })
      }else if(programtag == "industry"){
        const [courselist,metacourselist] = await sequelize.query(
            "select * from industrycourses where batch_id='"+programidbatch+"' and department_id='"+dept+"'");
            const [department,dptmeta] = await sequelize.query(
              " select * from departments inner  join sectorlists on"+
               " sectorlists.sector_id = departments.training_id where departments.department_id='"+dept+"' "
            );
          const [marklist, metaclasslist] = await sequelize.query(
            "  SELECT * FROM studentmarklistlevelbaseds INNER JOIN industrybasedtrainees ON industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+ 
            "inner join industrycourses on industrycourses.course_id = studentmarklistlevelbaseds.course_id "+ 
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
                  sectorlist:department,
                  traineeid:traineeid,
                  courselist:marklist,
                  classinfo:'',
                  level:''
              })
      }
   
})

module.exports = router;
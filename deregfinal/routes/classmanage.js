const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Notification = db.notifications;
   
const Course = db.courses;
const User = db.users;
const sequelize = db.sequelize ;
const Occupation = db.occupations;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Batch = db.batches;
const ClassInDept = db.classindepts;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addnewclass',ensureAuthenticated, async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where is_open='Yes' and is_confirm='Yes'"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where is_open='Yes' and is_confirm='Yes'"
      );
      const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes' and is_confirm='Yes'"
      );
    const occupation = await Occupation.findAll({});
    const department = await Department.findAll({});
    res.render('addnewclass',{
        department:department,
        levelbased:levelbased,
        occupation:occupation,
        ngobased:ngobased,
        industrybased:industrybased
    })

})

router.post('/addnewclasslevelbased',ensureAuthenticated,async function(req,res){
    const{batchid,programtype,deptid,level,criteriango, criteriango2,criteriai,} = req.body;
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
      );
    const department = await Department.findAll({});
    const occupation = await Occupation.findAll({});
  
    let errors = [];
    if(batchid =="0" ||  deptid=="0" ){
  errors.push({msg:'please select required fileds'})
    }
    if(errors.length >0 ){
        res.render('addnewclass',{
            department:department,
            occupation:occupation,
            levelbased:levelbased,
            ngobased:ngobased,
            industrybased:industrybased,
            error_msg:'Please select all required fields'
        })
    }
    else{
        var classname ;
        var cl = "";
        if(criteriango){
          classname = JSON.parse(JSON.stringify(criteriango))
        }else if(criteriango2){
          classname = JSON.parse(JSON.stringify(criteriango2))
        }else if(criteriai){
          classname = JSON.parse(JSON.stringify(criteriai))
        }
        var classnamelist = []
        classnamelist = JSON.parse(classname)
        if(classnamelist.length >0){
          for(var i = 0; i < classnamelist.length ; i++)
          {
            const v1options = {
              node: [0x01, 0x23],
              clockseq: 0x1234,
              msecs: new Date('2011-11-01').getTime(),
              nsecs: 5678,
            };
            classid = uuidv4(v1options);
            var clsnm = classnamelist[i];
            cl += clsnm +",";
            var classData = {
                class_id:classid,
                batch_id:batchid,
                training_type:programtype,
                training_level:level,
                department_id:deptid,
                class_name:clsnm,
                rep_teacher_id:"",
                teacher_name: ""
              };
         
            ClassInDept.create(classData).then(classdt =>{
                if(!classdt){
    
                }
            }).catch(error =>{
    
            })
      
      
          }
          const v1options = {
            node: [0x01, 0x23],
            clockseq: 0x1234,
            msecs: new Date('2011-11-01').getTime(),
            nsecs: 5678,
          };
        
          nid = uuidv4(v1options)
           var depnote;
           var info =""
          if(level){
           depnote =await Occupation.findOne({where:{occupation_id:deptid}})
           info += depnote.occupation_name +""+level 
          }else{
            depnote =await Department.findOne({where:{department_id:deptid}})
            info += depnote.department_name+" Short Term"
          }
          const batchnote = await Batch.findOne({where:{batch_id:batchid}})
          const note ={
            note_id:nid,
            notefrom:"Registrar Data Encoder",
            noteto:depnote.department_id,
            is_read:"No",
            note:"New Section Are Created for "+batchnote.batch_name+
            " With A Name "+cl+
            " For " +info+
            " .You Can Manage Trainees Now!"
          }
          Notification.create(note).then(()=>{
            res.render('addnewclass',{
              department:department,
              levelbased:levelbased,
              occupation:occupation,
              ngobased:ngobased,
              industrybased:industrybased,
              success_msg:'You are successfully create new classes'
          })
          }).catch(err =>{
            res.render('addnewclass',{
              department:department,
              levelbased:levelbased,
              occupation:occupation,
              ngobased:ngobased,
              industrybased:industrybased,
              success_msg:'You are successfully create new classes'
          })
          })
         
        }
        else{
            res.render('addnewclass',{
                department:department,
                occupation:occupation,
                levelbased:levelbased,
                ngobased:ngobased,
                industrybased:industrybased,
                error_msg:'Please create class names before submit the form'
            })
        }
    }
   
  
})
router.get('/allclasslist',ensureAuthenticated,async function(req,res){
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts INNER JOIN occupations ON occupations.occupation_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"
      );
      const batches = await Batch.findAll({});
      const department = await Occupation.findAll({});
      res.render('allclasslist',{
          classlist:classlist,
          department:department,
          batches:batches
      })
});
router.post('/filterclasslistbydepartmentandbatch',ensureAuthenticated,async function(req,res){
 
    const {batch,dept} = req.body;
    const batches = await Batch.findAll({});
    const department = await Occupation.findAll({});
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts  INNER JOIN occupations ON occupations.occupation_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"+
        " where classindepts.batch_id='"+batch+"' and classindepts.department_id ='"+dept+"'"
      );
      res.render('allclasslist',{
        classlist:classlist,
        department:department,
        batches:batches
    })
});
module.exports = router;

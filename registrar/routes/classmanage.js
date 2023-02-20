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
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Batch = db.batches;
const ClassInDept = db.classindepts;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Occupation = db.occupations;
const SectorList = db.sectorlists;


router.get('/allclasslist',ensureAuthenticated,async function(req,res){
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts INNER JOIN occupations ON occupations.occupation_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"+
        " inner join departments on departments.department_id = occupations.department_id"
      );
      const batches = await Batch.findAll({});
      const department = await Occupation.findAll({});
      res.render('allclasslist',{
          classlist:classlist,
          department:department,
          batches:batches
      })
});
router.post('/deletesection/(:classid)',ensureAuthenticated,async function(req,res){
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts INNER JOIN occupations ON occupations.occupation_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"+
        " inner join departments on departments.department_id = occupations.department_id"
      );
      const batches = await Batch.findAll({});
      const department = await Occupation.findAll({});
    ClassInDept.findOne({where:{class_id:req.params.classid}}).then( cls =>{
        if(cls){
 ClassInDept.destroy({where:{class_id:req.params.classid}}).then( dcls=>{
    res.render('allclasslist',{
        classlist:classlist,
        department:department,
        batches:batches,
        success_msg:"Successfully Delete Section"
    })
 }).catch(err =>{
    res.render('allclasslist',{
        classlist:classlist,
        department:department,
        batches:batches
    })   
})
        }
    }).catch(err =>{
        res.render('allclasslist',{
            classlist:classlist,
            department:department,
            batches:batches
        })
    })

     
});
router.post('/filterclasslistbydepartmentandbatch',ensureAuthenticated,async function(req,res){
 
    const {batch,dept} = req.body;
    const batches = await Batch.findAll({});
    const department = await Occupation.findAll({});
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts  INNER JOIN occupations ON "+ 
        " occupations.occupation_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"+
        " inner join departments on departments.department_id = occupations.department_id"+
        " where classindepts.batch_id='"+batch+"' and classindepts.department_id ='"+dept+"'"
      );
      res.render('allclasslist',{
        classlist:classlist,
        department:department,
        batches:batches
    })
});
module.exports = router;
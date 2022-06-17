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

router.get('/searchclasswithbatch',ensureAuthenticated,async function(req,res){
  const dpt = await Department.findAll({});
  const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
    );
    const [industrybased, metaindustrybaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
    );
      res.render('selectprogramtofindclass',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased,
      department:dpt
  });
});
router.get('/allclasslist',ensureAuthenticated,async function(req,res){
    const [classlist, metadata] = await sequelize.query(
        "SELECT * FROM classindepts INNER JOIN departments ON departments.department_id = classindepts.department_id inner join batches on classindepts.batch_id = batches.batch_id"
      );
      const batches = await Batch.findAll({});
      const department = await Department.findAll({});
      res.render('allclasslist',{
          classlist:classlist,
          department:department,
          batches:batches
      })
});
router.post('/filterclasslistbydepartmentandbatch',ensureAuthenticated,async function(req,res){
 
    const {batch,dept} = req.body;
    const batches = await Batch.findAll({});
    const department = await Department.findAll({});
    const [results, metadata] = await sequelize.query(
      "SELECT classindepts.class_name,classindepts.department_id,classindepts.batch_id,classindepts.training_level,classindepts.class_id,classindepts.training_type FROM  courseteacherclasses "+
      "INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' "
    );    
      res.render('allclasslist',{
        classlist:results,
        department:department,
        batches:batches
    })
});
module.exports = router;
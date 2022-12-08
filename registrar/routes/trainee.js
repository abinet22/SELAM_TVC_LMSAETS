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
router.post('/alllevelbasedtrainee', ensureAuthenticated,async function(req,res){
    const {programidlevel,occlevel} = req.body;
    const applicantlist = await LevelBasedTrainee.findAll({where:{batch_id:programidlevel,department_id:occlevel}});
    const department = await Occupation.findAll({})
    res.render('alltraineeregisteredlist',{
        applicantlist,applicantlist,
        department:department,
   
    })
})
router.post('/allngobasedtrainee', ensureAuthenticated,async function(req,res){
    const {programidngo,occngo} = req.body;
    const applicantlist = await NGOBasedTrainee.findAll({where:{batch_id:programidngo,department_id:occngo}});
  
    const department = await Occupation.findAll({})
    res.render('alltraineeregisteredlist',{
        applicantlist,applicantlist,
        department:department,
     
    })
})
router.post('/allindustrybasedtrainee', ensureAuthenticated,async function(req,res){
    const {programidind,occind} = req.body;
    const applicantlist = await IndustryBasedTrainee.findAll({where:{batch_id:programidind,department_id:occind}});
  
    const department = await Occupation.findAll({})
    res.render('alltraineeregisteredlist',{
        applicantlist,applicantlist,
        department:department,
    
    })
})
module.exports = router;
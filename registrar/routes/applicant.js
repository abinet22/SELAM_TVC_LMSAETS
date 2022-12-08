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
const NewApplicant =db.newapplicants;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4, parse } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Occupation = db.occupations;
const NGOBasedTrainee = db.ngobasedtrainees
const LevelBasedTrainee = db.levelbasedtrainees;

const LevelBasedProgram = db.levelbasedprograms;

router.get('/allapplicantlist',async function(req,res){
    const department = await Occupation.findAll({});
        const [levelbased, metalevelbaseddata] = await sequelize.query(
          "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id "
        );
        const [ngobased, metangobaseddata] = await sequelize.query(
          "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id "
        );
        // const [industry, metaindustrybaseddata] = await sequelize.query(
        //   "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id "
        // );
        res.render('allapplicantlist',{
          levelbased:levelbased,
          ngobased:ngobased,
          industrybased:ngobased,
          department:department
      })
  })
router.post('/alllevelbasedlist', ensureAuthenticated,async function(req,res){
    const {programidlevel,occlevel} = req.body;
    const applicantlist = await NewApplicant.findAll({where:{application_id:programidlevel}});
    const department = await Occupation.findAll({})
    res.render('alllevelbasedlist',{
        applicantlist,applicantlist,
        department:department,
        programidlevel:"programidlevel"
    })
})
router.post('/allngobasedlist', ensureAuthenticated,async function(req,res){
    const {programidngo,occlevel} = req.body;
    const applicantlist = await NewApplicant.findAll({where:{application_id:programidngo}});
  
    const department = await Occupation.findAll({})
    res.render('allngobasedlist',{
        applicantlist,applicantlist,
        department:department,
        programidlevel:"programidlevel"
    })
})


module.exports = router;
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
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const LevelBasedProgram = db.levelbasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const NGOBasedProgram = db.ngobasedprograms;

router.get('/managelevelbased',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedProgram.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('managelevelbased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.get('/managengobased',ensureAuthenticated,async function(req,res){
    const levelbased = await NGOBasedProgram.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('managengobased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.get('/manageindustrybased',ensureAuthenticated,async function(req,res){
    const levelbased = await IndustryBasedProgram.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('manageindustrybased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.post('/printcertificate',ensureAuthenticated,async function(req,res){

    res.render('printcertificate');
})
router.post('/printstudentid',ensureAuthenticated,async function(req,res){

    res.render('printstudentid');
})
router.post('/printgradereport',ensureAuthenticated,async function(req,res){

    res.render('printgradereport');
})



router.post('/selecttraineeebyid',ensureAuthenticated,async function(req,res){

    res.render('printgradereport');
})
router.post('/allthisselecteddepartment',ensureAuthenticated,async function(req,res){

    res.render('printgradereport');
})
router.post('/allthisselactedclass',ensureAuthenticated,async function(req,res){

    res.render('printgradereport');
})
module.exports = router;
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
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/managelevelbased',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('managelevelbased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.get('/managengobased',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('managengobased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.get('/manageindustrybased',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('manageindustrybased',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
router.get('/alltraineeinjbs',ensureAuthenticated,async function(req,res){
    const levelbased = await LevelBasedTraining.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    
res.render('alljbstraineelist',{
    levelbased:levelbased,
    department:department,
    classlist:classlist
})
})
module.exports = router;
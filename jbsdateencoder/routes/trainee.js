const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const JBSStudentData = db.jbsstudentdatas;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const User = db.users;
const ClassInDept = db.classindepts;
const sequelize = db.sequelize ;
const Occupation = db.occupations;
const Company = db.companies;
const EmployeementHistory = db.employementhistories;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const LevelBasedTrainee = require('../models/LevelBasedTrainee');
const Batch = db.batches;

router.get('/managelevelbased',ensureAuthenticated,async function(req,res){
    const levelbased = await JBSStudentData.findAll({where:{programtag:"level"}});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    const batchlist = await Batch.findAll({});
res.render('alljbstraineelist',{
    levelbased:levelbased,
    department:department,
    classlist:classlist,
    batchlist:batchlist
})
})
router.get('/managengobased',ensureAuthenticated,async function(req,res){
    const levelbased = await JBSStudentData.findAll({where:{programtag:"ngo"}});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    const batchlist = await Batch.findAll({});
res.render('alljbstraineelist',{
    levelbased:levelbased,
    department:department,
    classlist:classlist,
    batchlist:batchlist
})
})
router.get('/manageindustrybased',ensureAuthenticated,async function(req,res){
    const levelbased = await JBSStudentData.findAll({where:{programtag:"industry"}});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    const batchlist = await Batch.findAll({});
res.render('alljbstraineelist',{
    levelbased:levelbased,
    department:department,
    classlist:classlist,
    batchlist:batchlist
})
})
router.get('/alltraineeinjbs',ensureAuthenticated,async function(req,res){
    const levelbased = await JBSStudentData.findAll({});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    const batchlist = await Batch.findAll({});
res.render('alljbstraineelist',{
    levelbased:levelbased,
    department:department,
    classlist:classlist,
    batchlist:batchlist
})
})
router.post('/seetraineejbshistory/(:traineeid)',ensureAuthenticated,async function(req,res){
    const levelbased = await EmployeementHistory.findAll({where:{student_unique_id:req.params.traineeid}});
    const department = await Department.findAll({});
    const classlist = await ClassInDept.findAll({});
    const marklist = await LevelBasedTrainee.findAll({where:{student_unique_id:req.params.traineeid}});
    const batchlist = await Batch.findAll({});
res.render('singlestudentjbshistory',{
    levelbased:levelbased,
    marklist:marklist
})
})
module.exports = router;
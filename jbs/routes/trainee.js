const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const JBSStudentData = db.jbsstudentdatas;
const FunderInfo = db.funderinfo;
const EmployeementHistory = db.employementhistories;
const Department = db.departments;
const Occupation = db.occupations;
const Course = db.courses;
const User = db.users;
const ClassInDept = db.classindepts;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Batch = db.batches;

router.get('/managelevelbased',ensureAuthenticated,async function(req,res){
    const levelbased = await JBSStudentData.findAll({where:{programtag:"level"}});
    const department = await Occupation.findAll({});
    const classlist = await ClassInDept.findAll({});
    const batchlist = await Batch.findAll({});
res.render('alljbstraineelist',{
    levelbased:levelbased,
    department:department,
    classlist:classlist,
    batchlist:batchlist,
    tag:"All Level Based"
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
    batchlist:batchlist,
    tag:"All Short Term Based"
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
    batchlist:batchlist,
    tag:"All Industry Based"
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
    batchlist:batchlist,
    tag:"All"
})
})
router.post('/seetraineejbshistory/(:traineeid)',ensureAuthenticated,async function(req,res){
    const emphistory = await EmployeementHistory.findAll({where:{trainee_id:req.params.traineeid}});
    const student   =await  JBSStudentData.findOne({where:{trainee_id:req.params.traineeid}});
    const batch = await Batch.findOne({where:{batch_id:student.batch_id}});
    const [department,dptmeta] = await sequelize.query(
        " select * from occupations inner join departments on"+
         " departments.department_id=occupations.department_id inner join sectorlists on"+
         " sectorlists.sector_id = departments.training_id where occupations.occupation_id='"+student.department_id+"' "
      )
res.render('singlestudentjbshistory',{
    emphistory:emphistory,
    batch:batch,
    department:department,
    student:student

    
})
})
module.exports = router;
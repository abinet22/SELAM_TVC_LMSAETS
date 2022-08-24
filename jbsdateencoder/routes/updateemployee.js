const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const StaffList = db.stafflists;
const Batch = db.batches;
const LevelBasedProgram = db.levelbasedprograms;
const NGOBasedProgram = db.ngobasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const LevelBasedTrainee = db.levelbasedtrainees;
const Department =db.departments;
const NGOBasedTrainee = db.ngobasedtrainees;
const IndustryBasedTrainee = db.industrybasedtrainees;
const AppSelectionCriteria = db.appselectioncriterias;
const JBSStudentData = db.jbsstudentdatas;
const NewApplicant = db.newapplicants;
const ClassInDept = db.classindepts;

const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const IndustryBasedTraining = require('../models/IndustryBasedTraining');
const Occupation = db.occupations;
const Company = db.companies;
const EmployeementHistory = db.employementhistories;
router.get('/employeecompany',ensureAuthenticated,async function(req,res){

  const levelbased = await JBSStudentData.findAll({});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('updateemployeeinfo',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist
})

});
router.post('/employeecompany/(:employeeid)',ensureAuthenticated,async function(req,res){
 
  const {companyname} = req.body;

  const levelbased = await JBSStudentData.findAll({});
  const department = await Department.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

 
  JBSStudentData.findOne({where:{trainee_id:req.params.employeeid}}).then(employee =>{
  if(!employee){
    res.send({message:"error"})
  }else{
    const employeehistoryData ={
      batch_id:employee.batch_id,
      trainee_id: req.params.employeeid,
      student_unique_id:employee.student_unique_id,
      company:companyname,
      update_by:req.user.username,
      message: "Update employee company "+ companyname
    };
    EmployeementHistory.create(employeehistoryData).then(history =>{
      res.send({message:"success"})
    })
   
  }

  })

})
module.exports = router;

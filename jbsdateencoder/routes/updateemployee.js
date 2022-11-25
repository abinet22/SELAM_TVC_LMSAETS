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
router.get('/employeeincome',ensureAuthenticated,async function(req,res){

  const levelbased = await JBSStudentData.findAll({});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('updateincomeincrease',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist
})

});
router.get('/jobsiteinformation',ensureAuthenticated,async function(req,res){

  const levelbased = await JBSStudentData.findAll({});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('updatejobsiteinfo',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist
})

});
router.get('/jbsstatus',ensureAuthenticated,async function(req,res){

  const levelbased = await JBSStudentData.findAll({});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('updatejbsstatus',{
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
    res.render('updateemployeeinfo',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist
    })
  }else{
    const employeehistoryData ={
      batch_id:employee.batch_id,
      trainee_id: req.params.employeeid,
      student_unique_id:employee.student_unique_id,
      company:companyname,
      update_by:req.user.username,
      update_type:"Company_Info",
      message: "Update employee company "+ companyname
    };
    EmployeementHistory.create(employeehistoryData).then(history =>{
      res.render('updateemployeeinfo',{
        levelbased:levelbased,
        department:department,
        classlist:classlist,
        batchlist:batchlist,
        companylist:companylist,
        success_msg:"Successfully update employee data"
      })
    })
   
  }

  })

})

router.post('/employeeincome/(:employeeid)',ensureAuthenticated,async function(req,res){
 
  const {companyname, income} = req.body;

  const levelbased = await JBSStudentData.findAll({});
  const department = await Department.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

 
  JBSStudentData.findOne({where:{trainee_id:req.params.employeeid}}).then(employee =>{
  if(!employee){
    res.render('updateincomeincrease',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist
    })
  }else{
     
   

    const employeehistoryData ={
      batch_id:employee.batch_id,
      trainee_id: req.params.employeeid,
      student_unique_id:employee.student_unique_id,
      company:companyname,
      update_by:req.user.username,
      update_type:"Income_Increase",
      message: "Update employee income data "+ companyname +" "+ income,
      income_increase:income
    };
    EmployeementHistory.create(employeehistoryData).then(history =>{
      res.render('updateincomeincrease',{
        levelbased:levelbased,
        department:department,
        classlist:classlist,
        batchlist:batchlist,
        companylist:companylist,
        success_msg:"Successfully update employee income data"
      })
    })
   
  }

  })

})

router.post('/jobsiteinformation/(:employeeid)',ensureAuthenticated,async function(req,res){
 
  const {companyname,infotype,info} = req.body;

  const levelbased = await JBSStudentData.findAll({});
  const department = await Department.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});
  
  if(infotype == "0"){
    res.render('updatejobsiteinfo',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist,
      error_msg:"please select info type first"
    })
  }
  JBSStudentData.findOne({where:{trainee_id:req.params.employeeid}}).then(employee =>{
  if(!employee){
    res.render('updatejobsiteinfo',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist
    })
  }else{
    const employeehistoryData ={
      batch_id:employee.batch_id,
      trainee_id: req.params.employeeid,
      student_unique_id:employee.student_unique_id,
      company:companyname,
      update_by:req.user.username,
      update_type:"Job_Site_Info",
      message: "Update employee jobsiteinformation " +infotype+" "+ companyname +" "+ info
    };
    EmployeementHistory.create(employeehistoryData).then(history =>{
      res.render('updatejobsiteinfo',{
        levelbased:levelbased,
        department:department,
        classlist:classlist,
        batchlist:batchlist,
        companylist:companylist,
        success_msg:"Successfully update job site information data"
      })
    })
   
  }

  })

})
module.exports = router;

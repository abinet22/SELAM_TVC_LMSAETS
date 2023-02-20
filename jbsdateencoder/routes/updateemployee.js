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
  const newdpt = await Department.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('updateemployeeinfo',{
  levelbased:levelbased,
  department:department,
  newdpt:newdpt,
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
  const newdpt = await Department.findAll({})
res.render('updateincomeincrease',{
  levelbased:levelbased,
  newdpt:newdpt,
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
  const newdpt = await Department.findAll({})
res.render('updatejobsiteinfo',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist,
  newdpt:newdpt
})

});
router.get('/jbsstatus',ensureAuthenticated,async function(req,res){

  const levelbased = await JBSStudentData.findAll({});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});
  const newdpt = await Department.findAll({})
res.render('updatejbsstatus',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist,
  newdpt:newdpt
})

});
router.post('/employeecompany/(:employeeid)',ensureAuthenticated,async function(req,res){
 
  const {companyname} = req.body;

  const levelbased = await JBSStudentData.findAll({});
  const department = await Department.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});
  const newdpt = await Department.findAll({})
  if(!companyname || companyname==="0"){
    res.render('updateemployeeinfo',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist,
      newdpt:newdpt,
      error_msg:'Please Select Company First'
    })
  }else{
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
          message: "Update Employee New Employeer Company "+ companyname
        };
        EmployeementHistory.create(employeehistoryData).then(history =>{
          res.render('updateemployeeinfo',{
            levelbased:levelbased,
            department:department,
            classlist:classlist,
            batchlist:batchlist,
            companylist:companylist,
            newdpt:newdpt,
            success_msg:"Successfully Update Employee Employeer Company"
          })
        })
       
      }
    
      })
  }
 
 

})

router.post('/employeeincome/(:employeeid)',ensureAuthenticated,async function(req,res){
 
  const {companyname, income} = req.body;

  const levelbased = await JBSStudentData.findAll({});
  const department = await Department.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});
  const newdpt = await Department.findAll({})
 
  JBSStudentData.findOne({where:{trainee_id:req.params.employeeid}}).then(employee =>{
  if(!employee){
    res.render('updateincomeincrease',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist,
      newdpt:newdpt
    })
  }else{
     
   

    const employeehistoryData ={
      batch_id:employee.batch_id,
      trainee_id: req.params.employeeid,
      student_unique_id:employee.student_unique_id,
      company:companyname,
      update_by:req.user.username,
      update_type:"Income_Increase",
      message: "Update Employee New Income: "+ companyname +" "+ income,
      income_increase:income,
      newdpt:newdpt
    };
    EmployeementHistory.create(employeehistoryData).then(history =>{
      res.render('updateincomeincrease',{
        levelbased:levelbased,
        department:department,
        classlist:classlist,
        batchlist:batchlist,
        newdpt:newdpt,
        companylist:companylist,
        success_msg:"Successfully Update Employee New Income"
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
  const newdpt = await Department.findAll({})
  if(infotype == "0"){
    res.render('updatejobsiteinfo',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      newdpt:newdpt,
      companylist:companylist,
      error_msg:"Please Select Update Option Info First"
    })
  }
  JBSStudentData.findOne({where:{trainee_id:req.params.employeeid}}).then(employee =>{
  if(!employee){
    res.render('updatejobsiteinfo',{
      levelbased:levelbased,
      department:department,
      classlist:classlist,
      batchlist:batchlist,
      companylist:companylist,
      newdpt:newdpt
    })
  }else{
    const employeehistoryData ={
      batch_id:employee.batch_id,
      trainee_id: req.params.employeeid,
      student_unique_id:employee.student_unique_id,
      company:companyname,
      newdpt:newdpt,
      update_by:req.user.username,
      update_type:"Job_Site"+ infotype,
      message: "Update Employee Job Site Information: Job_Site " +infotype+" To The Following Company: "+ companyname +":- "+ info
    };
    EmployeementHistory.create(employeehistoryData).then(history =>{
      res.render('updatejobsiteinfo',{
        levelbased:levelbased,
        department:department,
        newdpt:newdpt,
        classlist:classlist,
        batchlist:batchlist,
        companylist:companylist,
        success_msg:"Successfully Update Job Site Job Site Information"
      })
    })
   
  }

  })

})
module.exports = router;

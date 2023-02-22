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
router.get('/allgraduates',ensureAuthenticated,async function(req,res){

  const levelbased = await LevelBasedTrainee.findAll({where:{is_graduated:'Yes'}});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('allgraduates',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist,
  tag:"All Graduate Trainees"
})

});

router.get('/newtococ',ensureAuthenticated,async function(req,res){

  const levelbased = await LevelBasedTrainee.findAll({where:{is_graduated:'Yes'}});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('allgraduates',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist,
  tag:"New Graduate Trainees"
})

});
router.get('/coccompetent',ensureAuthenticated,async function(req,res){

  const levelbased = await LevelBasedTrainee.findAll({where:{is_graduated:'Yes',is_pass_coc:'PASS'}});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('allgraduates',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist,
  tag:"Competent Graduate Trainees"
})

});
router.get('/cocnotyetcompetent',ensureAuthenticated,async function(req,res){

  const levelbased = await LevelBasedTrainee.findAll({where:{is_graduated:'Yes',is_pass_coc:'FAIL'}});
  const department = await Occupation.findAll({});
  const classlist = await ClassInDept.findAll({});
  const batchlist = await Batch.findAll({});
  const companylist = await Company.findAll({});

res.render('allgraduates',{
  levelbased:levelbased,
  department:department,
  classlist:classlist,
  batchlist:batchlist,
  companylist:companylist,
  tag:"Not Yet Competent Graduate Trainees"
})

});

router.post('/sendtococ/(:traineeid)',ensureAuthenticated,async function(req,res){
  const{level,traineeid,programidbatch,dept,programtag} = req.body;
  
  const [department,dptmeta] = await sequelize.query(
    " select * from occupations inner join departments on"+
     " departments.department_id=occupations.department_id inner join sectorlists on"+
     " sectorlists.sector_id = departments.training_id where occupations.occupation_id='"+dept+"' "
  );
  const batch = await Batch.findOne({where:{batch_id:programidbatch}});
  const student = await LevelBasedTrainee.findAll({where:{trainee_id:req.params.traineeid,department_id:dept,batch_id:programidbatch,current_level:level}});
    
      const [courselist,metacourselist] = await sequelize.query(
        "select * from courses where department_id='"+dept+"' and training_level='"+level+"'");
       
       
      const [marklist, metaclasslist] = await sequelize.query(
        "SELECT * FROM levelbasedtrainees  INNER JOIN studentmarklistlevelbaseds "+
        " ON levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
        "inner join courses on courses.course_id = studentmarklistlevelbaseds.course_id "+
    " where levelbasedtrainees.trainee_id ='"+req.params.traineeid+"'" +
    " and levelbasedtrainees.current_level ='"+level+"'"+
    " and studentmarklistlevelbaseds.department_id ='"+dept+"' "+
   " and studentmarklistlevelbaseds.batch_id ='"+programidbatch+"' "+
    "  and courses.training_level='"+level+"'" +
    "  and courses.department_id='"+dept+"'" 
      );
          res.render('singlestudenttococ',{
            marklist:marklist,
            programtag:'level',
            deptid:dept,
            batchid:programidbatch,
            classid:'',
            courseid:'',
            student:student,
            department:department,
            batch:batch,
            courselist:courselist,
            classinfo:'',
            level:level,
            traineeid:req.params.traineeid
        })

});

module.exports = router;

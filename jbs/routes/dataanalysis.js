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
const NewApplicant = db.newapplicants;
const EmployeementHistory  = db.employementhistories;
const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const IndustryBasedTraining = require('../models/IndustryBasedTraining');
const JBSStudentData = db.jbsstudentdatas;


router.get('/outcomenumberreport',ensureAuthenticated,async function(req,res){
   
    const batch = await Batch.count();
    const lbbatch = await LevelBasedProgram.count();
    const ibbatch = await IndustryBasedProgram.count();
    const nbbatch = await NGOBasedProgram.count();
    const dpt = await Department.count();
  
    const [deptcat, deptcatmeta] = await sequelize.query(
   "SELECT departments.department_name,count(levelbasedtrainees.department_id) as total FROM levelbasedtrainees inner join departments" +
  "  on departments.department_id = levelbasedtrainees.department_id group by department_name");
    
    const [graduated,grmeta] = await sequelize.query(" SELECT graduated,sex, count(*) as gradno FROM jbsstudentdata where graduated=1 group by sex");
    const counttotal = await JBSStudentData.count({});
  
    const [placed_in_app,pmeta] = await sequelize.query(" SELECT placed_in_app,sex, count(*) as appno FROM jbsstudentdata where placed_in_app=1 group by sex");

    const  [continuedstudy,cmeta]= await sequelize.query(" SELECT continued_study,sex, count(*) as studyno FROM jbsstudentdata where continued_study=1 group by sex");
    const  [employedself,esmeta] = await sequelize.query(" SELECT employed_self,sex, count(*) as selfno FROM jbsstudentdata where employed_self=1 group by sex")
    const [employedsixmonths,emeta]= await sequelize.query(" SELECT employed_six_months,sex, count(*) as empno FROM jbsstudentdata where employed_six_months=1 group by sex")
    const [employedinfl,eimeta]= await sequelize.query(" SELECT employed_in_fl,sex, count(*) as fino FROM jbsstudentdata where employed_in_fl=1 group by sex")
    res.render('outcomenumber',{batch:batch,
   lbbatch:lbbatch,
   nbbatch:nbbatch,
   ibbatch,ibbatch,
   dpt:dpt,
   deptcat,deptcat,
   trainee:'',
   graduated:graduated,
   dropout:'',
   ontrainee:'',
   continuedstudy:continuedstudy,
   employedself:employedself,
   counttotal:counttotal,
   employedsixmonths:employedsixmonths,
   employedinfl:employedinfl,
   placedinapp:placed_in_app
  
  })
  })

router.get('/increaseincomereport',ensureAuthenticated,async function(req,res){
   
 const [incomeincrease,metainc] = await sequelize.query(
" SELECT batches.batch_name, sum(income_increase) as total FROM employementhistories "+
"inner join batches on batches.batch_id = employementhistories.batch_id "+
"group by batches.batch_name "
 )
  res.render('incomeincrease',{
    incomeincrease:incomeincrease
})
})

router.get('/outcomediagramanalysis',ensureAuthenticated,async function(req,res){
  const batchtot = await Batch.count();
  const [batch,bmeta] = await sequelize.query(
   " SELECT count(trainee_id) as alltrainee,programtag from jbsstudentdata "+
" inner join batches on jbsstudentdata.batch_id = batches.batch_id "+
" group by jbsstudentdata.programtag"
  )
  const [dpt,dptmeta] = await sequelize.query(
    "SELECT occupations.occupation_name,count(trainee_id) as alltrainee from jbsstudentdata "+
   " inner join occupations on jbsstudentdata.department_id = occupations.occupation_id "+
    " group by occupations.occupation_name"
    
  )
  const [traineeoccupation,teoccmeta]  = await sequelize.query(
  "  SELECT occupation_name, "+
"count(CASE WHEN graduated=1 THEN jbsstudentdata.graduated END) graduated, "+
"count(CASE WHEN placed_in_app=1 THEN jbsstudentdata.placed_in_app END) placed_in_app, "+
"count(CASE WHEN employed_in_fl=1 THEN jbsstudentdata.employed_in_fl END) employed_in_fl, "+
"count(CASE WHEN employed_self=1 THEN jbsstudentdata.employed_self END) employed_self, "+
"count(CASE WHEN employed_six_months=1 THEN jbsstudentdata.employed_six_months END) employed_six_months "+
  "  from jbsstudentdata "+
"inner join occupations on occupations.occupation_id = jbsstudentdata.department_id "+
"group by occupation_name "
  )
  const dpttot = await Department.count();
  const jbstot = await JBSStudentData.count();
  console.log(batch)
  res.render('outcomediagram',{batch:batch,
 batch:batch,
 batchtot:batchtot,
 dpt:dpt,
 dpttot,dpttot,
 trainee:jbstot,
 traineeoccupation:traineeoccupation,
 

})
   })
  router.get('/calculatingcostreport',ensureAuthenticated,async function(req,res){
   
     const [department,metadpt]= await sequelize.query(
   "   SELECT batch_name,department_id,count(trainee_id) as tot, sum(placed_in_app=1) as pinapp FROM selamlmsets.jbsstudentdata "+
    "  inner join batches on jbsstudentdata.batch_id = batches.batch_id "+
     " group by department_id,batch_name "
     );
     const counttotal = await JBSStudentData.count({});
  
     const [costdata, metadata] = await sequelize.query(
     
        "  select occupation_id,courses.department_id,occupation_name,departments.department_name,training_level,sum(courses.training_hours) as trhour,sum(courses.training_cost) as trcost from courses "+
         " inner join occupations on  courses.department_id = occupations.occupation_id  "+
       "   inner join departments on  departments.department_id = occupations.department_id  "+
        "  group by courses.department_id,training_level,occupation_id, occupation_name,department_name"
     
   );
   console.log(costdata)
    res.render('calculatingcost',{
      department:department,
     costdata:costdata,
     counttotal:counttotal
  
  })
  })
  router.get('/statistics',ensureAuthenticated,async function(req, res)  {
    const [traineebatch, classevalmeta] = await sequelize.query(
    "   SELECT batches.batch_name,count(jbsstudentdata.trainee_id) as total FROM jbsstudentdata "+
    "  inner join batches on batches.batch_id=jbsstudentdata.batch_id "+
    "inner join occupations on jbsstudentdata.department_id = occupations.occupation_id"+
    
   
     " group by batches.batch_name"
         
      );
      const [occtrainee, occtraineebatch] = await sequelize.query(

  "  SELECT batches.batch_name,occupation_name,count(jbsstudentdata.trainee_id) as total FROM jbsstudentdata "+
    "  inner join batches on batches.batch_id=jbsstudentdata.batch_id "+
   "   inner join occupations on jbsstudentdata.department_id = occupations.occupation_id"+

   
     "  group by  batches.batch_name ,occupation_name"
      )
    res.render('statistics',{
        traineebatch:traineebatch,
        occtrainee:occtrainee
    })
});
module.exports = router;

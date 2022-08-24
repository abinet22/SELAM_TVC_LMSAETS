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
const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const IndustryBasedTraining = require('../models/IndustryBasedTraining');


router.get('/outcomenumberreport',ensureAuthenticated,async function(req,res){
   
    const batch = await Batch.count();
    const lbbatch = await LevelBasedProgram.count();
    const ibbatch = await IndustryBasedProgram.count();
    const nbbatch = await NGOBasedProgram.count();
    const dpt = await Department.count();
    const [deptcat, deptcatmeta] = await sequelize.query(
   "SELECT departments.department_name,count(levelbasedtrainees.department_id) as total FROM levelbasedtrainees inner join departments" +
  "  on departments.department_id = levelbasedtrainees.department_id group by department_name");
    const trainee = await LevelBasedTrainee.count({});
    const graduated = await LevelBasedTrainee.count({where:{is_graduated:"Yes"}});
    const ontrainee = await LevelBasedTrainee.count({where:{is_graduated:"No"}});
    const dropout = await LevelBasedTrainee.count({where:{is_graduated:"No",is_dropout:"Yes"}});
  res.render('outcomediagram',{batch:batch,
   lbbatch:lbbatch,
   nbbatch:nbbatch,
   ibbatch,ibbatch,
   dpt:dpt,
   deptcat,deptcat,
   trainee:trainee,
   graduated:graduated,
   dropout:dropout,
   ontrainee:ontrainee
  
  })
  })

router.get('/increaseincomereport',ensureAuthenticated,async function(req,res){
   
  const batch = await Batch.count();
  const lbbatch = await LevelBasedProgram.count();
  const ibbatch = await IndustryBasedProgram.count();
  const nbbatch = await NGOBasedProgram.count();
  const dpt = await Department.count();
  const [deptcat, deptcatmeta] = await sequelize.query(
 "SELECT departments.department_name,count(levelbasedtrainees.department_id) as total FROM levelbasedtrainees inner join departments" +
"  on departments.department_id = levelbasedtrainees.department_id group by department_name");
  const trainee = await LevelBasedTrainee.count({});
  const graduated = await LevelBasedTrainee.count({where:{is_graduated:"Yes"}});
  const ontrainee = await LevelBasedTrainee.count({where:{is_graduated:"No"}});
  const dropout = await LevelBasedTrainee.count({where:{is_graduated:"No",is_dropout:"Yes"}});
res.render('report',{batch:batch,
 lbbatch:lbbatch,
 nbbatch:nbbatch,
 ibbatch,ibbatch,
 dpt:dpt,
 deptcat,deptcat,
 trainee:trainee,
 graduated:graduated,
 dropout:dropout,
 ontrainee:ontrainee

})
})

router.get('/outcomediagramanalysis',ensureAuthenticated,async function(req,res){

    var first = [];
      var second = [];
      var c2x = []; var c2y = [];
  
      var x3 = [];
      var y31 = []; var y32 = []; var y33 = []; var y34 = []; var y35 = []; var y36 = []; var y37 = [];
      var data1 = [];
      var data2 = [];
      var data3 = [];
      var data4 = [];
      var data5 = [];
      var data6 = [];
      var results0 =await sequelize.query("select batch_id,count(*) as trainee from jbsstudentdata group by batch_id");
      var results1 = await sequelize.query(" select  department_id,count(*) as trainee from jbsstudentdata group by department_id ")

      var results2 = await sequelize.query( " SELECT department_id as trainingname,COUNT(id) AS NumberOfOrders, "+
      " sum(graduated = 1) as graduates,  "+
      " sum(continued_study =1) as continuestudy, "+
      " sum(employed_in_fl = 1) as empfl, sum(employed_self =1) as selfemp, "+
      " sum(placed_in_app = 1) as placeinapp, "+
      " sum(employed_six_months =1) as empsixmonth  "+
      " FROM jbsstudentdata "+
      " GROUP BY department_id  order by department_id ")
      var results3 = await sequelize.query("select "+
      "count(*) as total, "+
      "SUM(graduated =1) as graduated, "+
      "SUM(employed_self =1) as employed_self, "+
      "SUM(employed_six_months =1) as employed_six_months, "+
      "SUM(employed_in_fl =1) as employed_in_fl, "+
      "SUM(continued_study =1) as continued_study, "+
      "SUM(placed_in_app) as placed_in_app "+
    
      "from jbsstudentdata  ")
      var results4 =await sequelize.query("select sum(sex='m') as male, sum(sex='f') as female from jbsstudentdata")
 
      var results5 = await sequelize.query( "select department_name,count(*) traineetotal,sum(income_start) as totalstart ,sum(income_end) as totalincrease,(sum(income_end)/count(*)) as averagepertrainee from jbsstudentdata "+
      "Inner join departments   ON departments.department_id = jbsstudentdata.department_id group by department_name"
      )
    
 
 
       data1 = results0;
       data3 = results2;
       data2 = results1;
       data4 = results3;
       data5 = results4;
       data6 = results5;
      // console.log(data6);
    //    data1.foreach(function(row) {
    //     first.push(row.batch_name);
    //     second.push(row.trainee);
    //    })
    var i,j,k ;
    for(i = 0 ; i < data1.length  ; i ++)
    {
      
         first.push(data1[i].batch_name);
         second.push(data1[i].trainee);
    }
    for(j = 0 ; j < data3.length  ; j++)
    {
       
         x3.push(data3[j].trainingname);
         y31.push(data3[j].dropout);
         y32.push(data3[j].continuestudy);
         y33.push(data3[j].graduates);
         y34.push(data3[j].empfl);
         y35.push(data3[j].selfemp);
         y36.push(data3[j].placeinapp);
         y37.push(data3[j].empsixmonth);
    }
    for(k = 0 ; k < data2.length  ; k++)
    {
      
         c2x.push(data2[k].trade_name);
         c2y.push(data2[k].trainee);
      
    }
    var tboutcome = [];
    for(var s4 = 0 ; s4 < data4.length  ; s4++)
    {
      
      tboutcome.push(data4[s4]);
        
      
    }
    var aggdata = [];
    for(var ad6 = 0 ; ad6 < data6.length  ; ad6++)
    {
      
      aggdata.push(data6[ad6]);
        
      
    }
    console.log(data6);
    res.render('outcomediagram',{
      xValues:first,
      user:req.user,
      yValues:second,
      c2x:c2x,
      c2y:c2y,
      databysex:data5,
      databyoutcome:tboutcome,
      dataaggregate:data6,
      xValues3:x3,
    y1:y31, y2:y32,
    y3:y33, y4:y34, y5:y35, y6:y36, y7:y37,}) 
   })
  router.get('/calculatingcostreport',ensureAuthenticated,async function(req,res){
   
    const batch = await Batch.count();
    const lbbatch = await LevelBasedProgram.count();
    const ibbatch = await IndustryBasedProgram.count();
    const nbbatch = await NGOBasedProgram.count();
    const dpt = await Department.count();
    const [deptcat, deptcatmeta] = await sequelize.query(
   "SELECT departments.department_name,count(levelbasedtrainees.department_id) as total FROM levelbasedtrainees inner join departments" +
  "  on departments.department_id = levelbasedtrainees.department_id group by department_name");
    const trainee = await LevelBasedTrainee.count({});
    const graduated = await LevelBasedTrainee.count({where:{is_graduated:"Yes"}});
    const ontrainee = await LevelBasedTrainee.count({where:{is_graduated:"No"}});
    const dropout = await LevelBasedTrainee.count({where:{is_graduated:"No",is_dropout:"Yes"}});
  res.render('calculatingcost',{batch:batch,
   lbbatch:lbbatch,
   nbbatch:nbbatch,
   ibbatch,ibbatch,
   dpt:dpt,
   deptcat,deptcat,
   trainee:trainee,
   graduated:graduated,
   dropout:dropout,
   ontrainee:ontrainee
  
  })
  })
module.exports = router;

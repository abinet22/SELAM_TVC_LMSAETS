const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const Batch =db.batches;
const AppSelectionCriteria = db.appselectioncriterias;
const FunderInfo = db.funderinfo;
const LevelBasedProgram = db.levelbasedprograms;
const Department = db.departments;
const Occupation = db.occupations;
const NGOBasedProgram = db.ngobasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const LevelBasedTrainee = db.levelbasedtrainees;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const StaffList = db.stafflists;
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, async function(req, res) 
{
  const [userlist, metalclassl] = await sequelize.query(
    "SELECT * FROM stafflists INNER JOIN users ON users.fullname  = stafflists.staff_id "+
    " where staff_id = '"+req.user.fullname+"'"
   
    );
  res.render('dashboard',{user:userlist})

}
);
router.get('/report',ensureAuthenticated,async function(req,res){
   
  const batch = await Batch.count();
  const lbbatch = await LevelBasedProgram.count();
  const ibbatch = await IndustryBasedProgram.count();
  const nbbatch = await NGOBasedProgram.count();
  const dpt = await Department.count();
  const occcupation = await Occupation.findAll({where:{department_id:req.user.department}})
  const [deptcat, deptcatmeta] = await sequelize.query(
 "SELECT departments.department_name,count(levelbasedtrainees.department_id) as total FROM levelbasedtrainees inner join departments" +
"  on departments.department_id = levelbasedtrainees.department_id group by department_name");
const [graduated, gradmeta] = await sequelize.query(
" select  occupation_id,occupation_name, sum(trainee) as trainee from("+
"   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
 "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
"    group by occupation_id,occupation_name union"+
"   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
 "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
 "   group by occupation_id,occupation_name union"+
 "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
 "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
 "    group by occupation_id,occupation_name ) occupations "+
  " group by  occupation_id ,occupation_name"
);
const [ontrainee, ontraineemeta] = await sequelize.query(
" select  occupation_id,occupation_name, sum(trainee) as trainee from("+
"   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
 "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
"    group by occupation_id,occupation_name union"+
"   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
 "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
 "   group by occupation_id,occupation_name union"+
 "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
 "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
 "    group by occupation_id,occupation_name ) occupations "+
  " group by  occupation_id ,occupation_name"
);
const [dropout, dropoutmeta] = await sequelize.query(
" select  occupation_id,occupation_name, sum(trainee) as trainee from("+
"   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
 "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
 "    group by occupation_id,occupation_name union"+
"   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
 "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
 "   group by occupation_id,occupation_name union"+
 "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
 "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
"    group by occupation_id,occupation_name ) occupations "+
  " group by  occupation_id ,occupation_name"
);
  const [dptlevelngo, dptlevelnogometa] = await sequelize.query(
   " select  occupation_id,occupation_name, sum(trainee) as trainee from("+
   "   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
    "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+

    "    group by occupation_id,occupation_name union"+
   "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
    "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
   
    "   group by occupation_id,occupation_name union"+
    "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
    "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
  
    "    group by occupation_id,occupation_name ) occupations "+
     " group by  occupation_id ,occupation_name"
  );
  const trainee = await LevelBasedTrainee.count({});
//   const graduated = await LevelBasedTrainee.count({where:{is_graduated:"Yes"}});
//   const ontrainee = await LevelBasedTrainee.count({where:{is_graduated:"No"}});
 // const dropout = await LevelBasedTrainee.count({where:{is_graduated:"No",is_dropout:"Yes"}});
res.render('report',{batch:batch,
 lbbatch:lbbatch,
 nbbatch:nbbatch,
 ibbatch,ibbatch,
 occcupation:occcupation,
 
 dpt:dpt,
 dptlevelngo:dptlevelngo,
 deptcat,deptcat,
 trainee:trainee,
 graduated:graduated,
 dropout:dropout,
 ontrainee:ontrainee

})
})



router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/trainer/dashboard',
        failureRedirect: '/trainer/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/trainer/login');
});


module.exports = router;

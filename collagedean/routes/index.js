const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const Batch = db.batches;
const Department = db.departments;
const LevelBasedTrainee = db.levelbasedtrainees;
const NGOBasedTrainee = db.ngobasedtrainees;
const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const NGOBasedProgram = db.ngobasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const LevelBasedProgram = db.levelbasedprograms;

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{user:req.user}));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dean/dashboard',
        failureRedirect: '/dean/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/dean/login');
});
router.get('/statistics',ensureAuthenticated,async function(req, res)  {
    const [traineebatch, classevalmeta] = await sequelize.query(
        "SELECT batches.batch_name,count(levelbasedtrainees.trainee_id) as total FROM levelbasedtrainees inner join batches on batches.batch_id=levelbasedtrainees.batch_id group by batches.batch_name  "
      );
    res.render('statistics',{
        traineebatch:traineebatch
    })
});

router.get('/report',ensureAuthenticated,async function(req,res){
   
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

module.exports = router;

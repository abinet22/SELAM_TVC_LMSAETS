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
const JBSStudentData = db.jbsstudentdatas;

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, async function (req, res){
  const currentYear = new Date().getFullYear();
console.log(currentYear); // 👉️2022

const firstDay = new Date(currentYear, 0, 1);
console.log(firstDay); // 👉️ Sat Jan 01 2022
const lyfirstDay = new Date(currentYear-1, 0, 1);
const lastDay = new Date(currentYear, 11, 31);
console.log(lyfirstDay);
console.log(firstDay);
console.log(lastDay);
  const tyjbsdata=  await JBSStudentData.count({where: {
    createdAt: {
      [Op.and]: {
        [Op.gte]: firstDay,
        [Op.lte]: lastDay
      }
    }
} });
const lyjbsdata=  await JBSStudentData.count({where: {
  createdAt: {
    [Op.and]: {
      [Op.gte]: lyfirstDay,
      [Op.lte]: firstDay
    }
  }
} });
const total = await JBSStudentData.count({});
 
  res.render('dashboard',{
    lyjbsdata:lyjbsdata,
    tyjbsdata:tyjbsdata,
    total:total
  })
} );

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/jbsdataencoder/dashboard',
        failureRedirect: '/jbsdataencoder/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/jbsdataencoder/login');
});

module.exports = router;

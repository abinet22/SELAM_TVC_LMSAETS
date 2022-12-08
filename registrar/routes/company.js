const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const Company = db.companies;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const uploadFile = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get('/allcompanylist',ensureAuthenticated,async function(req,res){
    const companylist = await Company.findAll({});
    res.render('allcompanylist',{
       companylist:companylist
    });
})


module.exports = router;
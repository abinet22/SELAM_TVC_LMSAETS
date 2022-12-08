const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const StaffList = db.stafflists;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');

const uploadFile = require('../middleware/upload.js');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get('/allstafflist',ensureAuthenticated,async function(req,res){
    const staff = await StaffList.findAll({});
    res.render('allstafflist',{
       stafflist:staff
    });
})


module.exports = router;
const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const AppSelectionCriteria = db.appselectioncriterias;
const FunderInfo = db.funderinfo;
const StaffList  =db.stafflists;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Department = db.departments;

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/alldatahistory', ensureAuthenticated, (req, res) => res.render('alldatahistory'));

module.exports = router;
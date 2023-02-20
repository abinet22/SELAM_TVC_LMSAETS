const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const AppSelectionCriteria = db.appselectioncriterias;
const FunderInfo = db.funderinfo;
const StaffList  =db.stafflists;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const fs = require('fs')
const mysqldump = require('mysqldump');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Department = db.departments;

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/alldatahistory', ensureAuthenticated, (req, res) => res.render('alldatahistory'));
router.post('/backupdatabase', ensureAuthenticated,async function (req, res) 
{

    const now = new Date();
    const dateString = now.toJSON().substring(0, 16).replace(":", "");
    const filename = `Selam_TVC_LMS_DB_BackUp_DateOn-${now}.sql`;
    const path =  filename;
  
    const result =  await mysqldump({
      connection: {
        user: "admin",
        host: "localhost",
        password: "R1445o123/",
        database: "selamlmsets"
      },
      dumpToFile: filename,
     // compressFile: true,
    });
    if(result){
      const file = `./`+filename;
 
      res.download(file);
    }
    
 // 
});

module.exports = router;
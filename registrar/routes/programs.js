const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const LevelBasedProgram = db.levelbasedprograms;
const Batch = db.batches;
const NGOBasedProgram  = db.ngobasedprograms;
const AppSelectionCriteria = db.appselectioncriterias;
const Course = db.courses;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { funderinfo } = require('../models');

router.get('/newlevelbased', ensureAuthenticated,async function (req, res) 
{
    const [results, metadata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where is_open='Yes'"
      );
      
      console.log(JSON.stringify(results, null, 2));
    console.log(results);
        LevelBasedTraining.findAll({}).then(levelbased =>{
            res.render('newlevelbased',{
                levelbased:results,
                industrybased:'',
                ngobased:''
            })
        }).catch(error =>{
            res.render('newlevelbased',{
                levelbased:'',
                industrybased:'',
                ngobased:''
            })
        })
});
router.get('/newngobased', ensureAuthenticated, async function(req, res) {
    
    const [results, metadata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
      );
      const funderinfo = await FunderInfo.findAll({});
      console.log(JSON.stringify(results, null, 2));
    console.log(results);
        NGOBasedTraining.findAll({}).then(levelbased =>{
            res.render('newngobased',{
                levelbased:results,
                industrybased:'',
                ngobased:results,
                funderinfo:funderinfo
            })
        }).catch(error =>{
            res.render('newngobased',{
                levelbased:'',
                industrybased:'',
                ngobased:''
            })
        })

});
router.get('/newindustrybased', ensureAuthenticated,async function (req, res){
    const [results, metadata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      
      console.log(JSON.stringify(results, null, 2));
    console.log(results);
        LevelBasedTraining.findAll({}).then(levelbased =>{
            res.render('newindustrybased',{
                levelbased:results,
                industrybased:'',
                ngobased:''
            })
        }).catch(error =>{
            res.render('newindustrybased',{
                levelbased:'',
                industrybased:'',
                ngobased:'',
                funderinfo:funderinfo
            })
        })
});
router.get('/allprogramlist', ensureAuthenticated, async function (req, res) {

//    const industrybased  = await IndustryBasedProgram.findAll({});
//    const ngobased  = await NGOBasedProgram.findAll({});

   const [results, metadata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  
  console.log(JSON.stringify(results, null, 2));
console.log(results);
    LevelBasedTraining.findAll({}).then(levelbased =>{
        res.render('programlist',{
            levelbased:results,
            industrybased:'',
            ngobased:''
        })
    }).catch(error =>{
        res.render('programlist',{
            levelbased:'',
            industrybased:'',
            ngobased:''
        })
    })


});



module.exports = router;
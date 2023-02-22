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
const TraineeCOCHistory = db.traineecochistory;
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
  const tyjbsdata=  await LevelBasedTrainee.count({where: {
    createdAt: {
      [Op.and]: {
        [Op.gte]: firstDay,
        [Op.lte]: lastDay
      }
    
    },
    is_graduated:'Yes'
} });
const lyjbsdata=  await LevelBasedTrainee.count({where: {
  createdAt: {
    [Op.and]: {
      [Op.gte]: lyfirstDay,
      [Op.lte]: firstDay
    }
  },
  is_graduated:'Yes'
} });
const total = await LevelBasedTrainee.count({where:{   is_graduated:'Yes'}});
const [tyjbsdatact,mt1] =  await sequelize.query("select count(distinct trainee_id) as tot from traineecochistories where createdAt between '"+new Date(firstDay).toISOString()+"' and '"+new Date(lastDay).toISOString()+"'")
const [lyjbsdatal,mt]=  await sequelize.query("select count(distinct trainee_id) as tot from traineecochistories where createdAt between '"+new Date(lyfirstDay).toISOString()+"' and '"+new Date(firstDay).toISOString()+"'")
const [totalc,totmete] = await sequelize.query("select count(distinct trainee_id) as tot from traineecochistories ")
console.log(new Date(lastDay).toISOString())
console.log(new Date(firstDay))
const totalcp =  await LevelBasedTrainee.count({where: {
  is_pass_coc:'PASS'
} });
const totalcf =  await LevelBasedTrainee.count({where: {
  is_pass_coc:'FAIL'
} });
  res.render('dashboard',{
    lyjbsdata:lyjbsdata,
    tyjbsdata:tyjbsdata,
    total:total,
    lyjbsdatacl:lyjbsdatal,
    tyjbsdatact:tyjbsdatact,
    totalchis:totalc,
   
    totalcp:totalcp,
    totalcf:totalcf
  })
} );


router.get('/changepassword', ensureAuthenticated, (req, res) => res.render('changepassword'));

router.post('/changepassword',ensureAuthenticated,async function (req, res)  {
  const {oldpass,newpass,newpassre} = req.body;
  let errors =[];
if(!oldpass || !newpass || !newpassre){
errors.push({msg:"please enter all required fields!"})
}

if(newpass != newpassre){
  errors.push({msg:"your new password and re-type password are not the same!"}) 
}

if(errors.length >0){
res.render('changepassword',{errors})
}
else{
  User.findOne({where:{userid:req.user.userid}}).then(user =>{
      if(user){
          var op = user.password;
          bcrypt.compare(oldpass,op, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                  bcrypt.hash(newpass, 10, (err, hash) => {
     
                      User.update({password:hash},{where:{userid:req.user.userid}}).then(user =>{
                          res.render('changepassword',{success_msg:"You Are Successfully Update Your Password "})
                       }).catch(err =>{
                          res.render('changepassword',{error_msg:'Error While Change Password'})
                       })
                      }); 
              } else{
                  res.render('changepassword',{error_msg:'Old Password Not Correct'})
              }
            });
      }else{
          res.render('changepassword',{error_msg:'User Not Find Try Later'})
      }
  }).catch(err =>{
      console.log(err)
      res.render('changepassword',{error_msg:'Error While Change Password'})
                  
  })
 


}

}); 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/coc/dashboard',
        failureRedirect: '/coc/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/coc/login');
});

module.exports = router;

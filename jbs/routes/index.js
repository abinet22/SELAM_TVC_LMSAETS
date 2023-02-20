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
        successRedirect: '/jbs/dashboard',
        failureRedirect: '/jbs/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/jbs/login');
});
router.get('/createdataencoder',async function(req, res)  {
    const stafflist = await StaffList.findAll({});
  res.render('createdataencoder',{stafflist:stafflist})
});
router.get('/alldataencoderlist',ensureAuthenticated,async function(req,res){
    const userlist = await User.findAll({where:{userroll:"JBS_DATA_ENCODER"}});
    res.render('alldataencoderlist',{userlist:userlist,tag:"All"})
})
router.post('/addnewregistrardataencoder', ensureAuthenticated,async function (req, res, next) {

    const {userroll,staffmember,username,password,repassword} = req.body;
    const stafflist = await StaffList.findAll({});
     let errors =[];
   if(userroll =="0" || staffmember =="0" || !username || !password || !repassword){
       errors.push({msg:'please enter all required field values'})
   }
   if( password != repassword){
    errors.push({msg:'please retype password'})
   }
    if (errors.length > 0) {
        res.render('createdataencoder', {
            errors,
            stafflist:stafflist,
                 });
    } else {
  
      User.findAll({
            where: {
              username: username
            }
        }).then(user => {
            const v1options = {
                node: [0x01, 0x23],
                clockseq: 0x1234,
                msecs: new Date('2011-11-01').getTime(),
                nsecs: 5678,
              };
              userid = uuidv4(v1options);
             const userData = {
                userid:userid,
                username: username,
                password: password,
                userroll:userroll,
                isactive: "Yes",
                fullname: staffmember,
                department:""
             }
                if (user.length ==0 ) {
                    bcrypt.hash(password, 10, (err, hash) => {
                    userData.password = hash;
  
    
                    User.create(userData)
                        .then(data => {
                          res.render('createdataencoder',{stafflist:stafflist,success_msg:'Successfully create registrar data enncoder credentials'})
                        }).catch(err => {
                         
                        }) // end of then catch for create method
                    }); // 
                } else {
                    res.render('createdataencoder',{stafflist:stafflist,
                        error_msg:'please change username user name already registered'})
                         
                }
            }).catch(err => {
                res.render('createdataencoder',{stafflist:stafflist,
                    error_msg:'cant create data encoder credential please try later'})
                      
            }); // end of then catch for findOne method 
    
  
  
    }
  
   
  });
  router.post('/diactivatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const userlist = await User.findAll({where:{userroll:"JBS_DATA_ENCODER"}});
    User.update({isactive:"No"},{where:{userid:req.params.userid}}).then(user =>{
        res.render('alldataencoderlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
         res.render('alldataencoderlist',{userlist:userlist,erroe_msg:'cant update now try later'})
        
    })
    
    });
  router.post('/activatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const userlist = await User.findAll({where:{userroll:"JBS_DATA_ENCODER"}});
    User.update({isactive:"Yes"},{where:{userid:req.params.userid}}).then(user =>{
       
        res.render('alldataencoderlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
      
        res.render('alldataencoderlist',{userlist:userlist,erroe_msg:'cant update now try later'})
        
    })
      });



router.get('/searchsinglestudentdata',ensureAuthenticated,async function(req,res){
  
  res.render('searchsingleuserdata')
})
router.post('/searchsingleuserdata',ensureAuthenticated,async function(req,res){
  const{programtype,traineeid} = req.body;
  let errors = [];
  if(programtype =="0" || !traineeid){
    errors.push({msg:'please enter all requires fields'})
  }
  if(errors.length >0){
    res.render('searchsingleuserdata',{
      error_msg:'please enter all requred fields'
    })
  }
  else{
    if(programtype=="level"){

      LevelBasedTrainee.findOne({where:{student_unique_id:traineeid}}).then(student =>{
        res.render('singlestudentdata')
      }).catch(error =>{
        res.render('searchsingleuserdata',{
          error_msg:'something is wrong please try later'
        })
      })
     
    }else if(programtype =="ngo"){
     
      NGOBasedTrainee.findOne({where:{student_unique_id:traineeid}}).then(student =>{
        res.render('singlestudentdata')
      }).catch(error =>{
        res.render('searchsingleuserdata',{
          error_msg:'something is wrong please try later'
        })
      })
    }else if(programtype =="industry"){
      
      IndustryBasedTrainee.findOne({where:{student_unique_id:traineeid}}).then(student =>{
        res.render('singlestudentdata')
      }).catch(error =>{
        res.render('searchsingleuserdata',{
          error_msg:'something is wrong please try later'
        })
      })
    }
    
  }

})
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
module.exports = router;

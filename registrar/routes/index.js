const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const StaffList = db.stafflists;
const Batch = db.batches;
const LevelBasedProgram = db.levelbasedprograms;
const NGOBasedProgram = db.ngobasedprograms;
const IndustryBasedProgram = db.industrybasedprogram;
const LevelBasedTrainee = db.levelbasedtrainees;
const Department =db.departments;
const NGOBasedTrainee = db.ngobasedtrainees;
const IndustryBasedTrainee = db.industrybasedtrainees;
const AppSelectionCriteria = db.appselectioncriterias;
const NewApplicant = db.newapplicants;
const FunderInfo = db.funderinfo;
const Occupation =db.occupations;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const IndustryBasedTraining = require('../models/IndustryBasedTraining');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{user:req.user}));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/registrar/dashboard',
        failureRedirect: '/registrar/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/registrar/login');
});
router.get('/createdataencoder',async function(req, res)  {
    const stafflist = await StaffList.findAll({});
  res.render('createdataencoder',{stafflist:stafflist})
});
router.get('/alldataencoderlist',ensureAuthenticated,async function(req,res){
    const [userlist,usermeata] = await sequelize.query(
      " select * from users inner join stafflists on"+
      " stafflists.staff_id = users.fullname"+
      " where users.userroll='REGISTRAR_DATA_ENCODER' "
    )
  
    res.render('alldataencoderlist',{userlist:userlist})
})
router.post('/addnewregistrardataencoder', ensureAuthenticated,async function (req, res, next) {

    const {userroll,staffmember,username,password,repassword} = req.body;
    const stafflist = await StaffList.findAll({});
     let errors =[];
   if(userroll =="0" || staffmember =="0" || !username || !password || !repassword){
       errors.push({msg:'Please enter all required field values'})
   }
   if( password != repassword){
    errors.push({msg:'Please retype password'})
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
                        error_msg:'Please change user name user name already registered'})
                         
                }
            }).catch(err => {
                res.render('createdataencoder',{stafflist:stafflist,
                    error_msg:'Cant create data encoder credential please try later'})
                      
            }); // end of then catch for findOne method 
    
  
  
    }
  
   
  });
  router.post('/diactivatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const [userlist,usermeata] = await sequelize.query(
      " select * from users inner join stafflists on"+
      " stafflists.staff_id = users.fullname"+
      " where users.userroll='REGISTRAR_DATA_ENCODER' "
    )
    User.update({isactive:"No"},{where:{userid:req.params.userid}}).then(user =>{
        res.render('alldataencoderlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
         res.render('alldataencoderlist',{userlist:userlist,erroe_msg:'cant update now try later'})
        
    })
    
    });
  router.post('/activatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const [userlist,usermeata] = await sequelize.query(
      " select * from users inner join stafflists on"+
      " stafflists.staff_id = users.fullname"+
      " where users.userroll='REGISTRAR_DATA_ENCODER' "
    )
    User.update({isactive:"Yes"},{where:{userid:req.params.userid}}).then(user =>{
       
        res.render('alldataencoderlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
      
        res.render('alldataencoderlist',{userlist:userlist,erroe_msg:'cant update now try later'})
        
    })
      });
      router.get('/statistics',ensureAuthenticated,async function(req, res)  {
        const [traineebatch, classevalmeta] = await sequelize.query(
        "  select batches.batch_name,sum(total)as total from ( SELECT batches.batch_name,count(levelbasedtrainees.trainee_id) as total FROM levelbasedtrainees "+
        "  inner join batches on batches.batch_id=levelbasedtrainees.batch_id "+
        "inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
         
        " group by batches.batch_name  union"+
        "  SELECT batches.batch_name,count(ngobasedtrainees.trainee_id) as total FROM ngobasedtrainees "+
        "  inner join batches on batches.batch_id=ngobasedtrainees.batch_id "+
        "inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
        
        " group by batches.batch_name union  "+
    "       SELECT batches.batch_name,count(industrybasedtrainees.trainee_id) as total FROM industrybasedtrainees "+
        "  inner join batches on batches.batch_id=industrybasedtrainees.batch_id "+
        "inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
       
        " group by batches.batch_name  ) batches "+
         " group by batches.batch_name"
             
          );
          const [occtrainee, occtraineebatch] = await sequelize.query(
    
      " select  batches.batch_name,occupation_name,sum(total)as total from ( "+
        " SELECT batches.batch_name,occupation_name,count(levelbasedtrainees.trainee_id) as total FROM levelbasedtrainees "+
        "  inner join batches on batches.batch_id=levelbasedtrainees.batch_id "+
       "   inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
  
        "   group by batches.batch_name, occupation_name union"+
          "  SELECT batches.batch_name ,occupation_name,count(ngobasedtrainees.trainee_id) as total FROM ngobasedtrainees "+
    "        inner join batches on batches.batch_id=ngobasedtrainees.batch_id "+
        "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
   
         "  group by batches.batch_name,occupation_name union  "+
         " SELECT batches.batch_name ,occupation_name,count(industrybasedtrainees.trainee_id) as total FROM"+ 
      " industrybasedtrainees "+
          " inner join batches on batches.batch_id=industrybasedtrainees.batch_id "+
        " inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
       
         " group by batches.batch_name ,occupation_name ) batches "+
         " group by  batches.batch_name ,occupation_name"
          )
        res.render('statistics',{
            traineebatch:traineebatch,
            occtrainee:occtrainee
        })
    });
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
      " where levelbasedtrainees.is_graduated='Yes' "+
         "    group by occupation_id,occupation_name union"+
        "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
         "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
        " where ngobasedtrainees.is_graduated='Yes' " +
         "   group by occupation_id,occupation_name union"+
         "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
         "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
         " where industrybasedtrainees.is_graduated='Yes' "+
         "    group by occupation_id,occupation_name ) occupations "+
          " group by  occupation_id ,occupation_name"
       );
       const [ontrainee, ontraineemeta] = await sequelize.query(
        " select  occupation_id,occupation_name, sum(trainee) as trainee from("+
        "   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
         "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
      " where levelbasedtrainees.is_graduated='No' "+
         "    group by occupation_id,occupation_name union"+
        "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
         "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
        " where ngobasedtrainees.is_graduated='No' " +
         "   group by occupation_id,occupation_name union"+
         "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
         "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
         " where industrybasedtrainees.is_graduated='No' "+
         "    group by occupation_id,occupation_name ) occupations "+
          " group by  occupation_id ,occupation_name"
       );
       const [dropout, dropoutmeta] = await sequelize.query(
        " select  occupation_id,occupation_name, sum(trainee) as trainee from("+
        "   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
         "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
      " where levelbasedtrainees.is_graduated='No'  and levelbasedtrainees.is_dropout='Yes'"+
         "    group by occupation_id,occupation_name union"+
        "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
         "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
        " where ngobasedtrainees.is_graduated='No' and ngobasedtrainees.is_dropout='Yes'" +
         "   group by occupation_id,occupation_name union"+
         "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
         "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
         " where industrybasedtrainees.is_graduated='No'  and industrybasedtrainees.is_dropout='Yes'"+
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
module.exports = router;

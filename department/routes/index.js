const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const AppSelectionCriteria = db.appselectioncriterias;
const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Occupation = db.occupations;
const Batch  = db.batches;
const Department = db.departments;
const NGOBasedProgram = db.ngobasedprograms;
const LevelBasedProgram = db. levelbasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const LevelBasedTrainee = db.levelbasedtrainees;
const NGOBasedTrainee  = db.ngobasedtrainees;
const Notification = db.notifications;
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, async function(req, res) { 
   const departments = await Department.findOne({where:{department_id:req.user.department}})
   const note = await Notification.findAll({where:{noteto:req.user.department,is_read:'No'}})
 
   res.render('dashboard',{department:departments,user:req.user,note:note})
});
router.post('/updatenotificationasread/(:noteid)', ensureAuthenticated,async function (req, res) 
{
  const departments = await Department.findOne({where:{department_id:req.user.department}})
 
  Notification.findOne({where:{note_id:req.params.noteid}}).then(note =>{
    if(note){
      Notification.update({is_read:'Yes'},{where:{note_id:req.params.noteid}}).then(nt =>{
        Notification.findAll({where:{noteto:req.user.department,is_read:'No'}}).then(notenew=>{
          res.render('dashboard',{department:departments,user:req.user  ,note:notenew})
        }).catch(err =>{
          res.render('dashboard',{department:departments,user:req.user  ,note:''})
        })
        
      }).catch(err =>{
        res.render('dashboard',{department:departments,user:req.user ,note:''})
      })
    }
  }).catch(err =>{
    res.render('dashboard',{department:departments,user:req.user  ,note:''})
        })


});
router.get('/addnewfunder', ensureAuthenticated, (req, res) => res.render('addnewfunder'));
router.get('/addselectcriteria', ensureAuthenticated, (req, res) => res.render('addselectcriteria'));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/department/dashboard',
        failureRedirect: '/department/login',
        failureFlash: true
    })(req, res, next);
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
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/department/login');
});

router.get('/statistics',ensureAuthenticated,async function(req, res)  {
    const [traineebatch, classevalmeta] = await sequelize.query(
    "  select batches.batch_name,sum(total)as total from ( SELECT batches.batch_name,count(levelbasedtrainees.trainee_id) as total FROM levelbasedtrainees "+
    "  inner join batches on batches.batch_id=levelbasedtrainees.batch_id "+
    "inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
     " where occupations.department_id = '"+req.user.department+"'"+
    " group by batches.batch_name  union"+
    "  SELECT batches.batch_name,count(ngobasedtrainees.trainee_id) as total FROM ngobasedtrainees "+
    "  inner join batches on batches.batch_id=ngobasedtrainees.batch_id "+
    "inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
     " where occupations.department_id = '"+req.user.department+"'"+
    " group by batches.batch_name union  "+
"       SELECT batches.batch_name,count(industrybasedtrainees.trainee_id) as total FROM industrybasedtrainees "+
    "  inner join batches on batches.batch_id=industrybasedtrainees.batch_id "+
    "inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
     " where occupations.department_id = '"+req.user.department+"'"+
    " group by batches.batch_name  ) batches "+
     " group by batches.batch_name"
         
      );
      const [occtrainee, occtraineebatch] = await sequelize.query(

  " select  batches.batch_name,occupation_name,sum(total)as total from ( "+
    " SELECT batches.batch_name,occupation_name,count(levelbasedtrainees.trainee_id) as total FROM levelbasedtrainees "+
    "  inner join batches on batches.batch_id=levelbasedtrainees.batch_id "+
   "   inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
"       where occupations.department_id = '"+req.user.department+"'"+
    "   group by batches.batch_name, occupation_name union"+
      "  SELECT batches.batch_name ,occupation_name,count(ngobasedtrainees.trainee_id) as total FROM ngobasedtrainees "+
"        inner join batches on batches.batch_id=ngobasedtrainees.batch_id "+
    "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
"       where occupations.department_id = '"+req.user.department+"'"+
     "  group by batches.batch_name,occupation_name union  "+
     " SELECT batches.batch_name ,occupation_name,count(industrybasedtrainees.trainee_id) as total FROM"+ 
  " industrybasedtrainees "+
      " inner join batches on batches.batch_id=industrybasedtrainees.batch_id "+
    " inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
    "  where occupations.department_id = '"+req.user.department+"'"+
     " group by batches.batch_name ,occupation_name ) batches "+
     " group by  batches.batch_name ,occupation_name"
      )
    res.render('statistics',{
        traineebatch:traineebatch,
        occtrainee:occtrainee
    })
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
  " where levelbasedtrainees.is_graduated='Yes' and occupations.department_id = '"+req.user.department+"'"+
     "    group by occupation_id,occupation_name union"+
    "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
     "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
    " where ngobasedtrainees.is_graduated='Yes' and occupations.department_id = '"+req.user.department+"'" +
     "   group by occupation_id,occupation_name union"+
     "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
     "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
     " where industrybasedtrainees.is_graduated='Yes' and occupations.department_id = '"+req.user.department+"'"+
     "    group by occupation_id,occupation_name ) occupations "+
      " group by  occupation_id ,occupation_name"
   );
   const [ontrainee, ontraineemeta] = await sequelize.query(
    " select  occupation_id,occupation_name, sum(trainee) as trainee from("+
    "   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
     "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
  " where levelbasedtrainees.is_graduated='No' and occupations.department_id = '"+req.user.department+"'"+
     "    group by occupation_id,occupation_name union"+
    "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
     "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
    " where ngobasedtrainees.is_graduated='No' and occupations.department_id = '"+req.user.department+"'" +
     "   group by occupation_id,occupation_name union"+
     "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
     "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
     " where industrybasedtrainees.is_graduated='No' and occupations.department_id = '"+req.user.department+"'"+
     "    group by occupation_id,occupation_name ) occupations "+
      " group by  occupation_id ,occupation_name"
   );
   const [dropout, dropoutmeta] = await sequelize.query(
    " select  occupation_id,occupation_name, sum(trainee) as trainee from("+
    "   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
     "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
  " where levelbasedtrainees.is_graduated='No' and occupations.department_id = '"+req.user.department+"' and levelbasedtrainees.is_dropout='Yes'"+
     "    group by occupation_id,occupation_name union"+
    "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
     "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
    " where ngobasedtrainees.is_graduated='No' and occupations.department_id = '"+req.user.department+"' and ngobasedtrainees.is_dropout='Yes'" +
     "   group by occupation_id,occupation_name union"+
     "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
     "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
     " where industrybasedtrainees.is_graduated='No' and occupations.department_id = '"+req.user.department+"' and industrybasedtrainees.is_dropout='Yes'"+
     "    group by occupation_id,occupation_name ) occupations "+
      " group by  occupation_id ,occupation_name"
   );
      const [dptlevelngo, dptlevelnogometa] = await sequelize.query(
       " select  occupation_id,occupation_name, sum(trainee) as trainee from("+
       "   select occupation_id,occupation_name,count(*) as trainee from levelbasedtrainees "+
        "  inner join occupations on levelbasedtrainees.department_id = occupations.occupation_id"+
     " where occupations.department_id = '"+req.user.department+"'"+
        "    group by occupation_id,occupation_name union"+
       "   select occupation_id,occupation_name,count(*) as trainee from ngobasedtrainees"+
        "  inner join occupations on ngobasedtrainees.department_id = occupations.occupation_id"+
        " where occupations.department_id = '"+req.user.department+"'"+
        "   group by occupation_id,occupation_name union"+
        "  select occupation_id,occupation_name, count(*) as trainee from industrybasedtrainees"+
        "  inner join occupations on industrybasedtrainees.department_id = occupations.occupation_id"+
        " where occupations.department_id = '"+req.user.department+"'"+
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

module.exports = router;

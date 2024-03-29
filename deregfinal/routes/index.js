const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const AppSelectionCriteria = db.appselectioncriterias;
const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const Notification = db.notifications;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, async function(req, res) 
{
    const note = await Notification.findAll({where:{noteto:'REGISTRAR_DATA_ENCODER',is_read:'No'}})
 
    const [userlist, metalclassl] = await sequelize.query(
        "SELECT * FROM stafflists INNER JOIN users ON users.fullname  = stafflists.staff_id "+
        " where staff_id = '"+req.user.fullname+"' and userroll='REGISTRAR_DATA_ENCODER'"
       
        );
  console.log(userlist)
  

  res.render('dashboard',{user:userlist,note:note})

}
);
/* This is a post method that is used to update the notification as read. */
router.post('/updatenotificationasread/(:noteid)', ensureAuthenticated,async function (req, res) 
{
    const [userlist, metalclassl] = await sequelize.query(
        "SELECT * FROM stafflists INNER JOIN users ON users.fullname  = stafflists.staff_id "+
        " where staff_id = '"+req.user.fullname+"' and userroll='REGISTRAR_DATA_ENCODER'"
       
        );
  Notification.findOne({where:{note_id:req.params.noteid}}).then(note =>{
    if(note){
      Notification.update({is_read:'Yes'},{where:{note_id:req.params.noteid}}).then(nt =>{
        Notification.findAll({where:{noteto:'REGISTRAR_DATA_ENCODER',is_read:'No'}}).then(notenew=>{
          res.render('dashboard',{user:userlist ,note:notenew})
        }).catch(err =>{
          res.render('dashboard',{user:userlist ,note:''})
        })
        
      }).catch(err =>{
        res.render('dashboard',{user:userlist ,note:''})
      })
    }
  }).catch(err =>{
    res.render('dashboard',{user:userlist ,note:''})
        })


});
router.get('/addnewfunder', ensureAuthenticated, (req, res) => res.render('addnewfunder'));
router.get('/addselectcriteria', ensureAuthenticated, (req, res) => res.render('addselectcriteria'));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/registrardataencoder/dashboard',
        failureRedirect: '/registrardataencoder/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/registrardataencoder/login');
});
router.get('/notifications',async function(req, res)  {
  res.render('notificationlist')
});

router.post('/register', ensureAuthenticated,async function (req, res, next) {

    const {email,password} = req.body;

    const userData = {
        userid: "1",
        password: password,
      userroll:"admin",
       fullname:"abinet",
       isactive:"Yes",
       username:email
     
    }
  let errors =[];
   
    if (errors.length > 0) {
        res.render('login', {
            errors,
           userData
        });
    } else {
  
      User.findAll({
            where: {
              username: email
            }
        }).then(user => {
          //console.log(user);
          console.log(user);
                if (user.length ==0 ) {
                    bcrypt.hash(password, 10, (err, hash) => {
                    userData.password = hash;
  
    
                    User.create(userData)
                        .then(data => {
                          res.render('login',{success_msg:'Successfully Created'})
                        }).catch(err => {
                         
                        }) // end of then catch for create method
                    }); // 
                } else {
                 
                }
            }).catch(err => {
                res.send('ERROR: ' + err)
            }); // end of then catch for findOne method 
    
  
  
    }
  
   
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

router.post('/addnewfunder', ensureAuthenticated, async function(req, res) 
{
    let error = [];
    const{fundername,funderaddress,contactpersonphone,funderphone,email,contactperson,website} = req.body;
    
   if(!fundername || !funderaddress){
        error.push({msg:'Please add all required fields'})
   }

   if(error.length >0){
    res.render('addnewfunder',{
        error_msg:'Please insert all the required fields'
    })
   }
   else{
       FunderInfo.findOne({where:{
        funder_name:fundername,

       }}).then(funderinfo =>{
           if(funderinfo)
           {

            res.render('addnewfunder',{
                error_msg:'This funder is already registered please try later'
            })
           }
           else
           {
            const v1options = {
                node: [0x01, 0x23],
                clockseq: 0x1234,
                msecs: new Date('2011-11-01').getTime(),
                nsecs: 5678,
              };
              funderid = uuidv4(v1options);
        const funderData ={
            funder_email:email,
            funder_website:website,
            funder_phone:funderphone,
            funder_contact_name:contactperson,
            funder_contact_phone:contactpersonphone,
         
            funder_address:funderaddress,
            funder_name:fundername,
            funder_id:funderid
            
        }

        FunderInfo.create(funderData).then(funder =>{
            res.render('addnewfunder',{
                success_msg:'Your are successfully registered new  training program funder NGO'
            })
        }).catch(error =>{
            res.render('addnewfunder',{
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addnewfunder',{
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});
router.post('/addselectcriteria', ensureAuthenticated, async function(req, res) 
{

    const{criterianame} = req.body;
    let error = [];
 
   if(!criterianame  ){
        error.push({msg:'Please add all required fields'})
   }
  
   if(error.length >0){
    res.render('addselectcriteria',{
        error_msg:'Please insert all the required fields',
       
    })
   }
   else{
    AppSelectionCriteria.findOne({where:{
        criteria_name:criterianame,
        
       }}).then(criteria =>{
           if(criteria)
           {

            res.render('addselectcriteria',{
             
                error_msg:'This applicant selection criteria is already registered please try later'
            })
           }
           else
           {
            const v1options = {
                node: [0x01, 0x23],
                clockseq: 0x1234,
                msecs: new Date('2011-11-01').getTime(),
                nsecs: 5678,
              };
              criteriaid = uuidv4(v1options);
        const criteriaData ={
            criteria_id:criteriaid,
            criteria_name:criterianame,
            criteria_status:"Enabled"
       
        }

        AppSelectionCriteria.create(criteriaData).then(criteriadt =>{

            res.render('addselectcriteria',{  

                success_msg:'Your are successfully registered new applicant selection criteria '
            })
        }).catch(error =>{
            res.render('addnewdepartment',{
              
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addselectcriteria',{
        
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});
module.exports = router;

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
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{user:req.user}));
router.get('/addnewfunder', ensureAuthenticated, (req, res) => res.render('addnewfunder'));
router.get('/addselectcriteria', ensureAuthenticated, (req, res) => res.render('addselectcriteria'));
router.get('/changepassword', ensureAuthenticated, (req, res) => res.render('changepassword'));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
});

router.post('/changepassword',ensureAuthenticated,async function (req, res)  {
    const {oldpass,newpass,newpassre} = req.body;
    let errors =[];
if(!oldpass || !newpass || !newpassre){
errors.push("please enter all required fields!")
}

if(newpass != newpassre){
    errors.push("your new password and re-type password are not the same!") 
}
else{
    bcrypt.compare(oldpass, req.user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
            errors.push("please enter correct old password!")
        } 
      });
}
if(errors.length >0){
res.render('changepassword',{error_msg:errors})
}
else{
    bcrypt.hash(newpass, 10, (err, hash) => {
       
        User.update({password:hash},{where:{userid:req.user.userid}}).then(user =>{
            res.render('changepassword',{success_msg:"You Are Successfully Update Your Password "})
         }).catch(err =>{
            res.render('changepassword',{error_msg:errors})
         })
        }); // 

}

});  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
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
router.get('/addnewsystemuser',ensureAuthenticated, async function(req,res){

    const deptnames = await Department.findAll({});
    const stafflist = await StaffList.findAll({where:{isteacher:'No'}})
  const users = await User.findAll({});
     res.render('addusercredential',{
         deptlist:deptnames,
         stafflist:stafflist,
         userlist:users
     })

})
router.get('/allsystemuserlist',ensureAuthenticated,async function(req,res){
     const [users, metadata] = await sequelize.query("select * from users inner join stafflists on"+
" stafflists.staff_id=users.fullname");
    res.render('alluserlist',{
       
        userlist:users
    })
})
router.get('/allfunderlist',ensureAuthenticated,async function(req,res){
    const funder = await FunderInfo.findAll({});
    res.render('allfunderlist',{
      
        funder:funder
    })
})
router.get('/allselectioncriterialist',ensureAuthenticated,async function(req,res){
    const criteria = await AppSelectionCriteria.findAll({});
    res.render('allselectioncriterialist',{
      
        criteria:criteria
    })
})
router.post('/addnewsystemuser',ensureAuthenticated, async function(req, res) 
{
    const {username,password,repassword,userroll,deptname,staffmember} = req.body;
    const deptnames = await Department.findAll({});
    const stafflist = await StaffList.findAll({where:{isteacher:'No'}})
  const users = await User.findAll({});
    let errors = [];
 
    if (!username || !password || !repassword || !userroll ){
        errors.push({ msg: 'Please add all required fields' });
       
    }
  else if(userroll =="Department_Head" && deptname =="0" ){
    errors.push({ msg: 'Please add all required fields' });
   
   }
   else if(userroll == "0" || staffmember == "0" ){
    errors.push({ msg: 'Please add all required fields' });
   
   }
   else if( password != repassword)
    {
        errors.push({ msg: 'Please add all required fields' });
   
    }
   if(errors.length >0){
    res.render('addusercredential',{
        error_msg:'Please insert all the required fields',
        deptlist:deptnames,
        stafflist:stafflist,
        userlist:users
    })
   }
   else{
    User.findOne({where:{
        username:username,
        
       }}).then(user =>{
           if(user)
           {

            res.render('addusercredential',{
             
                error_msg:'This user name is already registered please change',
                deptlist:deptnames,
         stafflist:stafflist,
         userlist:users
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
              userid = uuidv4(v1options);
     
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
            var  newpassword = hash;
            const userData ={
          
                userid: userid,
                username: username,
                password: newpassword,
                userroll:userroll,
                isactive: "Yes",
                fullname: staffmember,
                department:deptname
           
            }

        User.create(userData).then(user =>{
           if(!user){
            res.render('addusercredential',{
              
                error_msg:'Something is wrong while saving data please try later',
                deptlist:deptnames,
         stafflist:stafflist,
         userlist:users
            })
           }
            res.render('addusercredential',{  

                success_msg:'Your are successfully registered new system user',
                deptlist:deptnames,
         stafflist:stafflist,
         userlist:users
            })
        }).catch(error =>{
            res.render('addusercredential',{
              
                error_msg:'Something is wrong while saving data please try later',
                deptlist:deptnames,
         stafflist:stafflist,
         userlist:users
            })
        })
            })
          });



           }
       }).catch(error =>{
           console.log(error)
        res.render('addselectcriteria',{
        
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});
router.post('/diactivatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const userlist = await User.findAll({});
    User.update({isactive:"No"},{where:{userid:req.params.userid}}).then(user =>{
        res.render('alluserlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
         res.render('alluserlist',{userlist:userlist,erroe_msg:'cant update now try later'})
        
    })
    
    });
  router.post('/activatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const userlist = await User.findAll({});
    User.update({isactive:"Yes"},{where:{userid:req.params.userid}}).then(user =>{
       
        res.render('alluserlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
      
        res.render('alluserlist',{userlist:userlist,erroe_msg:'cant update now try later'})
        
    })
      });
module.exports = router;

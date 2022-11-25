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
    let errors = [];
 
   if(!criterianame  ){
        errors.push({msg:'Please add all required fields'})
   }
  
   if(errors.length >0){
    res.render('addselectcriteria',{
       errors
       
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
           var str = criterianame.replace(/\s+/g, '_');
            const v1options = {
                node: [0x01, 0x23],
                clockseq: 0x1234,
                msecs: new Date('2011-11-01').getTime(),
                nsecs: 5678,
              };
              criteriaid = uuidv4(v1options);
        const criteriaData ={
            criteria_id:criteriaid,
            criteria_name:str,
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
    const stafflist = await StaffList.findAll({})
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
    errors.push({ msg: 'Please select department head' });
   
   }
   else if(userroll == "0" || staffmember == "0" ){
    errors.push({ msg: 'Please select staff memeber' });
   
   }
   else if( password != repassword)
    {
        errors.push({ msg: 'Please password didnt match' });
   
    }
   if(errors.length >0){
    res.render('addusercredential',{
        errors,
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
    const [userlist, metadata] = await sequelize.query("select * from users inner join stafflists on"+
    " stafflists.staff_id=users.fullname");
    User.update({isactive:"No"},{where:{userid:req.params.userid}}).then(user =>{
        res.render('alluserlist',{userlist:userlist,success_msg:'User status updated'})
        
    }).catch(error =>{
         res.render('alluserlist',{userlist:userlist,erroe_msg:'Cant update now try later'})
        
    })
    
    });
router.post('/activatesystemuser/(:userid)',ensureAuthenticated,async function(req,res){
    const [userlist, metadata] = await sequelize.query("select * from users inner join stafflists on"+
    " stafflists.staff_id=users.fullname");
User.update({isactive:"Yes"},{where:{userid:req.params.userid}}).then(user =>{
    
    res.render('alluserlist',{userlist:userlist,success_msg:'User status updated'})
    
}).catch(error =>{
    
    res.render('alluserlist',{userlist:userlist,erroe_msg:'Cant update now try later'})
    
})
    });
router.post('/updatefunderinfo/(:funderid)',ensureAuthenticated,async function(req,res){
 const{updateoption,updatevalue} = req.body;
 let errors =[];
 const funder = await FunderInfo.findAll({});
 if(updateoption ==0){
 errors.push({msg:'please select update option'})
 }
 if(!updateoption || !updatevalue){
    errors.push({msg:'please add all required fields'})
 }
 if(errors.length >0){
    res.render('allfunderlist',{funder:funder,errors})
         
 }
 else{
     if(updateoption =="Email"){
        FunderInfo.update({funder_email:updatevalue},{where:{funder_id:req.params.funderid}}).then(funders =>{
            FunderInfo.findAll({}).then(list =>{
                res.render('allfunderlist',{funder:list,success_msg:'Funder Info Updated'})
                  
            }).catch(err =>{
                res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
                     
            })
        }).catch(error =>{
            
            res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
            
        })
     }
     else if(updateoption=="Contact_Name"){
        FunderInfo.update({funder_contact_name:updatevalue},{where:{funder_id:req.params.funderid}}).then(funders =>{
    
            FunderInfo.findAll({}).then(list =>{
                res.render('allfunderlist',{funder:list,success_msg:'Funder Info Updated'})
                  
            }).catch(err =>{
                res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
                     
            })
        }).catch(error =>{
            
            res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
            
        })
     } else if(updateoption=="Contact_Phone"){
        FunderInfo.update({funder_contact_phone:updatevalue},{where:{funder_id:req.params.funderid}}).then(funders =>{
    
            FunderInfo.findAll({}).then(list =>{
                res.render('allfunderlist',{funder:list,success_msg:'Funder Info Updated'})
                  
            }).catch(err =>{
                res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
                     
            })
        }).catch(error =>{
            
            res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
            
        })   
     } else if(updateoption=="Office_Phone"){
        FunderInfo.update({funder_phone:updatevalue},{where:{funder_id:req.params.funderid}}).then(funders =>{
            FunderInfo.findAll({}).then(list =>{
                res.render('allfunderlist',{funder:list,success_msg:'Funder Info Updated'})
                  
            }).catch(err =>{
                res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
                     
            })
        }).catch(error =>{
            
            res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
            
        })  
    } else if(updateoption=="Office_Address"){
        FunderInfo.update({funder_address:updatevalue},{where:{funder_id:req.params.funderid}}).then(funders =>{
            FunderInfo.findAll({}).then(list =>{
                res.render('allfunderlist',{funder:list,success_msg:'Funder Info Updated'})
                  
            }).catch(err =>{
                res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
                     
            })
        }).catch(error =>{
            
            res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
            
        })    
    }
    
 }
  

    });
router.post('/deletefunderinfo/(:funderid)',ensureAuthenticated,async function(req,res){

     const funder = await FunderInfo.findAll({});
    FunderInfo.destroy({where:{funder_id:req.params.funderid}}).then(funderdeleted =>{
    FunderInfo.findAll({}).then(list =>{
        res.render('allfunderlist',{funder:list,success_msg:'Funder Info Deleted'})
          
    }).catch(err =>{
        res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
             
    })
}).catch(err =>{
    res.render('allfunderlist',{funder:funder,error_msg:'Cant update now try later'})
         
})

});
router.get('/allselectioncriterialist',ensureAuthenticated,async function(req,res){
    const criteria = await AppSelectionCriteria.findAll({});
    res.render('allselectioncriterialist',{
      
        criteria:criteria
    })
})
router.get('/disableselectioncriteria/(:criteriaid)',ensureAuthenticated,async function(req,res){
    const criteria = await AppSelectionCriteria.findAll({});

    AppSelectionCriteria.update({criteria_status:'Disabled'},{where:{criteria_id:req.params.criteriaid}}).then(funders =>{
        FunderInfo.findAll({}).then(list =>{
            res.render('allselectioncriterialist',{
      
                criteria:list
            })
        }).catch(err =>{
            res.render('allselectioncriterialist',{
      
                criteria:criteria
            })    
        })
    }).catch(error =>{
        
        res.render('allselectioncriterialist',{
      
            criteria:criteria
        })
    })
})
router.get('/enableselectioncriteria/(:criteriaid)',ensureAuthenticated,async function(req,res){
    const criteria = await AppSelectionCriteria.findAll({});

    AppSelectionCriteria.update({criteria_status:'Enabled'},{where:{criteria_id:req.params.criteriaid}}).then(funders =>{
        AppSelectionCriteria.findAll({}).then(list =>{
            res.render('allselectioncriterialist',{
      
                criteria:list
            })
        }).catch(err =>{
            res.render('allselectioncriterialist',{
      
                criteria:criteria
            })    
        })
    }).catch(error =>{
        
        res.render('allselectioncriterialist',{
      
            criteria:criteria
        })
    })
})
module.exports = router;

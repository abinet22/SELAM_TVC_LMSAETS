const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const SectorList = db.sectorlists;
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Occupation = db.occupations;
router.get('/addnewdepartment', ensureAuthenticated,async function (req, res) 
{

    const [deptlist, metadata] = await sequelize.query(
        "  select * from departments inner join sectorlists on departments.training_id = sectorlists.sector_id"
   
     );
const training = await SectorList.findAll({ });
    res.render('addnewdepartment',{
        training:training,
        deptlist:deptlist
    });

});

router.post('/updateoccupationname/(:occupationid)', ensureAuthenticated, async function(req, res) 
{
    const {newoccupationname} = req.body;
    const [results, metadata] = await sequelize.query(
        "  select occupation_id,courses.department_id,occupation_name,departments.department_name,training_level,sum(courses.training_hours) as trhour,sum(courses.training_cost) as trcost from courses "+
         " inner join occupations on  courses.department_id = occupations.occupation_id  "+
       "   inner join departments on  departments.department_id = occupations.department_id  "+
        "  group by occupation_id,courses.department_id,training_level,occupation_name,department_name"
     );
     
    
   
    if(!newoccupationname){
        res.render('alloccupationlist',{
             
            department:results,
            error_msg:"Please Insert New Occupation Name First!"
         })
    }
    else{
        Occupation.findAll({where:{occupation_id:req.params.occupationid}}).then(occ =>{
            if(!occ){
                res.render('alloccupationlist',{
             
                    department:results,
                    error_msg:"Cant Find Occupation With This ID Please Try Later!"
                 })
            }
            else{
                Occupation.update({occupation_name:newoccupationname},{where:{occupation_id:req.params.occupationid}}).then( occ =>{
                    res.render('alloccupationlist',{
             
                        department:results,
                        success_msg:"You are successfully update occupation name!"
                     })
                }).catch(err =>{
                    res.render('alloccupationlist',{
             
                        department:results,
                        error_msg:"Error Occur While Update Occupation Name Please Try Later!"
                     })
                })
            }
        }).catch(err =>{
            res.render('alloccupationlist',{
             
                department:results,
                error_msg:"Error Occur While Update Occupation Name Please Try Later!"
             })
        })
    }
});
router.post('/updatedepartmentname', ensureAuthenticated, async function(req, res)
{
  
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  console.log(copyItems);
    if(copyItems.length >0)
    {
        copyItems.forEach((item) => {

            var deptid = item.deptid;
     var deptname = item.deptname; 
     Department.findOne({where:{department_id:deptid}}).then(dept =>{
         if(dept){
            Department.update({department_name:deptname},{where:{department_id:deptid}})
       
         }
     
     }).catch(err=>{

     })
    
        }) 
        res.send({message:'success'})
    }
    else{
        res.send({message:'error'})
    }
} );
router.get('/addnewoccupation', ensureAuthenticated,async function (req, res) 
{

const dept = await Department.findAll({ });
    res.render('addnewoccupation',{
        dept:dept,
     
    });

});
router.get('/alldepartmentlist', ensureAuthenticated, async function (req, res) {

  
    const [results, metadata] = await sequelize.query(
     "SELECT * FROM departments INNER JOIN levelbasedtrainings ON departments.training_id = levelbasedtrainings.training_id"
   );
   
   res.render('alldepartmentlist',{
           
    department:results
 })
 
 
 });
 router.get('/alloccupationlist', ensureAuthenticated, async function (req, res) {

  
    const [results, metadata] = await sequelize.query(
      "  select occupation_id,courses.department_id,occupation_name,departments.department_name,training_level,sum(courses.training_hours) as trhour,sum(courses.training_cost) as trcost from courses "+
       " inner join occupations on  courses.department_id = occupations.occupation_id  "+
     "   inner join departments on  departments.department_id = occupations.department_id  "+
      "  group by courses.department_id,training_level,occupation_id, occupation_name,department_name"
   );
   
   res.render('alloccupationlist',{
           
    department:results
 })
 
 
 });
router.post('/addnewdepartment', ensureAuthenticated, async function(req, res) 
{

    const{trainingname,deptname} = req.body;
    let error = [];
    const training = await SectorList.findAll({});
    const [deptlist, metadata] = await sequelize.query(
        "  select * from departments inner join sectorlists on departments.training_id = sectorlists.sector_id"
   
     );

   if(!trainingname || !deptname ){
        error.push({msg:'Please add all required fields'})
   }
   else if(trainingname == "0" ){
    error.push({msg:'Please select name of sector name'})
   }
   if(error.length >0){
    res.render('addnewdepartment',{
        error_msg:'Please insert all the required fields',
        training:training,
 deptlist:deptlist
    })
   }
   else{
       Department.findOne({where:{
        training_id:trainingname,
        department_name:deptname
        
       }}).then(department =>{
           if(department)
           {

            res.render('addnewdepartment',{
                training:training,
 deptlist:deptlist,
                error_msg:'This department is already registered please try later'
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
              departmentid = uuidv4(v1options);
        const departmentData ={
           
            department_id:departmentid,
            department_name:deptname,
            training_id:trainingname,
            training_name:trainingname
          
        }

        Department.create(departmentData).then(department =>{
          Department.findAll({}).then(dptnew =>{
            res.render('addnewdepartment',{  training:training,deptlist:dptnew,

                success_msg:'Your are successfully registered new department '
            })
          }).catch(err =>{
            res.render('addnewdepartment',{
                training:training,
 deptlist:deptlist,
                error_msg:'Something is wrong while saving data please try later'
            })
          })
            
        }).catch(error =>{
            res.render('addnewdepartment',{
                training:training,
 deptlist:deptlist,
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addnewdepartment',{
            training:training,
 deptlist:deptlist,
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});


module.exports = router;

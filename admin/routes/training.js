const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const SectorList  = db.sectorlists;
const User = db.users;
const Occupation = db.occupations;
const Department = db.departments;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addsector', ensureAuthenticated, async function(req, res)
{
    const sectorlist  = await SectorList.findAll({});
    res.render('addsector',{
        sectorlist:sectorlist
    })
} );
router.post('/updatesectorname', ensureAuthenticated, async function(req, res)
{
    const sectorlist  = await SectorList.findAll({});
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

            var sectorid = item.sectorid;
     var sectorname = item.sectorname; 
     SectorList.findOne({where:{sector_id:sectorid}}).then(sector =>{
     if(sector){
     SectorList.update({sector_name:sectorname},{where:{sector_id:sectorid}})
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
router.get('/addlevelbased', ensureAuthenticated, (req, res) => res.render('addlevelbased'));
router.get('/addngobased', ensureAuthenticated, async function(req, res) {
    
    const funderinfo = await FunderInfo.findAll({});
    res.render('addngobased',{
        funderinfo:funderinfo
    })

});
router.get('/addindustrybased', ensureAuthenticated, (req, res) => res.render('addindustrybased'));

router.get('/alltraineelist', ensureAuthenticated, async function (req, res) {

   const industrybased  = await IndustryBasedTraining.findAll({});
   const [results, metadata] = await sequelize.query(
    "SELECT * FROM ngobasedtrainings INNER JOIN funderinfos ON funderinfos.funder_id = ngobasedtrainings.funder_id"
  );
  const [resultsnew, metadatanew] = await sequelize.query(
    "  select courses.department_id,occupation_name,departments.department_name,training_level,sum(courses.training_hours) as trhour,sum(courses.training_cost) as trcost from courses "+
     " inner join occupations on  courses.department_id = occupations.occupation_id  "+
   "   inner join departments on  departments.department_id = occupations.department_id  "+
    "  group by courses.department_id,training_level,occupation_name,department_name"
 );
  console.log(JSON.stringify(results, null, 2));
console.log(results);
    LevelBasedTraining.findAll({}).then(levelbased =>{
        res.render('traininglist',{
            department:resultsnew,
            industrybased:industrybased,
            ngobased:results
        })
    }).catch(error =>{
        res.render('traininglist',{
            levelbased:'',
            industrybased:'',
            ngobased:''
        })
    })


});
router.post('/addsector', ensureAuthenticated, async function(req, res) 
{
    let error = [];
    const{sectorname} = req.body;
 const sectorlistold  = await SectorList.findAll({});
   if(!sectorname){
        error.push({msg:'Please add all required fields'})
   }
   
   if(error.length >0){
    res.render('addsector',{
        error_msg:'Please insert all the required fields',
sectorlist:sectorlistold
    })
   }
   else{
    SectorList.findOne({where:{
        sector_name:sectorname
       
       }}).then(sectorlist =>{
           if(sectorlist)
           {

            res.render('addsector',{
                error_msg:'This  sector name  is already registered please try later',
              sectorlist:sectorlistold
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
              sectorid = uuidv4(v1options);
        const sectordata ={
            sector_name:sectorname,
            sector_id:sectorid,
         
        }

        SectorList.create(sectordata).then(sectors =>{
            if(sectors){
                SectorList.findAll({}).then(sectorlistnew =>{
                    res.render('addsector',{
                        success_msg:'Your are successfully registered new sector',
                        sectorlist:sectorlistnew
                    })
                }).catch(err =>{
                    res.render('addsector',{
                        error_msg:'Something is wrong while saving data please try later',
                        sectorlist:sectorlistold
                    })
                })
            }
         
        }).catch(error =>{
            res.render('addsector',{
                error_msg:'Something is wrong while saving data please try later',
                sectorlist:sectorlistold
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addsector',{
            error_msg:'Something is wrong please try later',
        sectorlist:sectorlistold
        })
       })
   }
   
   
});
router.post('/addlevelbasedtraining', ensureAuthenticated, async function(req, res) 
{
    let error = [];
    const{trainingname,trainingtype,traininglevel,trainingduration,trainingcost} = req.body;
   if(!trainingname || !trainingtype || !traininglevel || !trainingduration || !trainingcost){
        error.push({msg:'Please add all required fields'})
   }
   else if(traininglevel =="0" || trainingtype =="0"){
    error.push({msg:'Please select training level and type of training program'})
   }
   if(error.length >0){
    res.render('addlevelbased',{
        error_msg:'Please insert all the required fields'
    })
   }
   else{
       LevelBasedTraining.findOne({where:{
        training_name:trainingname
       
       }}).then(levelbasedtraining =>{
           if(levelbasedtraining)
           {

            res.render('addlevelbased',{
                error_msg:'This training program  is already registered please try later'
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
              trainingid = uuidv4(v1options);
        const levelbasedData ={
            training_cost:trainingcost,
            training_duration:trainingduration,
            training_type:trainingtype,
            training_name:trainingname,
            training_level:traininglevel,
            training_id:trainingid,
            isactive:"Yes",
        }

        LevelBasedTraining.create(levelbasedData).then(levelbased =>{
            res.render('addlevelbased',{
                success_msg:'Your are successfully registered new level based training program'
            })
        }).catch(error =>{
            res.render('addlevelbased',{
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addlevelbased',{
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});
router.post('/addindustrybasedtraining', ensureAuthenticated, async function(req, res) 
{
    let error = [];
    const{trainingname,companyname,trainingduration,trainingcost} = req.body;
   if(!trainingname  || !trainingduration || !trainingcost || !companyname){
        error.push({msg:'Please add all required fields'})
   }
   else if(companyname =="0" ){
    error.push({msg:'Please select company name of training program'})
   }
   if(error.length >0){
    res.render('addindustrybased',{
        error_msg:'Please ensert all the required fields'
    })
   }
   else{
    IndustryBasedTraining.findOne({where:{
        training_name:trainingname,
        company_name:companyname
       }}).then(industrybasedtraining =>{
           if(industrybasedtraining)
           {

            res.render('addindustrybased',{
                error_msg:'This training program  is already registered please try later'
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
              trainingid = uuidv4(v1options);
        const industrybasedData ={
            training_cost:trainingcost,
            training_duration:trainingduration,
           
            training_name:trainingname,
            company_name:companyname,
            training_id:trainingid,
            isactive:"Yes",
        }

        IndustryBasedTraining.create(industrybasedData).then(industrybased =>{
            res.render('addindustrybased',{
                success_msg:'Your are successfully registered new industry based training program'
            })
        }).catch(error =>{
            res.render('addindustrybased',{
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addindustrybased',{
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});
router.post('/addnewoccupation', ensureAuthenticated, async function(req, res) 
{
    let error = [];
    const{trainingname,departmentid,trainingduration,trainingcost} = req.body;
    const dept = await Department.findAll({ });
  

   if(!trainingname || !departmentid){
        error.push({msg:'Please add all required fields'})
   }
   else if(departmentid =="0" ){
    error.push({msg:'Please select department  name of training program'})
   }
   if(error.length >0){
    res.render('addnewoccupation',{
        error_msg:'Please ensert all the required fields',
        dept:dept
    })
   }
   else{
    Occupation.findOne({where:{
        department_id:departmentid,
        occupation_name:trainingname
       }}).then(industrybasedtraining =>{
           if(industrybasedtraining)
           {

            res.render('addnewoccupation',{
                error_msg:'This occupation  is already registered please try later',
                dept:dept
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
              occupationid = uuidv4(v1options);
        const occupationData ={
            training_cost:trainingcost,
            training_duration:trainingduration,
            department_id:departmentid,
            occupation_id:occupationid,
            occupation_name:trainingname,
           
        }

        Occupation.create(occupationData).then(industrybased =>{
            res.render('addnewoccupation',{
                success_msg:'Your are successfully registered new occupation',
                dept:dept
            })
        }).catch(error =>{
            res.render('addnewoccupation',{
                error_msg:'Something is wrong while saving data please try later',
                dept:dept
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addnewoccupation',{
            error_msg:'Something is wrong please try later',
            dept:dept
        })
       })
   }
   
   
});
router.post('/addngobasedtraining', ensureAuthenticated, async function(req, res) 
{
    let error = [];
    const funderinfo = await FunderInfo.findAll({});
    const{trainingname,fundername,trainingduration,trainingcost} = req.body;
   if(!trainingname || !fundername || !trainingduration || !trainingcost){
        error.push({msg:'Please add all required fields'})
   }
   else if(fundername == "0" ){
    error.push({msg:'Please select training funder name of training program'})
   }
   if(error.length >0){
    res.render('addngobased',{
        error_msg:'Please insert all the required fields',
        funderinfo:funderinfo
    })
   }
   else{
       NGOBasedTraining.findOne({where:{
        funder_id:fundername,
        training_name:trainingname
        
       }}).then(ngobasedtraining =>{
           if(ngobasedtraining)
           {

            res.render('addngobased',{
                funderinfo:funderinfo,
                error_msg:'This training program  is already registered please try later'
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
              trainingid = uuidv4(v1options);
        const ngobasedData ={
            training_cost:trainingcost,
            training_duration:trainingduration,
            funder_id:fundername,
            training_name:trainingname,
            funder_name:fundername,
            training_id:trainingid,
            isactive:"Yes",
        }

        NGOBasedTraining.create(ngobasedData).then(ngobased =>{
            res.render('addngobased',{funderinfo:funderinfo,

                success_msg:'Your are successfully registered new NGO training program'
            })
        }).catch(error =>{
            res.render('addngobased',{
                funderinfo:funderinfo,
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addngobased',{
            funderinfo:funderinfo,
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});


module.exports = router;

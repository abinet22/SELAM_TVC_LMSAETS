const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const LevelBasedProgram = db.levelbasedprograms;
const NGOBasedProgram = db.ngobasedprograms;
const IndustryBasedProgram = db.industrybasedprograms;
const Batch = db.batches;

const AppSelectionCriteria = db.appselectioncriterias;
const Course = db.courses;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addlevelbased', ensureAuthenticated,async function (req, res) 
{
    const traininglist = await  LevelBasedTraining.findAll();
  const criterialist = await  AppSelectionCriteria.findAll();
    res.render('addlevelbased',{
        training:traininglist,
        criteria:criterialist,
        
    })
});
router.get('/addngobased', ensureAuthenticated, async function(req, res) {
    
    const funderinfo = await FunderInfo.findAll({});
    const traininglist = await  LevelBasedTraining.findAll();
    const criterialist = await  AppSelectionCriteria.findAll();
    res.render('addngobased',{
        funderinfo:funderinfo,
        training:traininglist,
        criteria:criterialist,
    })

});
router.get('/addindustrybased', ensureAuthenticated, async function(req, res) {

const traininglist = await  LevelBasedTraining.findAll();

res.render('addindustrybased',{

    training:traininglist,

})

}
);
router.get('/allprogramlist', ensureAuthenticated, async function (req, res) {

//    const industrybased  = await IndustryBasedProgram.findAll({});
//    const ngobased  = await NGOBasedProgram.findAll({});

   const [results, metadata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const [resultsngo, metadatango] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
  );
  const [resultsindustry, metadataindustry] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
  );
  const funderinfo = await FunderInfo.findAll({});
  console.log(JSON.stringify(results, null, 2));
console.log(results);
    LevelBasedTraining.findAll({}).then(levelbased =>{
        res.render('programlist',{
            levelbased:results,
            industrybased:resultsindustry,
            ngobased:resultsngo,

            funderinfo:funderinfo
        })
    }).catch(error =>{
        res.render('programlist',{
            levelbased:'',
            industrybased:'',
            ngobased:'',
            funderinfo:funderinfo
        })
    })


});

router.post('/addnewlevelbasedprogram',ensureAuthenticated, async function(req,res){
    const {trainingname,traininglevel,description,trainingtype,
        batchname,appstartdate,appenddate,trainingstartdate,trainingenddate,requirement,criteria} = req.body;
     let errors = [];   
     const traininglist = await  LevelBasedTraining.findAll();
     const criterialist = await  AppSelectionCriteria.findAll();
    
   if(!trainingname || ! traininglevel || ! description || ! trainingtype || !
    batchname || ! appstartdate || ! appenddate || ! trainingstartdate || ! trainingenddate || ! requirement || ! criteria)
   {
    errors.push({msg:'please enter all the required fields'})
   }
   if(errors.length >0){
       res.render('addlevelbased',{error_msg:'Please enter all the required fields',
       training:traininglist,
       criteria:criterialist,
    })
   }
   else{

    var leveld = [];
    var typed = [];
    var named = [];
    var levels;
    var types;
    var names;
   // console.log(traininglevel);
    if(Array.isArray(traininglevel))
    {
      levels=  JSON.stringify(traininglevel);
      console.log("array",levels);
    }
    else
    {
      leveld.push(traininglevel);
      levels= JSON.stringify(leveld);
      
      console.log("notarray",levels);
    }
    if(Array.isArray(trainingname))
    {
      names=  JSON.stringify(trainingname);
      console.log("array",names);
     
    }
    else
    {
      named.push(trainingname);
      names= JSON.stringify(named);
      
      console.log("notarray",names);
    }
    if(Array.isArray(trainingtype))
    {
      types=  JSON.stringify(trainingtype);
      //console.log("array",levels);
    }
    else
    {
      typed.push(trainingtype);
      types= JSON.stringify(typed);
      
      console.log("notarray",levels);
    }  


    const v1options = {
        node: [0x01, 0x23],
        clockseq: 0x1234,
        msecs: new Date('2011-11-01').getTime(),
        nsecs: 5678,
      };
      proid = uuidv4(v1options);
      const batchData = {
        batch_id:proid,
        batch_name:batchname,
        batch_from:trainingstartdate,
        batch_to:trainingenddate,
        program_type: "level",
        is_current: "Yes"
    }
     const levelbasedprogramData = {
         program_id: proid,
         program_created_by: req.user.userid,
         program_description: description,
         training_levels: levels,
         training_types:types,
         batch_id: proid,
         training_names: names,
         app_start_date: appstartdate,
         app_end_date: appenddate,
         training_start_date:trainingstartdate,
         training_end_date: trainingenddate,
         minimum_criteria: requirement,
         selection_criteria: criteria,
         is_open: "Yes",
         is_confirm:"No"
         
     }
    
     Batch.count({where:{batch_name:batchname}}).then(count =>{
         console.log("axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
         console.log(count)
         if(count == 0 ){
         
         Batch.create(batchData).then(batchdt =>{
            if(!batchdt){
                res.render('addlevelbased',{error_msg:'Error cant create batch information ',
                training:traininglist,
        criteria:criterialist,}) 
           
            }
            else{
                LevelBasedProgram.create(levelbasedprogramData).then(levelbasedprogram =>{
                    res.render('addlevelbased',{success_msg:'You create new level based program with batch information',
                    training:traininglist,
        criteria:criterialist,}) 
                }).catch(error =>{
                    res.render('addlevelbased',{error_msg:'Error while creating level based program with batch',
                    training:traininglist,
        criteria:criterialist,}) 
           
                })
            }
        }).catch(error =>{
            res.render('addlevelbased',{error_msg:'Error while adding batch info',
            training:traininglist,
        criteria:criterialist,}) 
           
        })
         }
         else
         {
            res.render('addlevelbased',{error_msg:'This batch name already registered please change',
            training:traininglist,
        criteria:criterialist,}) 
         }
       
     }).catch(error =>{
         res.render('addlevelbased',{error_msg:'Error while finding batch info',
         training:traininglist,
     criteria:criterialist,}) 
        
     })
   }
 

   
 
})
router.post('/addnewngobasedprogram',ensureAuthenticated, async function(req,res){
    const {trainingname,description,trainingtype,fundername,
        batchname,appstartdate,appenddate,trainingstartdate,trainingenddate,requirement,criteria} = req.body;
     let errors = [];   
     const traininglist = await  LevelBasedTraining.findAll();
     const criterialist = await  AppSelectionCriteria.findAll();
     const funderinfo = await FunderInfo.findAll({});
   if(!trainingname  || ! description || ! trainingtype || !
    batchname || ! appstartdate || ! appenddate || ! trainingstartdate || ! trainingenddate  || ! criteria)
   {
    errors.push({msg:'please enter all the required fields'})
   }
   if(errors.length >0){
       res.render('addngobased',{error_msg:'Please enter all the required fields',
       training:traininglist,
       criteria:criterialist,
       funderinfo:funderinfo
    })
   }
   else{

    var leveld = [];
    var typed = [];
    var named = [];
    var levels;
    var types;
    var names;
   // console.log(traininglevel);
   
    if(Array.isArray(trainingname))
    {
      names=  JSON.stringify(trainingname);
      console.log("array",names);
     
    }
    else
    {
      named.push(trainingname);
      names= JSON.stringify(named);
      
      console.log("notarray",names);
    }
    if(Array.isArray(trainingtype))
    {
      types=  JSON.stringify(trainingtype);
      //console.log("array",levels);
    }
    else
    {
      typed.push(trainingtype);
      types= JSON.stringify(typed);
      
      console.log("notarray",levels);
    }  


    const v1options = {
        node: [0x01, 0x23],
        clockseq: 0x1234,
        msecs: new Date('2011-11-01').getTime(),
        nsecs: 5678,
      };
      proid = uuidv4(v1options);
      const batchData = {
        batch_id:proid,
        batch_name:batchname,
        batch_from:trainingstartdate,
        batch_to:trainingenddate,
        program_type: "ngo",
        is_current: "Yes"
    }
     const ngobasedprogramData = {
         program_id: proid,
         program_created_by: req.user.userid,
         program_description: description,
         funder_id: fundername,
         training_types:types,
         batch_id: proid,
         training_names: names,
         app_start_date: appstartdate,
         app_end_date: appenddate,
         training_start_date:trainingstartdate,
         training_end_date: trainingenddate,
         minimum_criteria: requirement,
         selection_criteria: criteria,
         is_open: "Yes",
         is_confirm:"No"
         
     }
    
     Batch.count({where:{batch_name:batchname}}).then(count =>{
         console.log("axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
         console.log(count)
         if(count == 0 ){
         
         Batch.create(batchData).then(batchdt =>{
            if(!batchdt){
                res.render('addngobased',{error_msg:'Error cant create batch information ',
                training:traininglist,
                funderinfo:funderinfo,
        criteria:criterialist,}) 
           
            }
         
             NGOBasedProgram.create(ngobasedprogramData).then(ngobasedprogram =>{
                    res.render('addngobased',{success_msg:'You create new NGO based program with batch information',
                    training:traininglist,
                    funderinfo:funderinfo,
        criteria:criterialist,}) 
                }).catch(error =>{
                    console.log(error);
                    res.render('addngobased',{error_msg:'Error while creating NGO based program with batch',
                    training:traininglist,
                    funderinfo:funderinfo,
        criteria:criterialist,}) 
           
                })
        
        }).catch(error =>{
            
            res.render('addngobased',{error_msg:'Error while adding batch info',
            training:traininglist,
            funderinfo:funderinfo,
        criteria:criterialist,}) 
           
        })
         }
         else
         {
            res.render('addngobased',{error_msg:'This batch name already registered please change',
            training:traininglist,
            funderinfo:funderinfo,
        criteria:criterialist,}) 
         }
       
     }).catch(error =>{
         console.log(error)
         res.render('addngobased',{error_msg:'Error while finding batch info',
         training:traininglist,
         funderinfo:funderinfo,
     criteria:criterialist,}) 
        
     })
   }
 

   
 
})
router.post('/addnewindustrybasedprogram', ensureAuthenticated, async function(req, res) 
{
  const {trainingname,description,companyname,
    batchname,appstartdate,appenddate,trainingstartdate,trainingenddate,} = req.body;
 let errors = [];   
 const traininglist = await  LevelBasedTraining.findAll();
 const criterialist = await  AppSelectionCriteria.findAll();
 const funderinfo = await FunderInfo.findAll({});
if(!trainingname  || ! description  || !
batchname || ! appstartdate || ! appenddate || ! trainingstartdate || ! trainingenddate ||! companyname )
{
errors.push({msg:'please enter all the required fields'})
}
if(errors.length >0){
   res.render('addindustrybased',{error_msg:'Please enter all the required fields',
   training:traininglist,
   criteria:criterialist,
   funderinfo:funderinfo
})
}
else{

var leveld = [];
var typed = [];
var named = [];
var levels;
var types;
var names;
// console.log(traininglevel);

if(Array.isArray(trainingname))
{
  names=  JSON.stringify(trainingname);
  console.log("array",names);
 
}
else
{
  named.push(trainingname);
  names= JSON.stringify(named);
  
  console.log("notarray",names);
}



const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  proid = uuidv4(v1options);
  const batchData = {
    batch_id:proid,
    batch_name:batchname,
    batch_from:trainingstartdate,
    batch_to:trainingenddate,
    program_type: "industry",
    is_current: "Yes"
}
 const ngobasedprogramData = {
     program_id: proid,
     program_created_by: req.user.userid,
     program_description: description,
     company_name: companyname,
    
     batch_id: proid,
     training_names: names,
     app_start_date: appstartdate,
     app_end_date: appenddate,
     training_start_date:trainingstartdate,
     training_end_date: trainingenddate,
  
     is_open: "Yes",
     is_confirm:"No"
     
 }

 Batch.count({where:{batch_name:batchname}}).then(count =>{
     console.log("axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
     console.log(count)
     if(count == 0 ){
     
     Batch.create(batchData).then(batchdt =>{
        if(!batchdt){
            res.render('addindustrybased',{error_msg:'Error cant create batch information ',
            training:traininglist,
            funderinfo:funderinfo,
    criteria:criterialist,}) 
       
        }
     
         IndustryBasedProgram.create(ngobasedprogramData).then(ngobasedprogram =>{
                res.render('addindustrybased',{success_msg:'You create new Industry based program with batch information',
                training:traininglist,
                funderinfo:funderinfo,
    criteria:criterialist,}) 
            }).catch(error =>{
                console.log(error);
                res.render('addindustrybased',{error_msg:'Error while creating Industry based program with batch',
                training:traininglist,
                funderinfo:funderinfo,
    criteria:criterialist,}) 
       
            })
    
    }).catch(error =>{
        
        res.render('addindustrybased',{error_msg:'Error while adding batch info',
        training:traininglist,
        funderinfo:funderinfo,
    criteria:criterialist,}) 
       
    })
     }
     else
     {
        res.render('addindustrybased',{error_msg:'This batch name already registered please change',
        training:traininglist,
        funderinfo:funderinfo,
    criteria:criterialist,}) 
     }
   
 }).catch(error =>{
     console.log(error)
     res.render('addindustrybased',{error_msg:'Error while finding batch info',
     training:traininglist,
     funderinfo:funderinfo,
 criteria:criterialist,}) 
    
 })
}


   
   
});
router.post('/closeopenprograms/(:programid)', ensureAuthenticated,async function(req,res){

    const [results, metadata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      
LevelBasedProgram.findOne({where:{program_id:req.params.programid}}).then(levelbaseprogram =>{
    if(levelbaseprogram){
     LevelBasedProgram.update({is_open:"No"},{where:{program_id:req.params.programid}}).then(program =>{
         if(program){
            res.render('programlist',{
                levelbased:results,
                industrybased:'',
                ngobased:'',
                success_msg:'Successfully update program status program is now close for Applicants'
            })
         }
         else{
            res.render('programlist',{
                levelbased:results,
                industrybased:'',
                ngobased:'',
                error_msg:'Error while updating program status'
            })
         }
     })

    }
    else{
        res.render('programlist',{
            levelbased:results,
            industrybased:'',
            ngobased:'',
            error_msg:'Error something is wrong please try later'
        })
    }
})

})

module.exports = router;
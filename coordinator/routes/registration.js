const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const LevelBasedTrainee =db.levelbasedtrainees
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const User = db.users;
const ClassInDept = db.classindepts;
const NewApplicant =db.newapplicants;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const uploadFile = require('../middleware/upload.js');
const NGOBasedTrainee = require('../models/NGOBasedTrainee');
router.get('/newlevelbasedregistration',ensureAuthenticated,async function(req,res){

    const department = await Department.findAll({});
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
      );

    res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:department
    })

});
router.get('/newngobasedregistration',ensureAuthenticated,async function(req,res){

  const department = await Department.findAll({});
    const [ngobased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes'"
    );

  res.render('searchapplicanttoregisterngo',{
      ngobased:ngobased,
      department:department
  })

});
router.post('/searchapplicantbyidtoregister',ensureAuthenticated,async function(req,res){
  const{programidlevel,applicantid} = req.body;
  const applicant = await NewApplicant.findOne({where:{application_id:programidlevel,applicant_id:applicantid,is_selected:"Yes"}});
  if(applicant){
    const department = await Department.findOne({where:{department_id:applicant.selected_department}})
    const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
    const classlist = await ClassInDept.findAll({where:{batch_id:programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
    res.render('registersingleapplicant',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:programidlevel
    });
  }
  else{
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
      );

    res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:ngobased,
        error_msg:'Cant find applicant with this application ID'
    })
  }

});
router.post('/searchapplicantbyidtoregisterngo',ensureAuthenticated,async function(req,res){
  const{programidlevel,applicantid} = req.body;
  const applicant = await NewApplicant.findOne({where:{application_id:programidlevel,applicant_id:applicantid,is_selected:"Yes"}});
  if(applicant){
    const department = await Department.findOne({where:{department_id:applicant.selected_department}})
    const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
    const classlist = await ClassInDept.findAll({where:{batch_id:programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
    res.render('registersingleapplicantngo',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:programidlevel
    });
  }
  else{
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes'"
      );
      const department = await Department.findAll({});

    res.render('searchapplicanttoregisterngo',{
        department:department,
        ngobased:ngobased,
        error_msg:'Cant find applicant with this application ID'
    })
  }

});
router.post('/registernewtrainee/(:programidlevel)/(:applicantid)',uploadFile.single("traineephoto"),ensureAuthenticated,async function(req,res){
    
    const{classname,traineeid} = req.body;

    if(!req.file){
console.log("No File!")
    }


    const applicant = await NewApplicant.findOne({where:{application_id:req.params.programidlevel,applicant_id:req.params.applicantid,is_selected:"Yes"}});
    if(!applicant){
     
      res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:ngobased,
        error_msg:'Cant find register applicant with this application ID please try again'
    })
    }else{
        const department = await Department.findAll({});
          const [levelbased, metalevelbaseddata] = await sequelize.query(
            "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
          );
        // const department = await Department.findOne({where:{department_id:applicant.selected_department}})
        // const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
        // const classlist = await ClassInDept.findAll({where:{batch_id:req.params.programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
       
        const newlevelbasedtraineeData = {
            batch_id: applicant.application_id,
            applicant_id: applicant.applicant_id,
            applicant_photo: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.file.filename
              ),
            photo_type: req.file.mimetype,
            photo_name: req.file.filename,
            trainee_id: traineeid,
            personal_info: applicant.personal_info,
            contact_info: applicant.contact_info,
            grade9_trans: applicant.grade9_trans,
            grade10_trans:applicant.grade10_trans,
            grade11_trans: applicant.grade11_trans,
            grade12_trans:applicant.grade12_trans,
            grade9_ave:applicant.grade9_ave,
            grade10_ave: applicant.grade10_ave,
            grade11_ave: applicant.grade11_ave,
            grade12_ave: applicant.grade12_ave,
            grade10_leaving: applicant.grade10_leaving,
            grade12_leaving: applicant.grade12_leaving,
            apptitude_result: applicant.apptitude_result,
            department_id: applicant.selected_department,
            admission_type:applicant.choice_program_type,
            class_id: classname,
            entry_level: applicant.choice_level,
            current_level: applicant.choice_level,
            entry_semister: "1",
            current_semister: "1",
            is_disable: "No",
            is_graduated:"No",
            is_dropout:"No",
            countinue_study:"No"
            
        }
        LevelBasedTrainee.findOne({where:{batch_id:req.params.programidlevel,applicant_id:req.params.applicantid}}).then(regtrainee =>{
            if(regtrainee)
            {
                res.render('searchselectedapplicanttoregister',{
                    levelbased:levelbased,
                    ngobased:department,
                    error_msg:'Applicant with this application ID already registered'
                })
            }
            else{
                LevelBasedTrainee.create(newlevelbasedtraineeData).then((trainee)=>{
                    fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ trainee.photo_name,
                   
                    trainee.applicant_photo
                  );
                  res.redirect("/registration/printslip/"+req.params.programidlevel+"/"+req.params.applicantid +"");
        
                }).catch(error =>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        
         }
  
  });
  router.post('/registernewtraineengo/(:programidlevel)/(:applicantid)',uploadFile.single("traineephoto"),ensureAuthenticated,async function(req,res){
    
    const{classname,traineeid} = req.body;

    if(!req.file){
console.log("No File!")
    }


    const applicant = await NewApplicant.findOne({where:{application_id:req.params.programidlevel,applicant_id:req.params.applicantid,is_selected:"Yes"}});
    if(!applicant){
     
      res.render('searchapplicanttoregisterngo',{
        levelbased:levelbased,
        ngobased:ngobased,
        error_msg:'Cant find register applicant with this application ID please try again'
    })
    }else{
        const department = await Department.findAll({});
          const [levelbased, metalevelbaseddata] = await sequelize.query(
            "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes'"
          );
        // const department = await Department.findOne({where:{department_id:applicant.selected_department}})
        // const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
        // const classlist = await ClassInDept.findAll({where:{batch_id:req.params.programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
       
        const newngobasedtraineeData = {
            batch_id: applicant.application_id,
            applicant_id: applicant.applicant_id,
            applicant_photo: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.file.filename
              ),
            photo_type: req.file.mimetype,
            photo_name: req.file.filename,
            trainee_id: traineeid,
            personal_info: applicant.personal_info,
            contact_info: applicant.contact_info,
            grade9_trans: applicant.grade9_trans,
            grade10_trans:applicant.grade10_trans,
            grade11_trans: applicant.grade11_trans,
            grade12_trans:applicant.grade12_trans,
            grade9_ave:applicant.grade9_ave,
            grade10_ave: applicant.grade10_ave,
            grade11_ave: applicant.grade11_ave,
            grade12_ave: applicant.grade12_ave,
            grade10_leaving: applicant.grade10_leaving,
            grade12_leaving: applicant.grade12_leaving,
            apptitude_result: applicant.apptitude_result,
            department_id: applicant.selected_department,
            admission_type:applicant.choice_program_type,
            class_id: classname,
            entry_level: applicant.choice_level,
            current_level: applicant.choice_level,
            entry_semister: "1",
            current_semister: "1",
            is_disable: "No",
            is_graduated:"No",
            is_dropout:"No",
            countinue_study:"No"
            
        }
        NGOBasedTrainee.findOne({where:{batch_id:req.params.programidlevel,applicant_id:req.params.applicantid}}).then(regtrainee =>{
            if(regtrainee)
            {
                res.render('searchapplicanttoregisterngo',{
                    levelbased:levelbased,
                    ngobased:department,
                    error_msg:'Applicant with this application ID already registered'
                })
            }
            else{
                NGOBasedTrainee.create(newngobasedtraineeData).then((trainee)=>{
                    fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ trainee.photo_name,
                   
                    trainee.applicant_photo
                  );
                  res.redirect("/registration/printslipngobased/"+req.params.programidlevel+"/"+req.params.applicantid +"");
        
                }).catch(error =>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        
         }
  
  });
  router.get('/printslipngobased/(:batchid)/(:applicantid)',ensureAuthenticated,async function(req,res){
   
    //const{programidlevel,applicantid} = req.body;
  const applicant = await NGOBasedTrainee.findOne({where:{batch_id:req.params.batchid,applicant_id:req.params.applicantid}});
  if(applicant){
    const department = await Department.findOne({where:{department_id:applicant.department_id}})
    const courselist = await Course.findAll({where:{department_id:applicant.department_id,training_level:applicant.entry_level}})
    const classlist = await ClassInDept.findOne({where:{batch_id:req.params.batchid,department_id:applicant.department_id,training_level:applicant.entry_level,training_type:applicant.admission_type}})
    res.render('printregisterationslip',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:req.params.batchid
    });
  }
});
router.get('/printslip/(:batchid)/(:applicantid)',ensureAuthenticated,async function(req,res){
   
    //const{programidlevel,applicantid} = req.body;
  const applicant = await LevelBasedTrainee.findOne({where:{batch_id:req.params.batchid,applicant_id:req.params.applicantid}});
  if(applicant){
    const department = await Department.findOne({where:{department_id:applicant.department_id}})
    const courselist = await Course.findAll({where:{department_id:applicant.department_id,training_level:applicant.entry_level}})
    const classlist = await ClassInDept.findOne({where:{batch_id:req.params.batchid,department_id:applicant.department_id,training_level:applicant.entry_level,training_type:applicant.admission_type}})
    res.render('printregisterationslip',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:req.params.batchid
    });
  }
});
router.post('/selectallbybatchidtoregister',ensureAuthenticated,async function(req,res){

  const{programidbatch,dept} = req.body;
  const department = await Department.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
  );

  NewApplicant.findAll({where:{application_id:programidbatch,selected_department:dept,is_selected:"Yes"}}).then(applicant =>{

    res.render('registerinbatch',{applicantlist:applicant})
  }).catch(error =>{
   
    
    res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:department
    })
  })

});
router.post('/selectallbybatchidtoregisterngo',ensureAuthenticated,async function(req,res){

  const{programidbatch,dept} = req.body;
  const department = await Department.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes'"
  );

  NewApplicant.findAll({where:{application_id:programidbatch,selected_department:dept,is_selected:"Yes"}}).then(applicant =>{

    res.render('registerinbatchngo',{applicantlist:applicant})
  }).catch(error =>{
   
    
    res.render('searchapplicanttoregisterngo',{
        levelbased:levelbased,
        ngobased:department
    })
  })

});

router.get('/updateexistedtraineestatus',async function(req,res){
      const department = await Department.findAll({});
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id "
      );
      const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id "
      );
      // const [industry, metaindustrybaseddata] = await sequelize.query(
      //   "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id "
      // );
      res.render('updateexistedtraineestatus',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:ngobased,
        department:department
    })
})
module.exports = router;
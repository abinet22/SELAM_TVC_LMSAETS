const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const IndustryBasedTrainee = db.industrybasedtrainees;
const LevelBasedTrainee =db.levelbasedtrainees;
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
const NGOBasedTrainee = db.ngobasedtrainees;
const Occupation = db.occupations;
const NGOCourse = db.ngocourses;
const IndustryCourse = db.industrycourses;
router.get('/newlevelbasedregistration',ensureAuthenticated,async function(req,res){

    const department = await Occupation.findAll({});
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'  and levelbasedprograms.is_confirm ='Yes'"
      );

    res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:department
    })

});
router.get('/newngobasedregistration',ensureAuthenticated,async function(req,res){

  const department = await Occupation.findAll({});
    const [ngobased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes'  and ngobasedprograms.is_confirm ='Yes'"
    );

  res.render('searchapplicanttoregisterngo',{
      ngobased:ngobased,
      department:department
  })

});
router.get('/newindustrydrivenregistration',ensureAuthenticated,async function(req,res){

  const department = await Occupation.findAll({});
    const [industrybased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open='Yes'  and industrybasedprograms.is_confirm ='Yes'"
    );

  res.render('searchapplicanttoregisterindustry',{
      industrybased:industrybased,
      department:department
  })

});
router.get('/graduatedtraineetococdb',async function(req,res){
  const department = await Occupation.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id "
  );
  const [ngobased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id "
  );
  const [industrybased, metaindustrybaseddata] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id "
  );
  res.render('graduatedtraineetococdb',{
    levelbased:levelbased,
    ngobased:ngobased,
    industrybased:industrybased,
    department:department
})
})
router.post('/searchapplicantbyidtoregister',ensureAuthenticated,async function(req,res){
  const{programidlevel,applicantid} = req.body;
  const applicant = await NewApplicant.findOne({where:{application_id:programidlevel,applicant_id:applicantid,is_selected:"Yes"}});
  if(applicant){
    const department = await Occupation.findOne({where:{occupation_id:applicant.selected_department}})
    const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
    const classlist = await ClassInDept.findAll({where:{batch_id:programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
    res.render('registersingleapplicant',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:programidlevel,
        programtag:"level"
    });
  }
  else{
    const department = await Occupation.findAll({});
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes' and levelbasedprograms.is_confirm='Yes'"
      );

    res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:department,
        error_msg:'Cant find applicant with this application ID'
    })
  }

});
router.post('/searchapplicantbyidtoregisterngo',ensureAuthenticated,async function(req,res){
  const{programidlevel,applicantid} = req.body;
  const applicant = await NewApplicant.findOne({where:{application_id:programidlevel,applicant_id:applicantid,is_selected:"Yes"}});
  if(applicant){
    const department = await Occupation.findOne({where:{occupation_id:applicant.selected_department}})
    const courselist = await NGOCourse.findAll({where:{department_id:applicant.selected_department,batch_id:programidlevel}})
    const classlist = await ClassInDept.findAll({where:{batch_id:programidlevel,department_id:applicant.selected_department}})
    res.render('registersingleapplicantngo',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:programidlevel,
        programtag:"ngo"
    });
  }
  else{
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes' and ngobasedprograms.is_confirm='Yes'"
      );
      const department = await Occupation.findAll({});

    res.render('searchapplicanttoregisterngo',{
        department:department,
        ngobased:ngobased,
        error_msg:'Cant find applicant with this application ID'
    })
  }

});
router.post('/searchapplicantbyidtoregisterindustry',ensureAuthenticated,async function(req,res){
  const{programidlevel,applicantid} = req.body;
  const applicant = await NewApplicant.findOne({where:{application_id:programidlevel,applicant_id:applicantid,is_selected:"Yes"}});
  if(applicant){
    const department = await Department.findOne({where:{department_id:applicant.selected_department}})
    const courselist = await IndustryCourse.findAll({where:{department_id:applicant.selected_department,batch_id:programidlevel}})
    const classlist = await ClassInDept.findAll({where:{batch_id:programidlevel,department_id:applicant.selected_department}})
    res.render('registersingleapplicantindustry',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:programidlevel,
        programtag:"industry"
    });
  }
  else{
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open='Yes' and industrybasedprograms.is_confirm='Yes'"
      );
      const department = await Department.findAll({});

    res.render('searchapplicanttoregisterindustry',{
        department:department,
        ngobased:ngobased,
        error_msg:'Cant find applicant with this application ID'
    })
  }

});
router.post('/registernewtrainee/(:programidlevel)/(:applicantid)',uploadFile.single("traineephoto"),ensureAuthenticated,async function(req,res){
    
    const{classname,traineeid} = req.body;
    const department = await Occupation.findAll({});
    if(!req.file){
console.log("No File!")
    }


    const applicant = await NewApplicant.findOne({where:{application_id:req.params.programidlevel,applicant_id:req.params.applicantid,is_selected:"Yes"}});
    if(!applicant){
     
      res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:department,
        error_msg:'Cant find register applicant with this application ID please try again'
    })
    }else{
       
          const [levelbased, metalevelbaseddata] = await sequelize.query(
            "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
          );
        // const department = await Department.findOne({where:{department_id:applicant.selected_department}})
        // const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
        // const classlist = await ClassInDept.findAll({where:{batch_id:req.params.programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
        const v1options = {
          node: [0x01, 0x23],
          clockseq: 0x1234,
          msecs: new Date('2011-11-01').getTime(),
          nsecs: 5678,
        };
        studentid = uuidv4(v1options);
        const newlevelbasedtraineeData = {
            batch_id: applicant.application_id,
            applicant_id: applicant.applicant_id,
            applicant_photo: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.file.filename
              ),
            photo_type: req.file.mimetype,
            photo_name: req.file.filename,
            trainee_id: studentid,
            student_unique_id:traineeid,
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
            countinue_study:"No",
            payment_info:applicant.payment_info
            
        }

        LevelBasedTrainee.findOne({where:{batch_id:req.params.programidlevel,
applicant_id:req.params.applicantid}}).then(regtrainee =>{
            if(regtrainee)
            {
console.log(regtrainee)
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
    NewApplicant.update({selected_class:classname},{where:{applicant_id:req.params.applicantid,
application_id:req.params.programidlevel}}).then(app =>{
  res.redirect("/registrardataencoder/registration/printslip/"+req.params.programidlevel+"/"+req.params.applicantid +"");
        
                  })
                 
        
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


    const applicant = await NewApplicant.findOne({where:{application_id:req.params.programidlevel,
applicant_id:req.params.applicantid,is_selected:"Yes"}});
    if(!applicant){
     
      res.render('searchapplicanttoregisterngo',{
        levelbased:levelbased,
        ngobased:ngobased,
        error_msg:'Cant find register applicant with this application ID please try again'
    })
    }else{
        const department = await Occupation.findAll({});
          const [ngobased, metalevelbaseddata] = await sequelize.query(
            "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"+
"  where ngobasedprograms.is_open='Yes'"
          );
        // const department = await Department.findOne({where:{department_id:applicant.selected_department}})
        // const courselist = await Course.findAll({where:{department_id:applicant.selected_department,training_level:applicant.choice_level}})
        // const classlist = await ClassInDept.findAll({where:{batch_id:req.params.programidlevel,department_id:applicant.selected_department,training_level:applicant.choice_level,training_type:applicant.choice_program_type}})
        const v1options = {
          node: [0x01, 0x23],
          clockseq: 0x1234,
          msecs: new Date('2011-11-01').getTime(),
          nsecs: 5678,
        };
        studentid = uuidv4(v1options);
        const newngobasedtraineeData = {
            batch_id: applicant.application_id,
            applicant_id: applicant.applicant_id,
            applicant_photo: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.file.filename
              ),
            photo_type: req.file.mimetype,
            photo_name: req.file.filename,
            trainee_id: studentid,
            student_unique_id:traineeid,
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
            countinue_study:"No",
            payment_info:applicant.payment_info
            
        }
        NGOBasedTrainee.findOne({where:{batch_id:req.params.programidlevel,applicant_id:req.params.applicantid}}).then(regtrainee =>{
            if(regtrainee)
            {
                res.render('searchapplicanttoregisterngo',{
                    ngobased:ngobased,
                    department:department,
                    error_msg:'Applicant with this application ID already registered'
                })
            }
            else{
                NGOBasedTrainee.create(newngobasedtraineeData).then((trainee)=>{
                    fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ trainee.photo_name,
                   
                    trainee.applicant_photo
                  );
                   NewApplicant.update({selected_class:classname},{where:{applicant_id:req.params.applicantid,
application_id:req.params.programidlevel}}).then(app =>{
                        res.redirect("/registrardataencoder/registration/printslipngobased/"+
req.params.programidlevel+"/"+req.params.applicantid +""); }) 
                }).catch(error =>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        
         }
  
  });
router.post('/registernewtraineeindustry/(:programidlevel)/(:applicantid)',uploadFile.single("traineephoto"),ensureAuthenticated,async function(req,res){
    
    const{classname,traineeid} = req.body;

    if(!req.file){
console.log("No File!")
    }


    const applicant = await NewApplicant.findOne({where:{application_id:req.params.programidlevel,applicant_id:req.params.applicantid,is_selected:"Yes"}});
    if(!applicant){
     
      res.render('searchapplicanttoregisterindustry',{
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
        const v1options = {
          node: [0x01, 0x23],
          clockseq: 0x1234,
          msecs: new Date('2011-11-01').getTime(),
          nsecs: 5678,
        };
        studentid = uuidv4(v1options);
        const newngobasedtraineeData = {
            batch_id: applicant.application_id,
            applicant_id: applicant.applicant_id,
            applicant_photo: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.file.filename
              ),
            photo_type: req.file.mimetype,
            photo_name: req.file.filename,
            trainee_id: studentid,
            student_unique_id:traineeid,
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
            countinue_study:"No",
            payment_info:applicant.payment_info
            
        }
        NGOBasedTrainee.findOne({where:{batch_id:req.params.programidlevel,applicant_id:req.params.applicantid}}).then(regtrainee =>{
            if(regtrainee)
            {
                res.render('searchapplicanttoregisterindustry',{
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
                      NewApplicant.update({selected_class:classname},{where:{applicant_id:req.params.applicantid,
application_id:req.params.programidlevel}}).then(app =>{
                        res.redirect("/registrardataencoder/registration/printslipindustrybased/"+
req.params.programidlevel+"/"+req.params.applicantid +"");  
                  })
                 

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
    const department = await Occupation.findOne({where:{occupation_id:applicant.department_id}})
    const courselist = await NGOCourse.findAll({where:{department_id:applicant.department_id,batch_id:applicant.batch_id}})
    const classlist = await ClassInDept.findOne({where:{batch_id:req.params.batchid,
department_id:applicant.department_id,training_type:applicant.admission_type}})
    res.render('printregisterationslip',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:req.params.batchid,
        programtag:"ngo"
    });
  }
});
router.get('/printslipindustrybased/(:batchid)/(:applicantid)',ensureAuthenticated,async function(req,res){
   
  //const{programidlevel,applicantid} = req.body;
const applicant = await IndustryBasedTrainee.findOne({where:{batch_id:req.params.batchid,applicant_id:req.params.applicantid}});
if(applicant){
  const department = await Occupation.findOne({where:{occupation_id:applicant.department_id}})
  const courselist = await IndustryCourse.findAll({where:{department_id:applicant.department_id,batch_id:applicant.batch_id}})
  const classlist = await ClassInDept.findOne({where:{batch_id:req.params.batchid,department_id:applicant.department_id,training_type:applicant.admission_type}})
  res.render('printregisterationslip',{
      applicant:applicant,
      classlist:classlist,
      department:department,
      courselist:courselist,
      programidlevel:req.params.batchid,
      programtag:"industry"
  });
}
});
router.get('/printslip/(:batchid)/(:applicantid)',ensureAuthenticated,async function(req,res){
   
    //const{programidlevel,applicantid} = req.body;
  const applicant = await LevelBasedTrainee.findOne({where:{batch_id:req.params.batchid,applicant_id:req.params.applicantid}});
  if(applicant){
    const department = await Occupation.findOne({where:{occupation_id:applicant.department_id}})
    const courselist = await Course.findAll({where:{department_id:applicant.department_id,training_level:applicant.entry_level}})
    const classlist = await ClassInDept.findOne({where:{batch_id:req.params.batchid,department_id:applicant.department_id,training_level:applicant.entry_level,training_type:applicant.admission_type}})
    res.render('printregisterationslip',{
        applicant:applicant,
        classlist:classlist,
        department:department,
        courselist:courselist,
        programidlevel:req.params.batchid,
        programtag:"level"
    });
  }
});
router.get('/printslipcontinuestudy/(:batchid)/(:applicantid)',ensureAuthenticated,async function(req,res){
   
  //const{programidlevel,applicantid} = req.body;
const applicant = await LevelBasedTrainee.findOne({where:{batch_id:req.params.batchid,student_unique_id:req.params.applicantid}});
if(applicant){
  const department = await Department.findOne({where:{department_id:applicant.department_id}})
  const courselist = await Course.findAll({where:{department_id:applicant.department_id,training_level:applicant.current_level}})
  const classlist = await ClassInDept.findOne({where:{batch_id:req.params.batchid,department_id:applicant.department_id,training_level:applicant.current_level,training_type:applicant.admission_type}})
  res.render('printregisterationslip',{
      applicant:applicant,
      classlist:classlist,
      department:department,
      courselist:courselist,
      programidlevel:req.params.batchid,
      programtag:"level"
  });
}
});
router.post('/selectallbybatchidtoregister',ensureAuthenticated,async function(req,res){

  const{programidbatch,dept} = req.body;
  const department = await Occupation.findAll({});
  console.log("hexxxxxxxxxxxxxxxxxxxxxxx")
  console.log(dept);
  const [allapplicants, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM newapplicants INNER JOIN occupations ON newapplicants.selected_department = occupations.occupation_id "+
"  where application_id='"+programidbatch+"' and selected_department='"+dept+"' and is_selected= 'Yes' "+
" and selected_class =''"
  );
  const [levelbased, metalevelbaseddatas] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes' and levelbasedprograms.is_confirm ='Yes' "
  );
  NewApplicant.findAll({where:{application_id:programidbatch,selected_department:dept,is_selected:"Yes"}}).then(applicant =>{

    res.render('registerinbatch',{applicantlist:allapplicants,  programtag:"level"})
  }).catch(error =>{
   
    
    res.render('searchselectedapplicanttoregister',{
        levelbased:levelbased,
        ngobased:department
    })
  })

});
router.post('/selectallbybatchidtoregisterngo',ensureAuthenticated,async function(req,res){

  const{programidbatch,dept} = req.body;
  const department = await Occupation.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open='Yes'  and ngobasedprograms.is_confirm ='Yes'"
  );
 const [allapplicants, metalngobaseddata] = await sequelize.query(
    "SELECT * FROM newapplicants INNER JOIN occupations ON newapplicants.selected_department = occupations.occupation_id "+
"  where application_id='"+programidbatch+"' and selected_department='"+dept+"' and is_selected= 'Yes' "+
" and selected_class =''"
  ); 


  NewApplicant.findAll({where:{application_id:programidbatch,selected_department:dept,is_selected:"Yes"}}).then(applicant =>{

    res.render('registerinbatchngo',{applicantlist:allapplicants,  programtag:"ngo"})
  }).catch(error =>{
   
    
    res.render('searchapplicanttoregisterngo',{
        levelbased:levelbased,
        ngobased:department
    })
  })

});
router.post('/selectallbybatchidtoregisterindustry',ensureAuthenticated,async function(req,res){

  const{programidbatch,dept} = req.body;
  const department = await Department.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open='Yes'  and industrybasedprograms.is_confirm ='Yes'"
  );
  const [allapplicants, metalevelbaseddatas] = await sequelize.query(
    "SELECT * FROM newapplicants INNER JOIN occupations ON newapplicants.selected_department = occupations.occupation_id "+
"  where application_id='"+programidbatch+"' and selected_department='"+dept+"' and is_selected= 'Yes'"+
" and selected_class =''"
  );

  NewApplicant.findAll({where:{application_id:programidbatch,selected_department:dept,is_selected:"Yes"}}).then(applicant =>{

    res.render('registerinbatchindustry',{applicantlist:allapplicants,  programtag:"industry"})
  }).catch(error =>{
   
    
    res.render('searchapplicanttoregisterindustry',{
        levelbased:levelbased,
        ngobased:department
    })
  })

});

router.get('/graduatedtraineetojbsdb',async function(req,res){
      const department = await Occupation.findAll({});
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id "
      );
      const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id "
      );
      const [industrybased, metaindustrybaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id "
      );
      res.render('graduatedtraineetojbsdb',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        department:department
    })
})

router.post('/registerindustrybasedtraineewithoutapplication',ensureAuthenticated,async function(req,res){
  const {programid,dept} = req.body;
  const department  = await Department.findAll({});
  const classlist  = await ClassInDept.findAll({where:{batch_id:programid,department_id:dept}});
  let errors = []
  if(programid=="0"){
    errors.push({msg:'please select industry based program batch to register'})
  }
  if(errors.length >0){
    res.render('registerindustrywithoutapplication',{error_msg:'Please first select industry based programto register trainees'})
  }
  else{
    res.render('registerindustrywithoutapplication',{programid:programid,dept:dept,classlist:classlist})
  }
})
router.post('/registertraineeindustrynoapplication/(:programid)',uploadFile.single("traineephoto"),ensureAuthenticated,async function(req,res){
  const {perinfos,addinfo,grade9trans,grade10trans,grade11trans,grade12trans,ave12trans,appid,classname,
     ave11trans,paymentinfo,ave10trans,ave9trans,isdisable,egsec,ssle,departmentchoice,trainingtype
} = req.body ;
let errors = []
 

  if(!req.file){
console.log("No File!")
  }

  if(errors.length >0){

  }else{
    const department = await Department.findAll({});
 const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  studentid = uuidv4(v1options);
  const newindustrybasedtraineeData = {
      batch_id: req.params.programid,
      applicant_id: appid,
      applicant_photo: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.file.filename
        ),
      photo_type: req.file.mimetype,
      photo_name: req.file.filename,
      trainee_id: studentid,
      student_unique_id:appid,
      personal_info: perinfos,
      contact_info: addinfo,
      grade9_trans: grade9trans,
      grade10_trans:grade10trans,
      grade11_trans: grade11trans,
      grade12_trans:grade12trans,
      grade9_ave:ave9trans,
      grade10_ave: ave10trans,
      grade11_ave: ave11trans,
      grade12_ave: ave12trans,
      grade10_leaving: egsec,
      grade12_leaving: ssle,
      apptitude_result: 0,
      department_id: departmentchoice,
      admission_type:trainingtype,
      class_id: classname,
      entry_level: "",
      current_level: "",
      entry_semister: "1",
      current_semister: "1",
      is_disable: isdisable,
      is_graduated:"No",
      is_dropout:"No",
      countinue_study:"No",
      payment_info:paymentinfo
      
  }
  IndustryBasedTrainee.findOne({where:{batch_id:req.params.programid,applicant_id:appid}}).then(regtrainee =>{
      if(regtrainee)
      {
          res.render('registerindustrywithoutapplication',{
             dept:departmentchoice,
             programid:req.params.programid,
              error_msg:'Applicant with this application ID already registered'
          })
      }
      else{
          IndustryBasedTrainee.create(newindustrybasedtraineeData).then((trainee)=>{
              fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ trainee.photo_name,
             
              trainee.applicant_photo
            );
            res.redirect("/registration/printslipindustrybased/"+req.params.programid+"/"+ appid +"");
  
          }).catch(error =>{
              console.log(error)
          })
      }
  }).catch(error=>{
      console.log(error)
  })
  }

 
});
router.post('/registerngobasedtraineewithoutapplication',ensureAuthenticated,async function(req,res){
  const {programid,dept} = req.body;
  const department  = await Department.findAll({});
  const classlist  = await ClassInDept.findAll({where:{batch_id:programid,department_id:dept}});
  let errors = []
  if(programid=="0"){
    errors.push({msg:'please select industry based program batch to register'})
  }
  if(errors.length >0){
    res.render('registerngowithoutapplication',{error_msg:'Please first select industry based programto register trainees'})
  }
  else{
    res.render('registerngowithoutapplication',{programid:programid,dept:dept,classlist:classlist})
  }
})
router.post('/registertraineengonoapplication/(:programid)',uploadFile.single("traineephoto"),ensureAuthenticated,async function(req,res){
  const {perinfos,addinfo,grade9trans,grade10trans,grade11trans,grade12trans,ave12trans,appid,classname,
     ave11trans,paymentinfo,ave10trans,ave9trans,isdisable,egsec,ssle,departmentchoice,trainingtype
} = req.body ;
let errors = []
 

  if(!req.file){
console.log("No File!")
  }

  if(errors.length >0){

  }else{
    const department = await Department.findAll({});
 const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  studentid = uuidv4(v1options);
  const newindustrybasedtraineeData = {
      batch_id: req.params.programid,
      applicant_id: appid,
      applicant_photo: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.file.filename
        ),
      photo_type: req.file.mimetype,
      photo_name: req.file.filename,
      trainee_id: studentid,
      student_unique_id:appid,
      personal_info: JSON.parse(perinfos),
      contact_info:JSON.parse(addinfo),
      grade9_trans: JSON.parse(grade9trans),
      grade10_trans:JSON.parse(grade10trans),
      grade11_trans: JSON.parse(grade11trans),
      grade12_trans: JSON.parse(grade12trans),
      grade12_ave:parseFloat(ave12trans).toFixed(2),
        grade11_ave:parseFloat(ave11trans).toFixed(2),
        grade10_ave:parseFloat(ave10trans).toFixed(2),
        grade9_ave:parseFloat(ave9trans).toFixed(2),

        grade10_leaving: parseFloat(egsec).toFixed(2) ,
        grade12_leaving: parseFloat(ssle).toFixed(2),
      apptitude_result: 0,
      department_id: departmentchoice,
      admission_type:trainingtype,
      class_id: classname,
      entry_level: "",
      current_level: "",
      entry_semister: "1",
      current_semister: "1",
      is_disable: isdisable,
      is_graduated:"No",
      is_dropout:"No",
      countinue_study:"No",
      payment_info:paymentinfo
      
  }
  NGOBasedTrainee.findOne({where:{batch_id:req.params.programid,applicant_id:appid}}).then(regtrainee =>{
      if(regtrainee)
      {
          res.render('registerngowithoutapplication',{
             dept:departmentchoice,
             programid:req.params.programid,
              error_msg:'Applicant with this application ID already registered'
          })
      }
      else{
          NGOBasedTrainee.create(newindustrybasedtraineeData).then((trainee)=>{
              fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ trainee.photo_name,
             
              trainee.applicant_photo
            );
            res.redirect("/registration/printslipngobased/"+req.params.programid+"/"+ appid +"");
  
          }).catch(error =>{
              console.log(error)
          })
      }
  }).catch(error=>{
      console.log(error)
  })
  }

 
});

router.get('/existedlevelbasedtraineecontinuestudy',ensureAuthenticated,async function(req,res){
  const department = await Occupation.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'  and levelbasedprograms.is_confirm ='Yes'"
  );

res.render('searchselectedapplicantcontinuestudy',{
    levelbased:levelbased,
    department:department
})

})
router.post('/searchexistedtraineedata',ensureAuthenticated,async function(req,res){
  const {batchid,traineeid,deptid,level,newlevel,addmissiontype,batchidnew} = req.body;
  const departmentone = await Occupation.findAll({where:{department_id:deptid}});
  const department = await Occupation.findAll({});
  const [classlist, metaclasslist] = await sequelize.query(
    "SELECT * FROM classindepts where department_id='"+deptid+"' and batch_id='"+batchidnew+"' and training_level='"+newlevel+"'"
  );
  const [courselist, metacourselist] = await sequelize.query(
    "SELECT * FROM courses where department_id='"+deptid+"'  and training_level='"+newlevel+"'"
  );
  
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'  and levelbasedprograms.is_confirm ='Yes'"
  );
    const applicant = await LevelBasedTrainee.findOne({where:{batch_id:batchid,student_unique_id:traineeid,department_id:deptid,current_level:level,is_graduated:'Yes'}});
    if(!applicant){
     
      res.render('searchselectedapplicantcontinuestudy',{
        levelbased:levelbased,
        department:department,
        error_msg:'Cant find registerd trainee with this ID please try again'
    })
    }else{
      res.render('registerexistedtraineecountinuestudy',{
        applicant:applicant,
        classlist:classlist,
        department:departmentone,
        newlevel:newlevel,
        level:level,
        admissiontype:addmissiontype,
        batchid:batchid,
        batchidnew:batchidnew,
        programtag:"level",
        traineeid:traineeid,
        courselist:courselist
      
    })
        
         }


})
router.post('/registercontinuestudy',ensureAuthenticated,async function(req,res){
  const {batchid,batchidnew,traineeid,deptid,level,newlevel,admissiontype,classname} = req.body;

  const department = await Occupation.findAll({});
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'  and levelbasedprograms.is_confirm ='Yes'"
  );
    const applicant = await LevelBasedTrainee.findOne({where:{batch_id:batchid,student_unique_id:traineeid,department_id:deptid,current_level:level}});
    if(!applicant){
     
      res.render('searchselectedapplicantcontinuestudy',{
        levelbased:levelbased,
      department:department,
        error_msg:'Cant find registerd trainee with this ID please try again'
    })
    }else{
        const department = await Department.findAll({});
          const [levelbased, metalevelbaseddata] = await sequelize.query(
            "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open='Yes'"
          );
             const v1options = {
          node: [0x01, 0x23],
          clockseq: 0x1234,
          msecs: new Date('2011-11-01').getTime(),
          nsecs: 5678,
        };
        studentid = uuidv4(v1options);
        const newlevelbasedtraineeData = {
            batch_id: batchidnew,
            applicant_id: applicant.applicant_id,
            applicant_photo: applicant.applicant_photo,
            photo_type: applicant.photo_type,
            photo_name: applicant.photo_name,
            trainee_id: studentid,
            student_unique_id:traineeid,
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
            department_id: applicant.department_id,
            admission_type:admissiontype,
            class_id: classname,
            entry_level: applicant.entry_level,
            current_level: newlevel,
            entry_semister: "1",
            current_semister: "1",
            is_disable: "No",
            is_graduated:"No",
            is_dropout:"No",
            countinue_study:"Yes",
            payment_info:applicant.payment_info
            
        }
        LevelBasedTrainee.findOne({where:{batch_id:batchid,student_unique_id:traineeid,current_level:newlevel}}).then(regtrainee =>{
            if(regtrainee)
            {
                res.render('searchselectedapplicantcontinuestudy',{
                    levelbased:levelbased,
                    ngobased:department,
                    error_msg:'Trainee with this application ID already registered'
                })
            }
            else{
                LevelBasedTrainee.create(newlevelbasedtraineeData).then((trainee)=>{
                  
                  res.redirect("/registration/printslipcontinuestudy/"+batchidnew+"/"+traineeid +"");
        
                }).catch(error =>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        
         }


})
module.exports = router;

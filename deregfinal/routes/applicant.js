const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const User = db.users;
const NewApplicant =db.newapplicants;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4, parse } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const LevelBasedProgram = db.levelbasedprograms;


router.get('/addnewapplicant',ensureAuthenticated,async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
      );
      const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
      );
        res.render('selectprogramtoregister',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased
    });
});
router.post('/addapplicanttolevelbasedprogram',ensureAuthenticated, async function(req,res){
   const {programidlevel} = req.body;
   const [ngobased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
  );
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
  );
  const [industrybased, metaindbaseddata] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
  );
 
let errors = [];
if(programidlevel == "0" || !programidlevel){
errors.push({msg:'please select batch name first'})
}
if(errors.length >0)
{
    res.render('selectprogramtoregister',{
    levelbased:levelbased,
    ngobased:ngobased,
    industrybased:industrybased,
    error_msg:'Please select batch/open program first'
});
}
else
{
    const department = await Department.findAll({})
    res.render('addnewapplicant',{programidlevel:programidlevel,department:department});}
});
router.post('/addapplicanttongobasedprogram',ensureAuthenticated, async function(req,res){
    const {programidngo} = req.body;
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
      );
      const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
      );
     
    let errors = [];
    if(programidngo == "0" || !programidngo){
    errors.push({msg:'please select batch name first'})
    }
    if(errors.length >0)
    {
        res.render('selectprogramtoregister',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        error_msg:'Please select batch/open program first'
    });
    }
    else
    {
        const department = await Department.findAll({})
        res.render('addnewapplicantngo',{programidlevel:programidngo,department:department});
    
    }
   
    });
 router.post('/addapplicanttoindustrybasedprogram',ensureAuthenticated, async function(req,res){
    const {programid} = req.body;
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
      );
      const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
      );
     
    let errors = [];
    if(programid == "0" || !programid){
    errors.push({msg:'please select batch name first'})
    }
    if(errors.length >0)
    {
        res.render('selectprogramtoregister',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        error_msg:'Please select batch/open program first'
    });
    }
    else
    {
        const department = await Department.findAll({})
     res.render('addnewapplicantindustry',{programidlevel:programid,department:department});}
 });
router.post('/updateapplicanttolevelbasedprogram',ensureAuthenticated, async function(req,res){
    const {programidlevel} = req.body;
    const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
    );
    const [industrybased, metaindbaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
    );
   
  let errors = [];
  if(programidlevel == "0" || !programidlevel){
  errors.push({msg:'please select batch name first'})
  }
  if(errors.length >0)
  {
      res.render('selectprogramtoupdate',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased,
      error_msg:'Please select batch/open program first'
  });
  }
  else
  {
    const department = await Department.findAll({});
    const applicantlist = await NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel}})
     res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,programidlevel:programidlevel});
 
  }
 
});
router.post('/updateentraceexamresult/(:applicantid)',ensureAuthenticated,async function(req,res){
    const{entranceresult,programidlevel} =req.body;
    let errors = [];
    const department = await Department.findAll({});
    const applicantlist = await NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel}})
   
    if(entranceresult == ""){
     errors.push({msg:'please enter exam result'})
    }
    if(errors.length >0){
        res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,programidlevel:programidlevel,
        error_msg:'Please enter result first!'
        });
 
    }
    else{
        NewApplicant.findOne({where:{applicant_id:req.params.applicantid}}).then(applicant =>{
            if(applicant)
            {
              
                NewApplicant.update({entrance_exam:entranceresult},{where:{applicant_id:req.params.applicantid,application_id:programidlevel}}).then(udtdt =>{
                  NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel}}).then(applicantlist =>{
                  if(applicantlist)
                  {
                    res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                      success_msg:'Applicant entrance exam updated successfully',programidlevel:programidlevel
                      });
                  }
                  }).catch(error =>{

                  })
   
                  
                }).catch(error =>{
                    res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                        error_msg:'Cant update result please try later!',programidlevel:programidlevel
                        });
                })
            }
            else{
       res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
            error_msg:'Cant find this applicant!',programidlevel:programidlevel
            });
            }
        }).catch(error =>{
            res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                error_msg:'Cant find this applicant!',programidlevel:programidlevel
                });
        })
    }
  
})
router.post('/updateapptitudeexamresult/(:applicantid)',ensureAuthenticated,async function(req,res){
  const{apptitudeexam,programidlevel} =req.body;
  let errors = [];
  const department = await Department.findAll({});
  const applicantlist = await NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel}})
 
  if(apptitudeexam == ""){
   errors.push({msg:'please enter exam result'})
  }
  if(errors.length >0){
      res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,programidlevel:programidlevel,
      error_msg:'Please enter result first!'
      });

  }
  else{
      NewApplicant.findOne({where:{applicant_id:req.params.applicantid,application_id:programidlevel}}).then(applicant =>{
          if(applicant)
          {
            
              NewApplicant.update({apptitude_result:apptitudeexam},{where:{applicant_id:req.params.applicantid}}).then(udtdt =>{
              NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel}}).then(applicantlist =>{
                  if(applicantlist)
                  {
                    res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                      success_msg:'Applicant entrance exam updated successfully',programidlevel:programidlevel
                      });
                  }
                  }).catch(error =>{
                    
                  })
                 
              }).catch(error =>{
                  res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                      error_msg:'Cant update result please try later!',programidlevel:programidlevel
                      });
              })
          }
          else{
     res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
          error_msg:'Cant find this applicant!',programidlevel:programidlevel
          });
          }
      }).catch(error =>{
          res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
              error_msg:'Cant find this applicant!',programidlevel:programidlevel
              });
      })
  }

})
router.get('/updateapplicantinfo',ensureAuthenticated, async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where levelbasedprograms.is_open ='Yes'"
      );
      const [industrybased, metaindbaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
      );
        res.render('selectprogramtoupdate',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased
    });
})
router.post('/addnewapplicant',ensureAuthenticated,async function(req,res){
  let errors =[];
  const department = await Department.findAll({});
  
  const {totaltranscript,age,gender,scholarshiptype,specialneedes, perinfos,addinfo,grade9trans,grade10trans,grade11trans,grade12trans,ave12trans,appid,
    programid, ave11trans,paymentinfo,ave10trans,ave9trans,isdisable,choice1,choice2,choice3,level,trainingtype,egsec,ssle
} = req.body ;

   const applicant = await NewApplicant.findOne({where:{applicant_id:appid,application_id:programid}})
   if(choice1 =="0" || choice2== "0" || choice3 =="0" || paymentinfo =="0" || gender=="0"){
       errors.push({msg:'Please select department choices'})
   }
   else if(appid ==""){
    errors.push({msg:'Please add applicant applicantion id'})

   }
   else if(applicant){
    errors.push({msg:'Applicant  with this application id already registered'})

   }
   else if(programid ==""){
   res.redirect('/addnewapplicant');

   }
   if(errors.length >0){
    res.render('addnewapplicant',{programidlevel:programid,department:department,error_msg:'Please enter all requred fields'})
  
   }
   else{
    const newapplicantData= {
      application_id:programid,
      applicant_id:appid,
      personal_info: JSON.parse(perinfos),
      contact_info:JSON.parse(addinfo),
      grade9_trans: JSON.parse(grade9trans),
      grade10_trans:JSON.parse(grade10trans),
      grade11_trans: JSON.parse(grade11trans),
      grade12_trans: JSON.parse(grade12trans),
      grade10_leaving: parseFloat(egsec).toFixed(2) ,
      grade12_leaving: parseFloat(ssle).toFixed(2),
      apptitude_result: 0,
      is_selected: "No",
      selected_department: "",
      selected_class:"",
      choice_one: choice1,
      choice_two:choice2,
      choice_three:choice3,
      choice_level:level,
      choice_program_type:trainingtype,
      is_disable:isdisable,
      payment_info:paymentinfo,
      disable_description:specialneedes,
      scholarship_type:scholarshiptype,
     
      total_transcript_ave912:totaltranscript,
      entrance_exam:0,
      age:age,
      affarmative_action:gender=="f"?3:0,
      grade12_ave:parseFloat(ave12trans).toFixed(2),
      grade11_ave:parseFloat(ave11trans).toFixed(2),
      grade10_ave:parseFloat(ave10trans).toFixed(2),
      grade9_ave:parseFloat(ave9trans).toFixed(2),
    };

    NewApplicant.create(newapplicantData).then(applicant =>{
        if(applicant)
        {
          res.render('addnewapplicant',{programidlevel:programid,department:department,
            success_msg_extra:"Successfully register applicant data.",
            success_extra:'/applicant/printapplicantion/'+appid})

        }
        else
        {
          res.render('addnewapplicant',{programidlevel:programid,department:department,error_msg:'Error while register applicant try later'})

        }
    }).catch(error =>{


      console.log(error);
      res.render('addnewapplicant',{programidlevel:programid,department:department,error_msg:'Error while register applicant try later'})
    })
   }
    


})
router.post('/addnewapplicantngo',ensureAuthenticated,async function(req,res){
    let errors =[];
    const department = await Department.findAll({});
    
    const {gender,scholarshiptype,specialneedes, totaltranscript,age,perinfos,addinfo,grade9trans,grade10trans,grade11trans,grade12trans,ave12trans,appid,
      programid, ave11trans,paymentinfo,ave10trans,ave9trans,isdisable,choice1,choice2,choice3,trainingtype,egsec,ssle
  } = req.body ;
  const applicant = await NewApplicant.findOne({where:{applicant_id:appid,application_id:programid}})
  
     if(choice1 =="0" || choice2== "0" || choice3 =="0" ||paymentinfo =="0" || gender=="0"){
         errors.push({msg:'Please select department choices'})
     }
     else if(appid ==""){
      errors.push({msg:'Please add applicant applicantion id'})
  console.log("appid")
     } else if(applicant){
      errors.push({msg:'Applicant  with this application id already registered'})
  
     }
     else if(programid ==""){
         console.log("programid")
        errors.push({msg:'Please add applicant applicantion id'})
  
     }
     if(errors.length >0){
      res.render('addnewapplicantngo',{programidlevel:programid,department:department,error_msg:'Please enter all requred fields'})
    
     }
     else{
      const newapplicantData= {
        application_id:programid,
        applicant_id:appid,
        personal_info: JSON.parse(perinfos),
        contact_info:JSON.parse(addinfo),
        grade9_trans: JSON.parse(grade9trans),
        grade10_trans:JSON.parse(grade10trans),
        grade11_trans: JSON.parse(grade11trans),
        grade12_trans: JSON.parse(grade12trans),
        grade10_leaving: parseFloat(egsec).toFixed(2) ,
        grade12_leaving: parseFloat(ssle).toFixed(2),
        apptitude_result: "",
        is_selected: "No",
        selected_department: "",
        selected_class:"",
        choice_one: choice1,
        choice_two:choice2,
        choice_three:choice3,
        choice_program_type:trainingtype,
        is_disable:isdisable,
        disable_description:specialneedes,
        scholarship_type:scholarshiptype,
        total_transcript_ave912:totaltranscript,
        entrance_exam:0,
        age:age,
        affarmative_action:gender=="f"?3:0,
        payment_info:paymentinfo,
        grade12_ave:parseFloat(ave12trans).toFixed(2),
        grade11_ave:parseFloat(ave11trans).toFixed(2),
        grade10_ave:parseFloat(ave10trans).toFixed(2),
        grade9_ave:parseFloat(ave9trans).toFixed(2),
      };

      NewApplicant.create(newapplicantData).then(applicant =>{
          if(applicant)
          {
            res.render('addnewapplicant',{programidlevel:programid,department:department,
              success_msg_extra:"Successfully register applicant data.",
              success_extra:'/applicant/printapplicantion/'+appid})
  
          }
          else
          {
            res.render('addnewapplicantngo',{programidlevel:programid,department:department,error_msg:'Error while register applicant try later'})
  
          }
      }).catch(error =>{


        console.log(error);
        res.render('addnewapplicantngo',{programidlevel:programid,department:department,error_msg:'Error while register applicant try later'})
      })
     }
       
  
  
  })
router.get('/filterapplicant',ensureAuthenticated,async function(req,res){
   
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
        res.render('selectprogramtofilterapplicant',{
        levelbased:levelbased,
        ngobased:ngobased
    });
})
router.post('/filterapplicantlevelbased',ensureAuthenticated,async function(req,res){
    const{trainingtype,level,programidlevel} =req.body;
    let errors = [];
    const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
    );
    const [industrybased, metaindbaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
    );
   

  if(programidlevel == "0" || !programidlevel){
  errors.push({msg:'please select batch name first'})
  }
  if(level == "0" || !level){
    errors.push({msg:'please select level first'})
    }
    if(trainingtype == "0" || !trainingtype){
      errors.push({msg:'please select training type first'})
      }
  if(errors.length >0)
  {
      res.render('selectprogramtofilterapplicant',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased,
      error_msg:'Please select batch/open program first'
  });
  }
  else
  {
    const department = await Department.findAll({});
    const applicantlist = await NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel,choice_level:level,choice_program_type:trainingtype}})
    res.render('applicantlisttobefilter',{
        department:department,
        applicantlist:applicantlist,
        applevel:level,
        applistfilter:applicantlist,
        programtype:trainingtype,
        programidlevel:programidlevel
    });
  }
  
});
router.post('/filterapplicantngobased',ensureAuthenticated,async function(req,res){
    const{trainingtype,programidngo} =req.body;
    let errors = [];
    const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where ngobasedprograms.is_open ='Yes'"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id  where levelbasedprograms.is_open ='Yes'"
    );
    const [industrybased, metaindbaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where industrybasedprograms.is_open ='Yes'"
    );
   

  if(programidngo == "0" || !programidngo){
  errors.push({msg:'please select batch name first'})
  }

    if(trainingtype == "0" || !trainingtype){
      errors.push({msg:'please select training type first'})
      }
  if(errors.length >0)
  {
      res.render('selectprogramtofilterapplicant',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased,
      error_msg:'Please select batch/open program first'
  });
  }
  else
  {
    const department = await Department.findAll({});
    const applicantlist = await NewApplicant.findAll({where:{is_selected:"No",application_id:programidngo,choice_program_type:trainingtype}})
    res.render('applicantlisttobefilter',{
        department:department,
        applicantlist:applicantlist,
        applevel:'',
        applistfilter:applicantlist,
        programtype:trainingtype,
        programidlevel:programidngo
    });
  }
  
});
router.post('/filterapplicantbycriteriassetted',ensureAuthenticated,async function(req,res){
const{choiceorder,departmentchoice,limitsize,orderby,programtype,applevel,programidlevel,criteria} = req.body;
let dptchoice = departmentchoice;
const department = await Department.findAll({});

var querytop = "select *  from newapplicants where is_selected = 'No' and application_id = '"+programidlevel+"' and choice_level ='"+applevel+"'";
var query = "select applicant_id, sum(";
var filter ;
if(criteria){
  filter = JSON.parse(criteria);
  Object.getOwnPropertyNames(filter).forEach(
    function (val, idx, array) {
  
   var keys = val ;
   console.log(keys);
   var vals = filter[val] ;
   console.log(vals);
   if("apptitude_result" == keys ){
    query += "(apptitude_result *"+vals+")/100 + ";
   }
   else if("total_transcript_ave912"  == keys){
    query += "(total_transcript_ave912 *"+vals+")/100 +";
   }
    else if( "grade10_leaving"  == keys){
      query += "(grade10_leaving *"+vals+")/100 + ";
    }
      else if( "grade12_leaving"  == keys){
        query += "( grade12_leaving *"+vals+")/100 + ";
      }
        else if( "affarmative_action"  == keys){
          query += "(affarmative_action *"+vals+")/100 + ";
        }
       
    });
}

 query += " 0 ) as total from newapplicants where is_selected = 'No' and application_id = '"+programidlevel+"' group by applicant_id";

 if(choiceorder){
  if(choiceorder =="choice_one"){
    querytop +=" and choice_one='"+departmentchoice+"'"
   
    }
    else if(choiceorder =="choice_two"){
      querytop +=" and choice_two='"+departmentchoice+"'";
        
    }
    else if(choiceorder =="choice_three"){
      querytop +=" and choice_three='"+departmentchoice+"'"
    }
 }

  query +="  order by total desc";

  if(limitsize == ""){
  
  }
  else{
      query +=" limit "+limitsize+"";
  }
 console.log(query);  
const [applfilter, metalevelbaseddata] = await sequelize.query(query);
const [applicantlistsqt, metalevelbaseddatat] = await sequelize.query(querytop);

res.render('applicantlisttobefilter',{
    department:department,
    applicantlist:applicantlistsqt,
    applistfilter:applfilter,
    applevel:applevel,
    programtype:programtype,
    programidlevel:programidlevel
});

});
router.post('/updateselecteddepartment',ensureAuthenticated,async function(req,res){
    const{departmentselected,programidlevel,applicantid} =req.body;
    let errors = [];
    const department = await Department.findAll({});
    const applicantlist = await NewApplicant.findAll({where:{is_selected:"No",application_id:programidlevel}})
   
    console.log(req.body);
    if(departmentselected == "0"){
     errors.push({msg:'please enter selected department'})
    }
    if(errors.length >0){
        // res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,programidlevel:programidlevel,
        // error_msg:'Please enter result first!'
        // });
 res.send({data:"error"})
    }
    else{
        NewApplicant.findOne({where:{applicant_id:applicantid}}).then(applicant =>{
            if(applicant)
            {
              
                NewApplicant.update({is_selected:"Yes",selected_department:departmentselected},{where:{applicant_id:applicantid}}).then(udtdt =>{
                    res.send({data:"success",  success_msg:'Applicant entrance exam updated successfully' })
                    // res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                    //     success_msg:'Applicant entrance exam updated successfully',programidlevel:programidlevel
                    //     });
                }).catch(error =>{
                    // res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
                    //     error_msg:'Cant update result please try later!',programidlevel:programidlevel
                    //     });
                    res.send({data:"error1"})
                })
            }
            else{
    //    res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
    //         error_msg:'Cant find this applicant!',programidlevel:programidlevel
    //         });
    res.send({data:"error1"})
            }
        }).catch(error =>{
            // res.render('updatenewapplicantresult',{applicantlist:applicantlist,department:department,
            //     error_msg:'Cant find this applicant!',programidlevel:programidlevel
            //     });
            res.send({data:"error1"})
        })
    }
  
});
router.post('/confirmselectedapplicantdepartmentbulk',ensureAuthenticated,async function(req,res){
  const {pTableData} =req.body ;
  let errors =[];
  const copyItems = [];
myObj = JSON.parse(pTableData);

for (let i = 0; i < myObj.length; i++) {
  copyItems.push(myObj[i]);
}
console.log(pTableData);
console.log(copyItems);
  if(copyItems.length >0)
  {
  
   // console.log("x");
copyItems.forEach((item) => {

 var studentid=item.student_id;
  var batchid=item.batch_id;
  var departmentname = item.department_id;
  if(!studentid || !batchid || !departmentname ){
   errors.push({msg:'please make sure your mark list is correct'})
   console.log("nooooooooooooooooooooooooooo")
  }
 else{
  NewApplicant.findOne({where:{applicant_id:studentid,application_id:batchid}}).then(applicant =>{
    if(applicant)
    {
      console.log(applicant)
        NewApplicant.update({is_selected:"Yes",selected_department:departmentname},{where:{applicant_id:studentid,application_id:batchid}}).then(udtdt =>{
        
        }).catch(error =>{
        console.log(error)
        errors.push({msg:'1'})
        })
    }
    else{
      errors.push({msg:'2'})
    }
}).catch(error =>{
  console.log(error)
  errors.push({msg:'3'})
  
})

 }
    

});
console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
  if(errors.length >0){
    console.log(errors)

    res.send({message:'error'})
  }else{
    res.send({message:'success'})
  }
  

  }
  else{
  
    
    res.send({message:'error'})
    console.log(errors)
  }

})
module.exports = router;
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
const Notification = db.notifications;
const ClassInDept = db.classindepts;
const NGOBasedTrainee = db.ngobasedtrainees;
const LevelBasedTrainee = db.levelbasedtrainees;
const IndustryBasedTrainee = db.industrybasedtrainees;
const LevelBasedProgress = db.levelbasedprogresses;
const CorseTeacherClass = db.courseteacherclasses;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Batch = db.batches;

router.post('/showclassstudentlevel/(:classname)',ensureAuthenticated,async function(req,res){
    
    const{level,programtype,dpt,batchid,courseid} = req.body;
    //const levelbased = await LevelBasedTrainee.findAll({where:{class_id:req.params.classname}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT * FROM  courses where course_id='"+courseid +"' "
      );   
    const [addinfo,addinfometa] = await sequelize.query(
      " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
    );
      const [studentwithmark, smarkstu] = await sequelize.query ( " SELECT * FROM levelbasedtrainees "+
    "  inner join studentmarklistlevelbaseds on levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
   "   where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
     " and studentmarklistlevelbaseds.class_id='"+req.params.classname+"'"+
     " and is_confirm_teacher='Yes'");
     console.log(studentwithmark)
      const levelbased = await LevelBasedTrainee.findAll({where:{class_id:req.params.classname}});
     res.render('alllevelbasedlist',{addinfo:addinfo,studentwithmark:studentwithmark,courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

    })
router.post('/showclassstudentngo/(:classname)',ensureAuthenticated,async function(req,res){

  const{level,programtype,dpt,batchid,courseid} = req.body;
  const levelbased = await NGOBasedTrainee.findAll({where:{class_id:req.params.classname}});
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  ngocourses where course_id='"+courseid +"' and batch_id='"+batchid+"' "
    );  
    const [addinfo,addinfometa] = await sequelize.query(
      " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+

" inner join departments on departments.department_id = classindepts.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
    );
    const [studentwithmark, smarkstu] = await sequelize.query ( " SELECT * FROM ngobasedtrainees "+
    "  inner join studentmarklistlevelbaseds on ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
   "   where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
     " and studentmarklistlevelbaseds.class_id='"+req.params.classname+"'"+
     " and is_confirm_teacher='Yes'");
 
    res.render('allngobasedlist',{addinfo:addinfo,studentwithmark:studentwithmark,courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

  })
router.post('/showclassstudentindustry/(:classname)',ensureAuthenticated,async function(req,res){

  const{level,programtype,dpt,batchid,courseid} = req.body;
  const levelbased = await IndustryBasedTrainee.findAll({where:{class_id:req.params.classname}});
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  industrycourses where course_id='"+courseid +"' and batch_id='"+batchid+"'"
    );
    const [addinfo,addinfometa] = await sequelize.query(
      " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+

" inner join departments on departments.department_id = classindepts.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
    );
    const [studentwithmark, smarkstu] = await sequelize.query ( " SELECT * FROM industrybasedtrainees "+
    "  inner join studentmarklistlevelbaseds on industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "+
   "   where studentmarklistlevelbaseds.course_id ='"+courseid+"' "+
     " and studentmarklistlevelbaseds.class_id='"+req.params.classname+"'"+
     " and is_confirm_teacher='Yes'");
    
    res.render('allindustrybasedlist',{addinfo:addinfo,studentwithmark:studentwithmark,courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

  })

  
router.post('/generatecoursegradelevelbased/(:classname)',ensureAuthenticated,async function(req,res){
  
    const{level,programtype,dpt,batchid,courseid} = req.body;
    const [courselist, metadata] = await sequelize.query(
        "SELECT * FROM  courses where course_id='"+courseid +"' "
      );  
      const [addinfo,addinfometa] = await sequelize.query(
        " select * from classindepts "+
  " inner join batches on batches.batch_id = classindepts.batch_id "+
  " inner join occupations on occupation_id = classindepts.department_id "+
  " inner join departments on departments.department_id = occupations.department_id "+
  " where classindepts.class_id='"+req.params.classname+"'"
      );
      const [levelbased, metadatalevelbased] = await sequelize.query(
        "select * "+
     " from  levelbasedtrainees  "+
      " inner join levelbasedprogresses on levelbasedtrainees.trainee_id = levelbasedprogresses.student_id "+
      " inner join courses on levelbasedprogresses.course_id=courses.course_id "+
     " where "+
     "  levelbasedtrainees.class_id = '"+ req.params.classname +"' and "+
      " levelbasedprogresses.course_id='"+courseid+"' and "+
      " levelbasedtrainees.class_id = levelbasedprogresses.class_id and  "+
      " JSON_LENGTH(industry_evaluation) = nooflo and "+
      " JSON_LENGTH(practical_evaluation) = nooflo and "+
      " JSON_LENGTH(theroretical_evaluation) = nooflo "
        );      
      res.render('genrategradereportlevel',{
        success_msg:"Please Make Sure Trainee Accomplish All Learning Outcomes Before Sending Grade Report To Department!",
        addinfo:addinfo,courseid:courseid,dpt:dpt,batchid:batchid,
        levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

})
router.post('/generatecoursegradengobased/(:classname)',ensureAuthenticated,async function(req,res){
  
  const{level,programtype,dpt,batchid,courseid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  ngocourses where course_id='"+courseid +"'  "
    );   
    const [addinfo,addinfometa] = await sequelize.query(
      " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+

" inner join departments on departments.department_id = classindepts.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
    );
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * "+
     " from  ngobasedtrainees  "+
      " inner join levelbasedprogresses on ngobasedtrainees.trainee_id = levelbasedprogresses.student_id "+
      " inner join ngocourses on levelbasedprogresses.course_id=ngocourses.course_id "+
     " where "+
     "  ngobasedtrainees.class_id = '"+ req.params.classname +"' and "+
      " levelbasedprogresses.course_id='"+courseid+"' and "+
      " ngobasedtrainees.class_id = levelbasedprogresses.class_id and  "+
      " JSON_LENGTH(industry_evaluation) = nooflo and "+
      " JSON_LENGTH(practical_evaluation) = nooflo and "+
      " JSON_LENGTH(theroretical_evaluation) = nooflo "
      );      
    res.render('genrategradereportlevel',{
      success_msg:"Please Make Sure Trainee Accomplish All Learning Outcomes Before Sending Grade Report To Department!",addinfo:addinfo,courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist
    ,classid:req.params.classname,level:level,programtype:programtype})

})
router.post('/generatecoursegradeindustrybased/(:classname)',ensureAuthenticated,async function(req,res){
  
  const{level,programtype,dpt,batchid,courseid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  industrycourses where course_id='"+courseid +"' "
    );  
    const [addinfo,addinfometa] = await sequelize.query(
      " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+

" inner join departments on departments.department_id = classindepts.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
    ); 
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * "+
      " from  industrybasedtrainees  "+
       " inner join levelbasedprogresses on industrybasedtrainees.trainee_id = levelbasedprogresses.student_id "+
       " inner join industrycourses on levelbasedprogresses.course_id=industrycourses.course_id "+
      " where "+
      "  industrybasedtrainees.class_id = '"+ req.params.classname +"' and "+
       " levelbasedprogresses.course_id='"+courseid+"' and "+
       " industrybasedtrainees.class_id = levelbasedprogresses.class_id and  "+
       " JSON_LENGTH(industry_evaluation) = nooflo and "+
       " JSON_LENGTH(practical_evaluation) = nooflo and "+
       " JSON_LENGTH(theroretical_evaluation) = nooflo "
      
      );      
    res.render('genrategradereportlevel',{
      success_msg:"Please Make Sure Trainee Accomplish All Learning Outcomes Before Sending Grade Report To Department!",
      addinfo:addinfo,courseid:courseid,dpt:dpt,batchid:batchid,
      levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype})

})


router.post('/findmyclasstoevaluatecourselevel',ensureAuthenticated,async function(req,res){
     const{batchid,dpt,level} = req.body;
    
     const batchinfo =await Batch.findOne({where:{batch_id:batchid}});
     const [results, metadata] = await sequelize.query(
        "SELECT distinct classindepts.class_id,occupations.occupation_name,classindepts.class_name,classindepts.department_id,classindepts.batch_id,classindepts.training_level,classindepts.class_id,classindepts.training_type FROM  courseteacherclasses "+
        "INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id "+
        " inner join occupations on occupations.occupation_id = classindepts.department_id "+
        " where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.department_id='"+dpt+"'" +
        " and classindepts.training_level='"+level+"'"
      );  
      const [course, metadatacourse] = await sequelize.query(
        "SELECT * FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.department_id='"+dpt+"' and courses.training_level='"+level+"'"
      );  
      console.log("batchhhhhhhhhh")   
      console.log(batchinfo)
     res.render('myclasses',{tag:"level",batchinfo:batchinfo ,classlist:results,course:course,programtag:"level"})
});
router.post('/findmyclasstoevaluatecoursengo',ensureAuthenticated,async function(req,res){
  const{batchidn,dptn} = req.body;
  const batchinfo =await Batch.findOne({where:{batch_id:batchidn}});
  const [results, metadata] = await sequelize.query(
     "SELECT distinct classindepts.class_id,department_name,classindepts.class_name,classindepts.department_id,classindepts.batch_id,classindepts.training_level,classindepts.class_id,classindepts.training_type FROM  courseteacherclasses "+
     " inner join departments on departments.department_id= courseteacherclasses.department_id "+
     "INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchidn+"' and courseteacherclasses.department_id='"+dptn+"'"
   );  
   const [course, metadatacourse] = await sequelize.query(
     "SELECT * FROM  courseteacherclasses "+
     "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchidn+"' and courseteacherclasses.department_id='"+dptn+"'"
   );     
   console.log(results)
  res.render('myclasses',{tag:"ngo",batchinfo:batchinfo ,classlist:results,course:course,programtag:"ngo"})
});
router.post('/findmyclasstoevaluatecourseindustry',ensureAuthenticated,async function(req,res){
  const{batchidi,dpti} = req.body;
  const batchinfo =await Batch.findOne({where:{batch_id:batchidi}});
  const [results, metadata] = await sequelize.query(
    "SELECT distinct classindepts.class_id,department_name, classindepts.class_name,classindepts.department_id,classindepts.batch_id,classindepts.training_level,classindepts.class_id,classindepts.training_type FROM  courseteacherclasses "+
    " inner join departments on departments.department_id= courseteacherclasses.department_id "+
     "INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchidi+"' and courseteacherclasses.department_id='"+dpti+"'"
   );  
   const [course, metadatacourse] = await sequelize.query(
     "SELECT * FROM  courseteacherclasses "+
     "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchidi+"' and courseteacherclasses.department_id='"+dpti+"' "
   );     
   console.log(results)
  res.render('myclasses',{tag:"industry",batchinfo:batchinfo ,classlist:results,course:course,programtag:"industry"})
});






router.post('/savestudentevaluationtheretical',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  //console.log(copyItems);
    if(copyItems.length >0)
    {
     // console.log("x");
  copyItems.forEach((item) => {
     var courseid = item.courseid;
     var studentid = item.studentid;
     var evaluation = item.evaluation;
     var level = item.level;
     var programtype = item.programtype;
     var classid = item.classid;
     var dpt = item.department;
     var batchid = item.batchid;
     var loid = item.loid;
       var theroretical_evaluation = {
     
           };
     var newlo = loid;
    var newVal = evaluation;
    theroretical_evaluation[loid] = parseFloat(evaluation);
    
    const mark = {
        class_id: classid,
        batch_id: batchid,
        program_type: programtype,
        training_level: level,
        department_id: dpt,
        teacher_id: req.user.userid,
        student_id: studentid,
        course_id:courseid,
        practical_evaluation:0,
        theroretical_evaluation:theroretical_evaluation,
        industry_evaluation:0,
        is_confirm_registrar:"No",
        is_confirm_department:"No",
        is_confirm_teacher:"No"

     }
 console.log("prtheroretical_evaluation |theroretical_evaluation |theroretical_evaluation |theroretical_evaluation |theroretical_evaluation |")   
  console.log(mark);
     LevelBasedProgress.findOne({where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
         if(!marklist){
            LevelBasedProgress.create(mark);
         }
         else{
          var data = marklist.theroretical_evaluation;
 if(data == 0){
            data = {};
          }else{
            data = marklist.theroretical_evaluation;
          }
          data[loid] = parseFloat(evaluation);
            LevelBasedProgress.update({theroretical_evaluation:data},{where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
router.post('/savestudentevaluationpractical',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  //console.log(copyItems);
    if(copyItems.length >0)
    {
     // console.log("x");
  copyItems.forEach((item) => {
    var courseid = item.courseid;
    var studentid = item.studentid;
    var evaluation = item.evaluation;
    var level = item.level;
    var programtype = item.programtype;
    var classid = item.classid;
    var dpt = item.department;
    var batchid = item.batchid;
    var loid = item.loid;
      var practical_evaluation = {
    
          };
    var newlo = loid;
   var newVal = evaluation;
   practical_evaluation[loid] = parseFloat(evaluation);
     const mark = {
        class_id: classid,
        batch_id: batchid,
        program_type: programtype,
        training_level: level,
        department_id: dpt,
        teacher_id: req.user.userid,
        student_id: studentid,
        course_id:courseid,
        practical_evaluation:practical_evaluation,
        theroretical_evaluation:0,
        industry_evaluation:0,
        is_confirm_registrar:"No",
        is_confirm_department:"No",
        is_confirm_teacher:"No"

     }
     console.log(mark);
     LevelBasedProgress.findOne({where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
         if(!marklist){
            LevelBasedProgress.create(mark);
         }
         else{
          var data = marklist.practical_evaluation;;
          if(data == 0){
            data = {};
          }else{
            data = marklist.practical_evaluation;
          }
          data[loid] = parseFloat(evaluation);
            LevelBasedProgress.update({practical_evaluation:data},{where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })
router.post('/savestudentevaluationinternship',ensureAuthenticated,async function(req,res){
    const {pTableData} =req.body ;
  
    const copyItems = [];
  myObj = JSON.parse(pTableData);
  
  for (let i = 0; i < myObj.length; i++) {
    copyItems.push(myObj[i]);
  }
  //console.log(copyItems);
    if(copyItems.length >0)
    {
     // console.log("x");
  copyItems.forEach((item) => {
    var courseid = item.courseid;
    var studentid = item.studentid;
    var evaluation = item.evaluation;
    var level = item.level;
    var programtype = item.programtype;
    var classid = item.classid;
    var dpt = item.department;
    var batchid = item.batchid;
    var loid = item.loid;
      var industry_evaluation = {
    
          };
   industry_evaluation[loid] = parseFloat(evaluation);
     const mark = {
        class_id: classid,
        batch_id: batchid,
        program_type: programtype,
        training_level: level,
        department_id: dpt,
        teacher_id: req.user.userid,
        student_id: studentid,
        course_id:courseid,
        practical_evaluation:0,
        theroretical_evaluation:0,
        industry_evaluation:industry_evaluation,
        is_confirm_registrar:"No",
        is_confirm_department:"No",
        is_confirm_teacher:"No"

     }
     console.log(mark);
     LevelBasedProgress.findOne({where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
         if(!marklist){
            LevelBasedProgress.create(mark);
         }
         else{
           var indeva={}
          var data = marklist.industry_evaluation;;
          if(data == 0){
            indeva = {};
          }else if(data == null){
            indeva ={};
          }else{
            indeva = marklist.industry_evaluation;
          }
          indeva[loid] = parseFloat(evaluation);
            LevelBasedProgress.update({industry_evaluation:indeva},{where:{course_id:courseid,student_id:studentid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}})
         }
     })
  
  });
 
      res.send({message:'success'})
  
    }
    else{
  
      res.send({message:'error'})
  
    }
  
  
  })



router.post('/singlethoreticalevaluation/(:traineeid)',ensureAuthenticated,async function(req,res){
    const{mark,batchid,level,tobeudt,evaluationtype,programtype,courseid,dpt,classid}  = req.body;
    const [courselist, metadata] = await sequelize.query(
      "SELECT * FROM  courses where course_id='"+courseid +"' "
    );   
    console.log(req.body);
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:classid}});
       
     console.log(courseid);
     console.log(classid);
    if(!mark || courseid == "" || evaluationtype=="0" ){
        res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            error_msg:'Please Add  Evaluation Mark And Select Evaluation Type First'
            })
    }
    else
    {  
      var udtqry ;
       if(evaluationtype == "Theoretical"){
          udtqry ="update levelbasedprogresses set theroretical_evaluation = JSON_SET(theroretical_evaluation, '$."+tobeudt+"',"+mark+") where student_id = '"+req.params.traineeid +"' and course_id='"+courseid+"'"
       } else if(evaluationtype == "Technical"){
        udtqry ="update levelbasedprogresses set practical_evaluation = JSON_SET(practical_evaluation, '$."+tobeudt+"',"+mark+") where student_id = '"+req.params.traineeid +"' and course_id='"+courseid+"'"
    
       } else if(evaluationtype == "Industrial"){
        udtqry ="update levelbasedprogresses set industry_evaluation = JSON_SET(industry_evaluation, '$."+tobeudt+"',"+mark+") where student_id = '"+req.params.traineeid +"' and course_id='"+courseid+"'"
    
       } else{

       }    
       const [updateddt, updateddtmeta] = await sequelize.query(udtqry);  

        res.render('alllevelbasedlist',{updateddt:updateddt,courselist:courselist,courseid:courseid,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            success_msg:'Successfully update evaluation marks'
            })
    }
})
router.post('/singlepracticalevaluation/(:traineeid)',ensureAuthenticated,async function(req,res){
    const{thoretical,batchid,level,programtype,courseid,dpt,classid}  = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:classid}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+classid+"' "
      );
  
    if(!thoretical || courseid == "" ){
        res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            error_msg:'Please Add  Evaluation Mark And Select Course Name First'
            })
    }
    else
    {
        const mark = {
            class_id: classid,
            batch_id: batchid,
            program_type: programtype,
            training_level: level,
            department_id: dpt,
            teacher_id: req.user.userid,
            student_id: req.params.traineeid,
            course_id:courseid,
            practical_evaluation:thoretical,
            theroretical_evaluation:0,
            field_evaluation:0,
            is_confirm_registrar:"No",
            is_confirm_department:"No",
            is_confirm_teacher:"No"
    
         }
         StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
            if(!marklist){
                StudentMarkListLevelBased.create(mark).then(marklist =>{
                    res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Add  Practical Evaluation'
                    })
        
                 }).catch(error =>{
                     console.log(error)
                 })
            }
            else{
               StudentMarkListLevelBased.update({practical_evaluation:thoretical},{where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(uddt =>{
                res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Update Practical Evaluation'
                    })
               })
            }
        })
       
    }
})
router.post('/singleinternshipevaluation/(:traineeid)',ensureAuthenticated,async function(req,res){
    const{thoretical,batchid,level,programtype,courseid,dpt,classid}  = req.body;
    const levelbased = await LevelBasedTrainee.findAll({where:{class_id:classid}});
    const [courselist, metadata] = await sequelize.query(
        "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+classid+"' "
      );
  
    if(!thoretical || courseid == "" ){
        res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
            error_msg:'Please Add  Evaluation Mark And Select Course Name First'
            })
    }
    else
    {
        const mark = {
            class_id: classid,
            batch_id: batchid,
            program_type: programtype,
            training_level: level,
            department_id: dpt,
            teacher_id: req.user.userid,
            student_id: req.params.traineeid,
            course_id:courseid,
            practical_evaluation:0,
            theroretical_evaluation:0,
            field_evaluation:thoretical,
            is_confirm_registrar:"No",
            is_confirm_department:"No",
            is_confirm_teacher:"No"
    
         }
         StudentMarkListLevelBased.findOne({where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(marklist =>{
            if(!marklist){
                StudentMarkListLevelBased.create(mark).then(marklist =>{
                    res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Add  Internship Evaluation'
                    })
        
                 }).catch(error =>{
                     console.log(error)
                 })
            }
            else{
               StudentMarkListLevelBased.update({field_evaluation:thoretical},{where:{course_id:courseid,student_id:req.params.traineeid,class_id:classid,teacher_id:req.user.userid,training_level:level,program_type:programtype}}).then(uddt =>{
                res.render('alllevelbasedlist',{courselist:courselist,dpt:dpt,batchid:batchid,levelbased:levelbased,classid:classid,level:level,programtype:programtype,
                    success_msg:'Successfully Update Internship Evaluation'
                    })
               })
            }
        })
       
    }
})


router.post('/updatetraineestatusdropout/(:studentid)',ensureAuthenticated,async function(req,res){
  const {programtype } = req.body;
  const dpt = await Department.findAll({});
  const [absent, absentmeta] = await sequelize.query(
    "SELECT student_id,attendance_date FROM attendances  where student_id='"+req.params.studentid +"' and attendance_type='Absent'"
  );  
  const [present, persentmeta] = await sequelize.query(
    "SELECT student_id,attendance_date FROM attendances  where student_id='"+req.params.studentid +"' and attendance_type='Present'"
  );       
  const [permission, permissionmeta] = await sequelize.query(
    "SELECT student_id,attendance_date FROM attendances  where student_id='"+req.params.studentid +"' and attendance_type='Permission'"
  ); 
  const [lbattendancedata, metaattendace] = await sequelize.query(
    "SELECT student_id,count(student_id) as total,sum(attendance_type='Absent') as absent,sum(attendance_type='Present') as present,sum(attendance_type='Permission')as permission  FROM attendances  where student_id='"+req.params.studentid +"' group by student_id "

  ); 
  if(programtype == "level"){
      
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "update levelbasedtrainees set is_dropout ='Yes' where trainee_id = '"+req.params.studentid+"'"
    );   
      
    res.render('showsinglestudentattendancedetail',{dpt:dpt,studentid:req.params.studentid,present:present,permission:permission,absent:absent,levelbased:levelbased,programtype:programtype , lbattendancedata:lbattendancedata,
      success_msg:'You are Successfully update student status to DROPOUT'})

  }else if(programtype == "ngo"){
  
    const [ngobased, metadatangobased] = await sequelize.query(
      "update ngobasedtrainees set is_dropout ='Yes' where trainee_id = '"+req.params.studentid+"'"
    );   
      
    res.render('showsinglestudentattendancedetail',{dpt:dpt,studentid:req.params.studentid,present:present,permission:permission,absent:absent,levelbased:ngobased,programtype:programtype , lbattendancedata:lbattendancedata,
      success_msg:'You are Successfully update student status to DROPOUT'})

  }else if(programtype == "industry"){
  
    const [industrybased, metadataindustrybased] = await sequelize.query(
      "update industrybasedtrainees set is_dropout ='Yes' where trainee_id = '"+req.params.studentid+"'"

      );   
      
 res.render('showsinglestudentattendancedetail',{dpt:dpt,studentid:req.params.studentid,present:present,permission:permission,absent:absent,levelbased:industrybased,programtype:programtype , lbattendancedata:lbattendancedata,
  success_msg:'You are Successfully update student status to DROPOUT'
})

  } 
})
module.exports = router;

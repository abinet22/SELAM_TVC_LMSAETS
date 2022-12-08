const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const Company = db.companies;
const User = db.users;
const LevelBasedProgress = db.levelbasedprogresses;
const LevelBasedTrainee = db.levelbasedtrainees;
const StudentMarkListLevelBased = db.studentmarklistlevelbaseds;
const sequelize = db.sequelize ;
const Occupation  = db.occupations;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const uploadFile = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/manageevaluation',ensureAuthenticated,async function(req,res){
    const [ngobased, metangobaseddata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
      );
      const [levelbased, metalevelbaseddata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
      );
      const [industrybased, metaindustrybaseddata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
      );
      const department = await Occupation.findAll({});
        res.render('searchevaluation',{
        levelbased:levelbased,
        ngobased:ngobased,
        industrybased:industrybased,
        department:department
    });
});
router.get('/manageprogress',ensureAuthenticated,async function(req,res){
  const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
    );
    const [industrybased, metaindustrybaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
    );
    const department = await Occupation.findAll({});
      res.render('searchprogress',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased,
      department:department
  });
});


router.get('/generateandsubmitgrade',ensureAuthenticated,async function(req,res){
  const [ngobased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
  );
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const [industrybased, metaindustrybaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const department = await Department.findAll({});
    res.render('searchforgrading',{
    levelbased:levelbased,
    ngobased:ngobased,
    industrybased:industrybased,
    department:department
});
})


router.post('/findmyclasstoevaluatecourselevel',ensureAuthenticated,async function(req,res){
    const{batchid,level, dpt,showtype} = req.body;
   
    const [results, metadata] = await sequelize.query(
          "SELECT courseteacherclasses.class_id,classindepts.class_name, batches.batch_name,"+
" occupations.occupation_name,courseteacherclasses.program_type, "+
    " courseteacherclasses.level" +
    " FROM courseteacherclasses INNER JOIN classindepts ON classindepts.class_id = courseteacherclasses.class_id"+
" inner join occupations on occupations.occupation_id=classindepts.department_id  "+
      " inner join batches on classindepts.batch_id = batches.batch_id"+
      " where courseteacherclasses.teacher_id = '"+req.user.userid+"'"+
"  and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.department_id='"+dpt+"' "+
      " and classindepts.training_level='"+level+"'" +
 " group by courseteacherclasses.class_id,classindepts.class_name, batches.batch_name,occupations.occupation_name" +
    "  ,courseteacherclasses.level, courseteacherclasses.program_type" 
    );      
     console.log(results)
    res.render('evaluationclasssearchresult',{classlist:results,batchid:batchid,dpt:dpt,programtag:"level" ,showtype:showtype})
});

router.post('/findmyclasstoevaluatecourseindustry',ensureAuthenticated,async function(req,res){
  const{batchidi, dpti,showtype} = req.body;
 
  const [results, metadata] = await sequelize.query(
    "SELECT courseteacherclasses.class_id,classindepts.class_name, batches.batch_name,"+
" occupations.occupation_name,courseteacherclasses.program_type "+     
" FROM courseteacherclasses INNER JOIN classindepts ON"+
"  classindepts.class_id = courseteacherclasses.class_id inner join"+
"  occupations on occupations.occupation_id=classindepts.department_id" +
 " inner join batches on classindepts.batch_id = batches.batch_id where "+
"  courseteacherclasses.teacher_id = '"+req.user.userid+"' and "+ 
" courseteacherclasses.batch_id='"+batchidi+"' and courseteacherclasses.department_id='"+dpti+"' "+
" group by courseteacherclasses.class_id,classindepts.class_name, batches.batch_name,occupations.occupation_name" +
    "  , courseteacherclasses.program_type" 
   );    
   console.log(results)
  res.render('evaluationclasssearchresult',{classlist:results,batchid:batchidi,dpt:dpti,programtag:"industry",showtype:showtype})
});
router.post('/findmyclasstoevaluatecoursengo',ensureAuthenticated,async function(req,res){
  const{batchidn, dptn,showtype} = req.body;
 
  const [results, metadata] = await sequelize.query(
  "SELECT courseteacherclasses.class_id,classindepts.class_name, batches.batch_name,"+
" occupations.occupation_name,courseteacherclasses.program_type "+      
" FROM courseteacherclasses INNER JOIN classindepts ON "+
" classindepts.class_id = courseteacherclasses.class_id inner join occupations on" + 
"  occupations.occupation_id=classindepts.department_id "+
" inner join batches on classindepts.batch_id = batches.batch_id where "+
"  courseteacherclasses.teacher_id = '"+req.user.userid+"' and"+
"  courseteacherclasses.batch_id='"+batchidn+"' and courseteacherclasses.department_id='"+dptn+"' "+
" group by courseteacherclasses.class_id,classindepts.class_name, batches.batch_name,occupations.occupation_name" +
    "  , courseteacherclasses.program_type" 
  );     
   console.log(results)
  res.render('evaluationclasssearchresult',{classlist:results,batchid:batchidn,dpt:dptn,programtag:"ngo",showtype:showtype})
});

router.post('/showclassevaluation/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
  const [courselist, metadatacourse] = await sequelize.query(
        "SELECT * FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where"+
" courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id = '"+batchid+"'"
      );  
      const [addinfo,addinfometa] = await sequelize.query(
        " select * from classindepts "+
  " inner join batches on batches.batch_id = classindepts.batch_id "+
  " inner join occupations on occupation_id = classindepts.department_id "+
  " inner join departments on departments.department_id = occupations.department_id "+
  " where classindepts.class_id='"+req.params.classname+"'"
      ); 
const [levelbased, metadatalevelbased] = await sequelize.query(
  "select * from levelbasedtrainees inner join studentmarklistlevelbaseds on"+
"  studentmarklistlevelbaseds.student_id = levelbasedtrainees.trainee_id"+
"  where levelbasedtrainees.class_id = '"+ req.params.classname +"' and"+
" levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id and "+
" studentmarklistlevelbaseds.teacher_id = '"+req.user.userid+"' and "+
" studentmarklistlevelbaseds.department_id = '"+dpt+"'"

);       
res.render('showclassevaluation',{ coursename:'',addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype,programtag:"level"})

});
router.post('/showclassevaluationngo/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
const [courselist, metadata] = await sequelize.query(
    "SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
    "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
  );
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from ngobasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = ngobasedtrainees.class_id where ngobasedtrainees.class_id = '"+ req.params.classname +"' and ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id"
  );   
  const [addinfo,addinfometa] = await sequelize.query(
    " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
  );   
  res.render('showclassevaluation',{coursename:'',addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype,programtag:"ngo"})

});
router.post('/showclassevaluationindustry/(:classname)',ensureAuthenticated,async function(req,res){

  const{level,programtype,dpt,batchid} = req.body;
  const [courselist, metadata] = await sequelize.query(
      "SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
      "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
    );
    const [addinfo,addinfometa] = await sequelize.query(
      " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
    ); 
    const [levelbased, metadatalevelbased] = await sequelize.query(
      "select * from industrybasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = industrybasedtrainees.class_id where industrybasedtrainees.class_id = '"+ req.params.classname +"' and industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id"
    );   
    console.log("yyyyyyyyyyyyyyyyyyyyyyyy")  
    console.log(levelbased)
    console.log(courselist)
    res.render('showclassevaluation',{coursename:'',addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype,programtag:"industry"})

  });


router.post('/showclassprogress/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
  const [courselist, metadatacourse] = await sequelize.query(
        "SELECT * FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where"+
" courseteacherclasses.teacher_id = '"+req.user.userid+"'"
      );  
      const [addinfo,addinfometa] = await sequelize.query(
        " select * from classindepts "+
  " inner join batches on batches.batch_id = classindepts.batch_id "+
  " inner join occupations on occupation_id = classindepts.department_id "+
  " inner join departments on departments.department_id = occupations.department_id "+
  " where classindepts.class_id='"+req.params.classname+"'"
      ); 
const [levelbased, metadatalevelbased] = await sequelize.query(
"select * from levelbasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = levelbasedtrainees.class_id where levelbasedtrainees.class_id = '"+ req.params.classname +"' and levelbasedtrainees.trainee_id = levelbasedprogresses.student_id"
);     
res.render('showclassprogress',{coursename:'',addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,
courselist:courselist,classid:req.params.classname,level:level,programtype:programtype,programtag:"level"})

})
router.post('/showclassprogressngo/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
const [courselist, metadata] = await sequelize.query(
  "SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
  "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
);
const [addinfo,addinfometa] = await sequelize.query(
  " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
); 
const [levelbased, metadatalevelbased] = await sequelize.query(
  "select * from ngobasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = ngobasedtrainees.class_id where ngobasedtrainees.class_id = '"+ req.params.classname +"' and ngobasedtrainees.trainee_id = levelbasedprogresses.student_id"
);     
res.render('showclassprogress',{coursename:'',addinfo:addinfo, dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,
classid:req.params.classname,level:level,programtype:programtype,programtag:"ngo"})

})
router.post('/showclassprogressindustry/(:classname)',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid} = req.body;
const [courselist, metadata] = await sequelize.query(
    "SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
    "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.class_id='"+req.params.classname+"' "
  );
  const [addinfo,addinfometa] = await sequelize.query(
    " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+req.params.classname+"'"
  ); 
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from industrybasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = industrybasedtrainees.class_id where industrybasedtrainees.class_id = '"+ req.params.classname +"' and industrybasedtrainees.trainee_id = levelbasedprogresses.student_id"
  );     
  res.render('showclassprogress',{coursename:'',addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:req.params.classname,level:level,programtype:programtype,programtag:"industry"})

})

router.post('/filterevaluationbycoursename',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid,courseid,classid,programtag} = req.body;
const [addinfo,addinfometa] = await sequelize.query(
  " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+classid+"'"
);  
const  coursename = await Course.findOne({where:{course_id:courseid}});
if(programtag =="level"){
 const [courselist, metadatacourse] = await sequelize.query(
        "SELECT * FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where"+
" courseteacherclasses.teacher_id = '"+req.user.userid+"'"
      );  
const [levelbased, metadatalevelbased] = await sequelize.query(
  "select * from levelbasedtrainees inner join studentmarklistlevelbaseds on"+
"  studentmarklistlevelbaseds.student_id = levelbasedtrainees.trainee_id"+
"  where levelbasedtrainees.class_id = '"+ classid +"' and"+
" levelbasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id and "+
" studentmarklistlevelbaseds.teacher_id = '"+req.user.userid+"' and "+
" studentmarklistlevelbaseds.department_id = '"+dpt+"' and"+
" studentmarklistlevelbaseds.course_id = '"+courseid+"' "

);  

  res.render('showclassevaluation',{coursename:coursename,addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:classid,programtag:programtag})
  
}else if(programtag =="ngo"){
  const [courselist, metadata] = await sequelize.query(
    "SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
    "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"'  and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.course_id='"+courseid+"' and courseteacherclasses.class_id='"+classid+"' "
  );
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from ngobasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = ngobasedtrainees.class_id where studentmarklistlevelbaseds.course_id='"+courseid+"' and ngobasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "
  );     
  res.render('showclassevaluation',{coursename:coursename,addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:classid,programtag:programtag})
  
}else if(programtag =="industry"){
  const [courselist, metadata] = await sequelize.query(
    "SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
    "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"'  and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.course_id='"+courseid+"' and courseteacherclasses.class_id='"+classid+"' "
  );
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from industrybasedtrainees inner join studentmarklistlevelbaseds on studentmarklistlevelbaseds.class_id = industrybasedtrainees.class_id where studentmarklistlevelbaseds.course_id='"+courseid+"' and industrybasedtrainees.trainee_id = studentmarklistlevelbaseds.student_id "
  );     
  res.render('showclassevaluation',{coursename:coursename,addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:classid,programtag:programtag})
  
}

})
router.post('/filterprogressbycoursename',ensureAuthenticated,async function(req,res){

const{level,programtype,dpt,batchid,courseid,classid ,programtag} = req.body;
const [addinfo,addinfometa] = await sequelize.query(
  " select * from classindepts "+
" inner join batches on batches.batch_id = classindepts.batch_id "+
" inner join occupations on occupation_id = classindepts.department_id "+
" inner join departments on departments.department_id = occupations.department_id "+
" where classindepts.class_id='"+classid+"'"
);  
const  coursename = await Course.findOne({where:{course_id:courseid}});
if(programtag =="level"){
    const [courselist, metadatacourse] = await sequelize.query(
        "SELECT * FROM  courseteacherclasses "+
        "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where"+
" courseteacherclasses.teacher_id = '"+req.user.userid+"'"
      );  
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from levelbasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = levelbasedtrainees.class_id where levelbasedprogresses.course_id='"+courseid+"' and levelbasedtrainees.trainee_id = levelbasedprogresses.student_id "
  );   
  res.render('showclassprogress',{ coursename:coursename, addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:classid,level:level,programtag:programtag})

}else if(programtag =="ngo"){
  const [courselist, metadata] = await sequelize.query(
    "SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
    "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"'  and courseteacherclasses.department_id='"+dpt+"'  and courseteacherclasses.class_id='"+classid+"' "
  );
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from ngobasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = ngobasedtrainees.class_id where levelbasedprogresses.course_id='"+courseid+"' and ngobasedtrainees.trainee_id = levelbasedprogresses.student_id "
  );     
  res.render('showclassprogress',{ coursename:coursename, addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:classid,level:level,programtag:programtag})

}else if(programtag =="industry"){
  const [courselist, metadata] = await sequelize.query(
    "SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
    "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"'  and courseteacherclasses.department_id='"+dpt+"'  and courseteacherclasses.class_id='"+classid+"' "
  );
  const [levelbased, metadatalevelbased] = await sequelize.query(
    "select * from industrybasedtrainees inner join levelbasedprogresses on levelbasedprogresses.class_id = industrybasedtrainees.class_id where levelbasedprogresses.course_id='"+courseid+"' and industrybasedtrainees.trainee_id = levelbasedprogresses.student_id "
  );     
  res.render('showclassprogress',{ coursename:coursename, addinfo:addinfo,dpt:dpt,batchid:batchid,levelbased:levelbased,courselist:courselist,classid:classid,level:level,programtag:programtag})

}

})


router.post('/sendgradereporttodepartment',ensureAuthenticated,async function(req,res){
  const {pTableData} =req.body ;
  let errors =[];
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
  var institutional_total= item.industry_total;
  var industry_total =item.industry_total;
  var total_result= item.total_result;
 var  grade_in_latter=item.grade_in_latter;
 var  grade_in_point=item.grade_in_point;
 var student_id=item.student_id;
  var course_id=item.course_id;
  if(!institutional_total || !industry_total || !total_result || !grade_in_latter || !grade_in_point || !student_id || !course_id){
   errors.push({msg:'please make sure your mark list is correct'})
  }
 else{
  const graderpt ={
    batch_id:item.batch_id,
    program_type:item.program_type,
    training_level:item.training_level,
    department_id:item.department_id,
    class_id:item.class_id,
    student_id:item.student_id,
    course_id:item.course_id,
    institutional_total:item.industry_total,
    industry_total:item.industry_total,
    total_result:item.total_result,
    grade_in_latter:item.grade_in_latter,
    grade_in_point:item.grade_in_point,
    is_confirm_registrar:"No",
    is_confirm_department:"No",
    is_confirm_teacher:"Yes",
    teacher_id:req.user.userid
 }
 StudentMarkListLevelBased.findOne({where:{student_id:item.student_id,course_id:item.course_id,class_id:item.class_id}}).then(student =>{
 if(!student){
   StudentMarkListLevelBased.create(graderpt);
   LevelBasedProgress.update({ is_confirm_teacher:"Yes"},{where:{student_id:item.student_id, department_id:item.department_id,
    class_id:item.class_id,course_id:item.course_id}}) 
 }
 StudentMarkListLevelBased.update({ batch_id:item.batch_id,
   program_type:item.program_type,
   training_level:item.training_level,
   department_id:item.department_id,
   class_id:item.class_id,
   student_id:item.student_id,
   course_id:item.course_id,
   institutional_total:item.industry_total,
   industry_total:item.industry_total,
   total_result:item.total_result,
   grade_in_latter:item.grade_in_latter,
   grade_in_point:item.grade_in_point,
   is_confirm_registrar:"No",
   is_confirm_department:"No",
   is_confirm_teacher:"Yes",
   teacher_id:req.user.userid},{where:{student_id:item.student_id,course_id:item.course_id, department_id:item.department_id,
    class_id:item.class_id}}) 
    LevelBasedProgress.update({is_confirm_teacher:"Yes"},{where:{student_id:item.student_id, department_id:item.department_id,
      class_id:item.class_id,course_id:item.course_id}}) 
 }).catch(error =>{
  errors.push({msg:'please makesure your mark list is correct'})
  console.log(error)
 })
 }
    

});

  if(errors.length >0){

    res.send({message:'error'})
  }else{
    res.send({message:'success'})
  }
  

  }
  else{

    res.send({message:'error'})

  }

})
module.exports = router;

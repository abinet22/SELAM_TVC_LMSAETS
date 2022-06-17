const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const Course = db.courses;
const Batch = db.batches;
const IndustryCourse = db.industrycourses;
const NGOCourse = db.ngocourses;
const User = db.users;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/addnewcourse', ensureAuthenticated,async function (req, res) 
{
const department = await Department.findAll({});
const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
const [course1, metadata] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1'"
);
const [course2, metadata2] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2'"
);
const [course3, metadata3] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3'"
);
const [course4, metadata4] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4'"
);
    res.render('addnewcourse',{
        department:department,
        batchngo:batchngo,
        batchindustry:batchindustry,
        course1:course1,
        course2:course2,
        course3:course3,
        course4:course4,
    });

});
router.get('/allcourselist', ensureAuthenticated, async function (req, res) {

  
  const [course1, metadata] = await sequelize.query(
    "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1'"
  );
  const [course2, metadata2] = await sequelize.query(
    "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2'"
  );
  const [course3, metadata3] = await sequelize.query(
    "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3'"
  );
  const [course4, metadata4] = await sequelize.query(
    "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4'"
  );
  const [course5, metadata5] = await sequelize.query(
    "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_5'"
  );

  const department = await Department.findAll({});
   
   res.render('allcourselist',{
    department:department,     
    course1:course1,
    course2:course2,
    course3:course3,
    course4:course4,
    course5:course5,
   
 })
 
 
 });
 router.post('/filterbydepartment', ensureAuthenticated, async function (req, res) {

    const {dept,semister} = req.body;
  
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1' and courses.department_id ='"+dept+"' and courses.semister='"+semister+"'"
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2' and courses.department_id ='"+dept+"' and courses.semister='"+semister+"'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3' and courses.department_id ='"+dept+"' and courses.semister='"+semister+"'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4' and courses.department_id ='"+dept+"' and courses.semister='"+semister+"'"
    );
    const [course5, metadata5] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_5' and courses.department_id ='"+dept+"' and courses.semister='"+semister+"'"
    );
    const [ngo, metadatango] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where  courses.department_id ='"+dept+"' and courses.semister='"+semister+"' and courses.program_type ='NGO_Based'"
    );
    const [industry, metadataindu] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where courses.department_id ='"+dept+"' and courses.semister='"+semister+"' and courses.program_type ='Industry_Based'"
    );
    const department = await Department.findAll({});
     
     res.render('allcourselist',{
      department:department,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      ngo:ngo,
      industry:industry
   })
   
   
   });
router.post('/addnewcourse', ensureAuthenticated, async function(req, res) 
{
    const{deptname,coursecode,traininghours,coursename,nolos,traininglevel,lodata,semister,programtype} = req.body;
    let error = [];
    const department = await Department.findAll({});
    const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
    const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1'"
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4'"
    );

   if(!coursecode || !deptname ||!traininghours || !coursename  ){
        error.push({msg:'Please add all required fields'})
   }
   else if(deptname == "0" ){
    error.push({msg:'Please select name of department name'})
   }
   if(error.length >0){

    res.render('addnewcourse',{
      department:department,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      error_msg:'Please insert all the required fields',
  });
   }
   else{
       Course.findOne({where:{
        course_name:coursename,
        department_name:deptname,
        training_level:traininglevel
       }}).then(courses =>{
           if(courses)
           {
            res.render('addnewcourse',{
              department:department,
              batchngo:batchngo,
              batchindustry:batchindustry,
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              error_msg:'This course name  is already registered please try later'
          });
         
           }
           else
           {
            const v1options = {
                node: [0x01, 0x23],
                clockseq: 0x1234,
                msecs: new Date('2011-11-01').getTime(),
                nsecs: 5678,
              };
              courseid = uuidv4(v1options);
        const courseData ={
           
            course_id:courseid,
            department_name:deptname,
            course_code:coursecode,
            course_name:coursename,
            department_id:deptname,
            training_hours:traininghours,
            training_level:traininglevel,
            semister:semister,
            program_type:programtype,
            learning_obj:JSON.parse(lodata),
            nooflo:nolos
        }

        Course.create(courseData).then(coursesdt =>{
          res.render('addnewcourse',{
            department:department,
            batchngo:batchngo,
            batchindustry:batchindustry,
            course1:course1,
            course2:course2,
            course3:course3,
            course4:course4,
            success_msg:'Your are successfully registered new course for this department and level'
          
        });
         
        }).catch(error =>{
          console.log(error)
          res.render('addnewcourse',{
            department:department,
            batchngo:batchngo,
            batchindustry:batchindustry,
            course1:course1,
            course2:course2,
            course3:course3,
            course4:course4,
            error_msg:'Something is wrong while saving data please try later'
           
        });
          
        })


           }
       }).catch(error =>{
           console.log(error)
           res.render('addnewcourse',{
            department:department,
            batchngo:batchngo,
            batchindustry:batchindustry,
            course1:course1,
            course2:course2,
            course3:course3,
            course4:course4,
            error_msg:'Something is wrong while saving data please try later'
           
        });
       })
   }
   
   
});

router.post('/addnewcoursengo', ensureAuthenticated, async function(req, res) 
{
    const{batch,level1,level2,level3,level4} = req.body;
    let error = [];
    const department = await Department.findAll({});
    const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
    const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1'"
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4'"
    );
   if(batch == "0" ){
    error.push({msg:'Please select name of batch name'})
   }
 
   if(error.length >0){
    res.render('addnewcourse',{
      department:department,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      error_msg:'Please select all required fields'
     
  });
   }
   else{
    var leveld = [];
    var typed = [];
    var named = [];
    var levels = [];
    var types;
    var names;
    if(Array.isArray(level1))
    {
      levels=  JSON.stringify(level1);
      console.log("array",levels);
    }
    else
    {
      leveld.push(level1);
      levels= JSON.stringify(leveld);
      
      console.log("notarray",levels);
    }
   
     var courselist =[];
    courselist  =  JSON.parse(levels);

      for(var j =0 ; j< courselist.length ;j++) { 
    var courseid = courselist[j] 
    Course.findOne({where:{course_id:courseid}}).then(course =>{
      if(!course){

      }
      const courseData ={
        batch_id:batch,
      course_id: course.course_id,
      course_name: course.course_name,
      course_code: course.course_code,
      department_id: course.department_id,
      department_name:course.department_name,
      training_hours:course.training_hours,
      training_level:course.training_level,
      semister:course.semister,
      nooflo:course.nooflo,
      learning_obj:course.learning_obj,
      }
       console.log(courseData)
       NGOCourse.create(courseData)
  
       }).catch(error =>{
  
       })
    } 
   
       res.render('addnewcourse',{
      department:department,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      success_msg:'Successfully create courses for this batch ngo based program trainees'})
     
   
    
     

     

   }
   
   
});
router.post('/addnewcourseindustry', ensureAuthenticated, async function(req, res) 
{
    const{batch,level1,level2,level3,level4} = req.body;
    let error = [];
    const department = await Department.findAll({});
    const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
    const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1'"
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4'"
    );
   if(batch == "0" ){
    error.push({msg:'Please select name of batch name'})
   }
 
   if(error.length >0){
    res.render('addnewcourse',{
      department:department,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      error_msg:'Please select all required fields'
     
  });
   }
   else{
    var leveld = [];
    var typed = [];
    var named = [];
    var levels = [];
    var types;
    var names;
    if(Array.isArray(level1))
    {
      levels=  JSON.stringify(level1);
      console.log("array",levels);
    }
    else
    {
      leveld.push(level1);
      levels= JSON.stringify(leveld);
      
      console.log("notarray",levels);
    }
   
     var courselist =[];
    courselist  =  JSON.parse(levels);

      for(var j =0 ; j< courselist.length ;j++) { 
    var courseid = courselist[j] 
    Course.findOne({where:{course_id:courseid}}).then(course =>{
      if(!course){

      }
      const courseData ={
        batch_id:batch,
      course_id: course.course_id,
      course_name: course.course_name,
      course_code: course.course_code,
      department_id: course.department_id,
      department_name:course.department_name,
      training_hours:course.training_hours,
      training_level:course.training_level,
      semister:course.semister,
      nooflo:course.nooflo,
      learning_obj:course.learning_obj,
      }
       console.log(courseData)
       IndustryCourse.create(courseData)
  
       }).catch(error =>{
  
       })
    } 
   
       res.render('addnewcourse',{
      department:department,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      success_msg:'Successfully create courses for this batch industry based program trainees'})
     
   
    
     

     

   }
   
   
});

module.exports = router;
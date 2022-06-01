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
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addnewcourse', ensureAuthenticated,async function (req, res) 
{
const department = await Department.findAll({});
    res.render('addnewcourse',{
        department:department
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
    course5:course5
 })
 
 
 });
 router.post('/filterbydepartment', ensureAuthenticated, async function (req, res) {

    const {dept} = req.body;
  
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_1' and courses.department_id ='"+dept+"'"
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_2' and courses.department_id ='"+dept+"'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_3' and courses.department_id ='"+dept+"'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_4' and courses.department_id ='"+dept+"'"
    );
    const [course5, metadata5] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN departments ON departments.department_id = courses.department_id where training_level='Level_5' and courses.department_id ='"+dept+"'"
    );
    const department = await Department.findAll({});
     
     res.render('allcourselist',{
      department:department,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5
   })
   
   
   });
router.post('/addnewcourse', ensureAuthenticated, async function(req, res) 
{
    const{deptname,coursecode,traininghours,coursename,traininglevel} = req.body;
    let error = [];
    const department = await Department.findAll({});


   if(!coursecode || !deptname ||!traininghours || !coursename || !traininglevel ){
        error.push({msg:'Please add all required fields'})
   }
   else if(deptname == "0" || traininglevel=="0"){
    error.push({msg:'Please select name of department name'})
   }
   if(error.length >0){
    res.render('addnewcourse',{
        error_msg:'Please insert all the required fields',
        department:department
    })
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
                error_msg:'This course name  is already registered please try later'
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
              courseid = uuidv4(v1options);
        const courseData ={
           
            course_id:courseid,
            department_name:deptname,
            course_code:coursecode,
            course_name:coursename,
            department_id:deptname,
            training_hours:traininghours,
            training_level:traininglevel
        }

        Course.create(courseData).then(coursesdt =>{

            res.render('addnewcourse',{  department:department,

                success_msg:'Your are successfully registered new course for this department and level'
            })
        }).catch(error =>{
            res.render('addnewcourse',{
                department:department,
                error_msg:'Something is wrong while saving data please try later'
            })
        })


           }
       }).catch(error =>{
           console.log(error)
        res.render('addnewcourse',{
            department:department,
            error_msg:'Something is wrong please try later'
        })
       })
   }
   
   
});


module.exports = router;
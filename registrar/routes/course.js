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
const Occupation = db.occupations;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get('/allcourselist', ensureAuthenticated, async function (req, res) {

  
  const [course1, metadata] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_1'"
  );
  const [course2, metadata2] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
  );
  const [course3, metadata3] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
  );
  const [course4, metadata4] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
  );
  const [course5, metadata5] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_5'"
  );

  const occupation = await Occupation.findAll({});
   
   res.render('allcourselist',{
    department:occupation,     
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
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_1' and courses.department_id ='"+dept+"' "
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2' and courses.department_id ='"+dept+"' "
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3' and courses.department_id ='"+dept+"' "
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4' and courses.department_id ='"+dept+"' "
    );
    const [course5, metadata5] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name  FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_5' and courses.department_id ='"+dept+"' "
    );
    const [ngo, metadatango] = await sequelize.query(
      "SELECT * FROM ngocourses INNER JOIN occupations ON occupations.occupation_id = ngocourses.department_id where  ngocourses.department_id ='"+dept+"' "
    );
    const [industry, metadataindu] = await sequelize.query(
      "SELECT * FROM industrycourses INNER JOIN occupations ON occupations.occupation_id = industrycourses.department_id where industrycourses.department_id ='"+dept+"'"
    );
    const occupation = await Occupation.findAll({});
     
     res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      ngo:ngo,
      industry:industry
   })
   
   
   });
router.get('/uoctrainerlist',ensureAuthenticated,async function(req,res){
    const [courseclassteacher,courseclassteachermeta] =await sequelize.query(
       " SELECT * from courseteacherclasses "+
"inner join occupations on courseteacherclasses.department_id = occupations.occupation_id "+
"inner join departments on occupations.department_id = departments.department_id "+
"inner join batches on batches.batch_id = courseteacherclasses.batch_id "+
"inner join courses on courses.course_id = courseteacherclasses.course_id "+
"inner join classindepts on classindepts.class_id = courseteacherclasses.class_id "+
"inner join stafflists on stafflists.staff_id = courseteacherclasses.teacher_id "
    )
    res.render('allteachercourselist',{
        
        courseclassteacher:courseclassteacher
     })
     
})
module.exports = router;

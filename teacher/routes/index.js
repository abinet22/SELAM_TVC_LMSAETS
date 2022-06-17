const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const AppSelectionCriteria = db.appselectioncriterias;
const FunderInfo = db.funderinfo;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard'));
router.get('/report',ensureAuthenticated,async function(req,res){
  const [ngobased, metangobaseddata] = await sequelize.query(
      "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
    );
    const [levelbased, metalevelbaseddata] = await sequelize.query(
      "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
    );
    const [industrybased, metaindustrybaseddata] = await sequelize.query(
      "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
    );
    const [classlistl, metalclassl] = await sequelize.query(
      "SELECT * FROM classindepts INNER JOIN courseteacherclasses ON courseteacherclasses.class_id = classindepts.class_id inner join levelbasedprograms on classindepts.batch_id = levelbasedprograms.batch_id "+
      " where courseteacherclasses.teacher_id = '"+req.user.userid+"'"
     
      );
      const [classlistn, metalclassn] = await sequelize.query(
        "SELECT * FROM classindepts INNER JOIN courseteacherclasses ON courseteacherclasses.class_id = classindepts.class_id inner join ngobasedprograms on classindepts.batch_id = ngobasedprograms.batch_id"+
        " where courseteacherclasses.teacher_id = '"+req.user.userid+"'"
        );
        const [classlisti, metalclassi] = await sequelize.query(
          "SELECT * FROM classindepts INNER JOIN courseteacherclasses ON courseteacherclasses.class_id = classindepts.class_id inner join industrybasedprograms on classindepts.batch_id = industrybasedprograms.batch_id"+
          " where courseteacherclasses.teacher_id = '"+req.user.userid+"'"
          );
      res.render('report',{
      levelbased:levelbased,
      ngobased:ngobased,
      industrybased:industrybased,
      classlisti:classlisti,
      classlistl:classlistl,
      classlistn:classlistn
  });
});
router.post('/reportlevel', ensureAuthenticated,async function (req, res) 
{ 
  const [classlistl, metalclassl] = await sequelize.query(
    "SELECT * FROM classindepts INNER JOIN courseteacherclasses ON courseteacherclasses.class_id = classindepts.class_id inner join levelbasedprograms on classindepts.batch_id = levelbasedprograms.batch_id "+
    " where courseteacherclasses.teacher_id = '"+req.user.userid+"'"
   
    );
  
  res.render('reportlevel')

});
router.post('/reportngo', ensureAuthenticated,async function (req, res) 
{ 
  
  res.render('reportngo')

});
router.post('/reportindustry', ensureAuthenticated,async function (req, res) 
{ 
  const{classid,batchid} = req.body;
  const [industryprogress, metalclassl] = await sequelize.query(
    "SELECT * FROM levelbasedprogresses INNER JOIN courseteacherclasses ON courseteacherclasses.class_id = levelbasedprogresses.class_id "+
    " where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.class_id = '"+ classid+"' and courseteacherclasses.batch_id = '"+batchid+"' "+
    " and courseteacherclasses.course_id= levelbasedprogresses.course_id "
   
    );
    console.log(industryprogress)
  res.render('reportindustry',{
     industryevaluation:industryprogress
  })

});
router.get('/statistics', ensureAuthenticated,async function (req, res) 
{ 
  const [ngobased, metangobaseddata] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id"
  );
  // const [courselist, metadata] = await sequelize.query(
  //   "SELECT courses.course_name,courses.course_id FROM  courseteacherclasses "+
  //   "INNER JOIN courses ON courses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"' and courseteacherclasses.level= '"+level+"' and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.course_id='"+courseid+"' and courseteacherclasses.class_id='"+classid+"' "
  // );
  // const [courselistngo, metadatango] = await sequelize.query(
  //   "SELECT ngocourses.course_name,ngocourses.course_id FROM  courseteacherclasses "+
  //   "INNER JOIN ngocourses ON ngocourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"'  and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.course_id='"+courseid+"' and courseteacherclasses.class_id='"+classid+"' "
  // );
  // const [courselistind, metadataind] = await sequelize.query(
  //   "SELECT industrycourses.course_name,industrycourses.course_id FROM  courseteacherclasses "+
  //   "INNER JOIN industrycourses ON industrycourses.course_id = courseteacherclasses.course_id where courseteacherclasses.teacher_id = '"+req.user.userid+"' and courseteacherclasses.batch_id='"+batchid+"'  and courseteacherclasses.department_id='"+dpt+"' and courseteacherclasses.course_id='"+courseid+"' and courseteacherclasses.class_id='"+classid+"' "
  // );
  const [levelbased, metalevelbaseddata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id"
  );
  const [industrybased, metaindustrybaseddata] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id"
  );
    res.render('statistics',{
    levelbased:levelbased,
    ngobased:ngobased,
    industrybased:industrybased
});

});
router.post('/showstatistics', ensureAuthenticated,async function (req, res) 
{ 
  const{batchid} = req.body;
  const [classwithevluation, classevalmeta] = await sequelize.query(
    "SELECT classindepts.class_name,sum(total_result) as total,count(student_id) as totalstudent FROM studentmarklistlevelbaseds inner join classindepts on classindepts.class_id=studentmarklistlevelbaseds.class_id where studentmarklistlevelbaseds.batch_id ='"+batchid+"' group by classindepts.class_name  "
  );
  const [classattendance,attendancemeta] = await sequelize.query(
    "SELECT classindepts.class_name,sum(attendance_type='Absent') as absent,sum(attendance_type='Present') as present,sum(attendance_type='Permission')as permission  FROM attendances inner join classindepts on classindepts.class_id = attendances.class_id where attendances.batch_id ='"+batchid+"'  group by classindepts.class_name "

  );
  console.log(classwithevluation)
  res.render('showstatistics',
  {classwithevluation:classwithevluation,classattendance:classattendance})

});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});
router.get('/notifications',async function(req, res)  {
  res.render('notificationlist')
});

module.exports = router;
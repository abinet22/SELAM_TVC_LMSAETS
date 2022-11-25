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


router.get('/addnewcourse', ensureAuthenticated,async function (req, res) 
{
const occupation = await Occupation.findAll({});
const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
const [course1, metadata] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id"
);
const [course2, metadata2] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
);
const [course3, metadata3] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
);
const [course4, metadata4] = await sequelize.query(
  "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
);
    res.render('addnewcourse',{
      department:occupation,
        batchngo:batchngo,
        batchindustry:batchindustry,
        course1:course1,
        course2:course2,
        course3:course3,
        course4:course4,
    });

});

router.post('/deletecourseinfo/(:courseid)', ensureAuthenticated, async function(req, res) 
{
  
  let errors =[];
 
  const [course1, metadata] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_1'"
  );
  const [course2, metadata2] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
  );
  const [course3, metadata3] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
  );
  const [course4, metadata4] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
  );
  const [course5, metadata5] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_5'"
  );
  const occupation = await Occupation.findAll({});
  if(errors.length >0){
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:errors
     
   })
  }else{

    Course.findOne({where:{course_id:req.params.courseid}}).then(occ =>{
      if(!occ){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Cant Find UOC With This ID"
         
       })
      }
      else{
        
          Course.destroy({where:{course_id:req.params.courseid}}).then( occ =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              success_msg:"You Are Deleting UOC  Info Successfully"
             
           })
          
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating UOCs Los"
             
           })
          })
      }
  }).catch(err =>{
    console.log(err)
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:"Error While Updating UOCs LOs Info Please Try Later"
     
   })
  })
  }
});
router.post('/removeupdateucs/(:courseid)', ensureAuthenticated, async function(req, res) 
{
  const{loselect} =req.body;
  let errors =[];
  if(loselect ==0){
    errors.push("Please Select Los First");
  }
  const [course1, metadata] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_1'"
  );
  const [course2, metadata2] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
  );
  const [course3, metadata3] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
  );
  const [course4, metadata4] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
  );
  const [course5, metadata5] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_5'"
  );
  const occupation = await Occupation.findAll({});
  if(errors.length >0){
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:errors
     
   })
  }else{

    Course.findOne({where:{course_id:req.params.courseid}}).then(occ =>{
      if(!occ){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Cant Find UOC With This ID"
         
       })
      }
      else{
        var data = occ.learning_obj;
        console.log(data)
        if(data == 0){
          data = {};
        }else{
          data = occ.learning_obj;
        }
        delete data[loselect];
        console.log("updateeeeeeeeeeeeeee")
        var keyCount  = Object.keys(data).length;
        console.log(data)
          Course.update({learning_obj:data},{where:{course_id:req.params.courseid}}).then( occ =>{
            Course.update({nooflo:keyCount},{where:{course_id:req.params.courseid}}).then(()=>{
              res.render('allcourselist',{
                department:occupation,     
                course1:course1,
                course2:course2,
                course3:course3,
                course4:course4,
                course5:course5,
                success_msg:"You Are Update UOC LOs Info Successfully"
               
             })
            })
          
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating UOCs Los"
             
           })
          })
      }
  }).catch(err =>{
    console.log(err)
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:"Error While Updating UOCs LOs Info Please Try Later"
     
   })
  })
  }
});

router.post('/updateucs/(:courseid)', ensureAuthenticated, async function(req, res) 
{
  const{loselect,loupdateinfo} =req.body;
  let errors =[];
  if(loselect ==0){
    errors.push("Please Select Los First");
  }
  if(!loupdateinfo){
    errors.push("Please Insert Los name First");
  }
  const [course1, metadata] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_1'"
  );
  const [course2, metadata2] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
  );
  const [course3, metadata3] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
  );
  const [course4, metadata4] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
  );
  const [course5, metadata5] = await sequelize.query(
    "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_5'"
  );
  const occupation = await Occupation.findAll({});
  if(errors.length >0){
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:errors
     
   })
  }else{
    Course.findOne({where:{course_id:req.params.courseid}}).then(occ =>{
      if(!occ){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Cant Find UOC With This ID"
         
       })
      }
      else{
        var data = occ.learning_obj;
        if(data == 0){
          data = {};
        }else{
          data = occ.learning_obj;
        }
        data[loselect] = loupdateinfo;
        console.log("daaaaaaaaaaaaaaaaaaaaa")
        console.log(data);
          Course.update({learning_obj:data},{where:{course_id:req.params.courseid}}).then( occ =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              success_msg:"You Are Update UOC LOs Info Successfully"
             
           })
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating UOCs Los"
             
           })
          })
      }
  }).catch(err =>{
    console.log(err)
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:"Error While Updating UOCs LOs Info Please Try Later"
     
   })
  })
  }

});

router.post('/updatecourseinfo/(:courseid)', ensureAuthenticated, async function(req, res) 
{
    const {updateinfo,updatetype} = req.body;
    const [course1, metadata] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_1'"
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
    );
    const [course5, metadata5] = await sequelize.query(
      "SELECT courses.*,occupations.training_cost as cost,occupations.occupation_name FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_5'"
    );
    const occupation = await Occupation.findAll({});
   
   if(updatetype ==0 ){
    res.render('allcourselist',{
      department:occupation,     
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      course5:course5,
      error_msg:"Please Select  Update Type First!"
     
   })
   }
   else{
     if(updatetype ==1 ){
      if(!updateinfo){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Please Insert New UOC Name First!"
         
       })
          
      }
      else{
          Course.findAll({where:{course_id:req.params.courseid}}).then(occ =>{
              if(!occ){
                res.render('allcourselist',{
                  department:occupation,     
                  course1:course1,
                  course2:course2,
                  course3:course3,
                  course4:course4,
                  course5:course5,
                  error_msg:"Cant Find UOC With This ID"
                 
               })
              }
              else{
                  Course.update({course_name:updateinfo},{where:{course_id:req.params.courseid}}).then( occ =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      success_msg:"You Are Update UOC  Name Info Successfully"
                     
                   })
                  }).catch(err =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      error_msg:"Error While Updating Course Info"
                     
                   })
                  })
              }
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating Course Info Please Try Later"
             
           })
          })
      }
     }else if(updatetype ==2){
      if(!updateinfo){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Please Insert New  UOC Module Code First!"
         
       })
          
      }
      else{
          Course.findAll({where:{course_id:req.params.courseid}}).then(occ =>{
              if(!occ){
                res.render('allcourselist',{
                  department:occupation,     
                  course1:course1,
                  course2:course2,
                  course3:course3,
                  course4:course4,
                  course5:course5,
                  error_msg:"Cant Find UOC With This ID"
                 
               })
              }
              else{
                  Course.update({course_code:updateinfo},{where:{course_id:req.params.courseid}}).then( occ =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      success_msg:"You Are Update UOC Module Code Info Successfully"
                     
                   })
                  }).catch(err =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      error_msg:"Error While Updating Course Info"
                     
                   })
                  })
              }
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating Course Info Please Try Later"
             
           })
          })
      }
     }else if(updatetype ==3){
      if(!updateinfo || isNaN(updateinfo)){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Please Insert New  UOC Hour First!"
         
       })
          
      }
      else{
          Course.findAll({where:{course_id:req.params.courseid}}).then(occ =>{
              if(!occ){
                res.render('allcourselist',{
                  department:occupation,     
                  course1:course1,
                  course2:course2,
                  course3:course3,
                  course4:course4,
                  course5:course5,
                  error_msg:"Cant Find UOC With This ID"
                 
               })
              }
              else{
                  Course.update({training_hours:updateinfo},{where:{course_id:req.params.courseid}}).then( occ =>{
                    console.log("updaaaaaaaaaaaaaaaaaa");
                    console.log(occ);
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      success_msg:"You Are Update UOC Hour Info Successfully"
                     
                   })
                  }).catch(err =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      error_msg:"Error While Updating Course Info"
                     
                   })
                  })
              }
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating Course Info Please Try Later"
             
           })
          })
      }
    }else if (updatetype ==4){
      if(!updateinfo || isNaN(updateinfo)){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Please Insert New UOC Cost  First!"
         
       })
          
      }
      else{
          Course.findAll({where:{course_id:req.params.courseid}}).then(occ =>{
              if(!occ){
                res.render('allcourselist',{
                  department:occupation,     
                  course1:course1,
                  course2:course2,
                  course3:course3,
                  course4:course4,
                  course5:course5,
                  error_msg:"Cant Find UOC With This ID"
                 
               })
              }
              else{
                var cost = parseFloat(updateinfo);
                  Course.update({training_cost:cost},{where:{course_id:req.params.courseid}}).then( occ =>{
                    console.log("updaaaaaaaaaaaaaaaaaa");
                    console.log(cost);
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      success_msg:"You Are Update UOC Cost Info Successfully"
                     
                   })
                  }).catch(err =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      error_msg:"Error While Updating Course Info"
                     
                   })
                  })
              }
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating Course Info Please Try Later"
             
           })
          })
      }
    }else if (updatetype ==5){
      if(!updateinfo || isNaN(updateinfo)){
        res.render('allcourselist',{
          department:occupation,     
          course1:course1,
          course2:course2,
          course3:course3,
          course4:course4,
          course5:course5,
          error_msg:"Please Insert New UOC No Of LOs  First!"
         
       })
          
      }
      else{
          Course.findAll({where:{course_id:req.params.courseid}}).then(occ =>{
              if(!occ){
                res.render('allcourselist',{
                  department:occupation,     
                  course1:course1,
                  course2:course2,
                  course3:course3,
                  course4:course4,
                  course5:course5,
                  error_msg:"Cant Find UOC With This ID"
                 
               })
              }
              else{
                var cost = parseFloat(updateinfo);
                  Course.update({nooflo:cost},{where:{course_id:req.params.courseid}}).then( occ =>{
                    console.log("updaaaaaaaaaaaaaaaaaa");
                    console.log(cost);
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      success_msg:"You Are Update UOC No Of LOs Info Successfully"
                     
                   })
                  }).catch(err =>{
                    res.render('allcourselist',{
                      department:occupation,     
                      course1:course1,
                      course2:course2,
                      course3:course3,
                      course4:course4,
                      course5:course5,
                      error_msg:"Error While Updating Course Info"
                     
                   })
                  })
              }
          }).catch(err =>{
            res.render('allcourselist',{
              department:occupation,     
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              course5:course5,
              error_msg:"Error While Updating Course Info Please Try Later"
             
           })
          })
      }
    }


   }
   
});
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
router.post('/addnewcourse', ensureAuthenticated, async function(req, res) 
{
    const{occupationname,coursecode,traininghours,coursename,nolos,traininglevel,lodata,trainingcost} = req.body;
    let error = [];
    const occupation = await Occupation.findAll({});
    const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
    const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id "
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN  occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
    );
    console.log("bflsdhjdabfjsdfbhjxxxxxxxxxxxxxxxxxx")
    console.log(occupationname)
   if(!coursecode || !occupationname ||!traininghours || !coursename  ){
        error.push({msg:'Please add all required fields'})
   }
   else if(occupationname == "0" ){
    error.push({msg:'Please select name of occupation name'})
   }
   if(Math.floor(trainingcost) != trainingcost){
    error.push({msg:'Please enter the correct cost of UOCs '})
   }
   if(error.length >0){
  
   
    res.render('addnewcourse',{
      department:occupation,
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
        department_name:occupationname,
        training_level:traininglevel
       }}).then(courses =>{
           if(courses)
           {
            res.render('addnewcourse',{
              department:occupation,
              batchngo:batchngo,
              batchindustry:batchindustry,
              course1:course1,
              course2:course2,
              course3:course3,
              course4:course4,
              error_msg:'This UOC name  is already registered please try later'
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
            department_name:occupationname,
            course_code:coursecode,
            course_name:coursename,
            department_id:occupationname,
            training_hours:traininghours,
            training_level:traininglevel,
            semister:"",
            training_cost:trainingcost,
            program_type:"Level_Based",
            learning_obj:JSON.parse(lodata),
            nooflo:nolos
        }

        Course.create(courseData).then(coursesdt =>{
          res.render('addnewcourse',{
            department:occupation,
            batchngo:batchngo,
            batchindustry:batchindustry,
            course1:course1,
            course2:course2,
            course3:course3,
            course4:course4,
            success_msg:'Your are successfully registered new UOC for this occupation and level'
          
        });
         
        }).catch(error =>{
          console.log(error)
          res.render('addnewcourse',{
            department:occupation,
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
            department:occupation,
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
    const{batch,level1,traininghours,nolosngo,lodatango,trainingcost} = req.body;
    let error = [];
    const occupation = await Occupation.findAll({});
    const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
    const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id "
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
    );
   if(batch == "0" ){
    error.push({msg:'Please select name of batch name'})
   }
   if(Math.floor(trainingcost) != trainingcost){
    error.push({msg:'Please enter the correct cost of UOCs '})
   }
   if(error.length >0){
    res.render('addnewcourse',{
      department:occupation,
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
      training_hours:traininghours,
      training_level:course.training_level,
      semister:course.semister,
      nooflo:nolosngo,
      learning_obj:JSON.parse(lodatango),
      training_cost:trainingcost
      }
       console.log(courseData)
       NGOCourse.create(courseData)
  
       }).catch(error =>{
  
       })
    } 
   
       res.render('addnewcourse',{
      department:occupation,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      success_msg:'Successfully create UOCs for this batch of ngo based program trainees'})
     
   
    
     

     

   }
   
   
});
router.post('/addnewcourseindustry', ensureAuthenticated, async function(req, res) 
{
    const{batch,level1,traininghours,nolosind,lodataind,trainingcost} = req.body;
    let error = [];
    const occupation = await Occupation.findAll({});
    const batchngo = await Batch.findAll({where:{program_type:"ngo"}});
    const batchindustry = await Batch.findAll({where:{program_type:"industry"}});
    const [course1, metadata] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id= courses.department_id "
    );
    const [course2, metadata2] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_2'"
    );
    const [course3, metadata3] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id= courses.department_id where training_level='Level_3'"
    );
    const [course4, metadata4] = await sequelize.query(
      "SELECT * FROM courses INNER JOIN occupations ON occupations.occupation_id = courses.department_id where training_level='Level_4'"
    );
   if(batch == "0" ){
    error.push({msg:'Please select name of batch name'})
   }
   if(Math.floor(trainingcost) != trainingcost){
    error.push({msg:'Please enter the correct cost of UOCs '})
   }
   if(error.length >0){
    res.render('addnewcourse',{
      department:occupation,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      error_msg:'Please enter all required fields'
     
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
      training_hours:traininghours,
      training_level:course.training_level,
      semister:course.semister,
      nooflo:nolosind,
      training_cost:trainingcost,
      learning_obj:JSON.parse(lodataind),
      }
       console.log(courseData)
       IndustryCourse.create(courseData)
  
       }).catch(error =>{
  
       })
    } 
   
       res.render('addnewcourse',{
      department:occupation,
      batchngo:batchngo,
      batchindustry:batchindustry,
      course1:course1,
      course2:course2,
      course3:course3,
      course4:course4,
      success_msg:'Successfully create UOCs for this batch of industry based program trainees'})
     
   
    
     

     

   }
   
   
});

module.exports = router;

const express = require('express');
const router = express.Router();

const db = require('../models');
const LevelBasedTraining = db.levelbasedtraining;
const NGOBasedTraining = db.ngobasedtraining;
const IndustryBasedTraining = db.industrybasedtraining;
const FunderInfo = db.funderinfo;
const Department = db.departments;
const LevelBasedProgram = db.levelbasedprograms;
const IndustryBasedProgram = db.industrybasedprogram;
const Batch = db.batches;
const NGOBasedProgram  = db.ngobasedprograms;
const AppSelectionCriteria = db.appselectioncriterias;
const Course = db.courses;
const User = db.users;
const Notification = db.notifications;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { funderinfo } = require('../models');

router.get('/newlevelbased', ensureAuthenticated,async function (req, res) 
{
    const [results, metadata] = await sequelize.query(
        "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where is_confirm='No'"
      );
      
      console.log(JSON.stringify(results, null, 2));
    console.log(results);
        LevelBasedTraining.findAll({}).then(levelbased =>{
            res.render('newlevelbased',{
                levelbased:results,
                industrybased:'',
                ngobased:''
            })
        }).catch(error =>{
            res.render('newlevelbased',{
                levelbased:'',
                industrybased:'',
                ngobased:''
            })
        })
});
router.get('/newngobased', ensureAuthenticated, async function(req, res) {
    
    const [results, metadata] = await sequelize.query(
        "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where is_confirm='No'"
      );
      const funderinfo = await FunderInfo.findAll({});
      console.log(JSON.stringify(results, null, 2));
    console.log(results);
        NGOBasedTraining.findAll({}).then(levelbased =>{
            res.render('newngobased',{
                levelbased:results,
                industrybased:'',
                ngobased:results,
                funderinfo:funderinfo
            })
        }).catch(error =>{
            res.render('newngobased',{
                levelbased:'',
                industrybased:'',
                ngobased:'',
funderinfo:funderinfo,
            })
        })

});
router.get('/newindustrybased', ensureAuthenticated,async function (req, res){
    const [results, metadata] = await sequelize.query(
        "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where is_confirm='No'"
      );
      
      console.log(JSON.stringify(results, null, 2));
    console.log(results);
        IndustryBasedProgram.findAll({}).then(indbased =>{
            res.render('newindustrybased',{
                levelbased:'',
                industrybased:results,
                ngobased:''
            })
        }).catch(error =>{
            res.render('newindustrybased',{
                levelbased:'',
                industrybased:'',
                ngobased:'',
                funderinfo:funderinfo
            })
        })
});
router.post('/updateconfirmprogram', ensureAuthenticated, async function (req, res) {
   const{programid,infotag} = req.body;
   const [results, metadata] = await sequelize.query(
    "SELECT * FROM levelbasedprograms INNER JOIN batches ON batches.batch_id = levelbasedprograms.batch_id where is_confirm='No'"
  );
  const [resultsngo, metadatango] = await sequelize.query(
    "SELECT * FROM ngobasedprograms INNER JOIN batches ON batches.batch_id = ngobasedprograms.batch_id where is_confirm='No'"
  );
  const [resultsind, metadataind] = await sequelize.query(
    "SELECT * FROM industrybasedprograms INNER JOIN batches ON batches.batch_id = industrybasedprograms.batch_id where is_confirm='No'"
  );
  const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  const batchname = await Batch.findOne({where:{batch_id:programid}});
  proid = uuidv4(v1options);
  const funderinfo = await FunderInfo.findAll({});
  if(infotag =="level"){
    const note ={
      note_id:proid,
      notefrom:"Registrar",
      noteto:"REGISTRAR_DATA_ENCODER",
      is_read:"No",
      note:"New Level Based Program With Batch Name -"+batchname.batch_name+"- Is Ready. You Can Start Registration!"
    }
      LevelBasedProgram.update({is_confirm:"Yes"},{where:{program_id:programid}}).then(leveldt =>{
        Notification.create(note).then(()=>{
          res.render('newlevelbased',{
            levelbased:results,
            industrybased:'',
            ngobased:'',
            success_msg:'Successfully confirm new program to start registration'
        })
        }).catch(err =>{
          res.render('newlevelbased',{
            levelbased:results,
            industrybased:'',
            ngobased:'',
            success_msg:'Successfully confirm new program to start registration'
        })
        })
       
      }).catch(error =>{
        res.render('newlevelbased',{
            levelbased:results,
            industrybased:'',
            ngobased:'',
            error_msg:'cant update now please try again'
        })
      })
  
  }
  else if(infotag =="ngo"){
    const note ={
      note_id:proid,
      notefrom:"Registrar",
      noteto:"REGISTRAR_DATA_ENCODER",
      is_read:"No",
      note:"New Short Term/Project/ Based Program With Batch Name -"+batchname.batch_name+"- Is Ready. You Can Start Registration!"
    }
    NGOBasedProgram.update({is_confirm:"Yes"},{where:{program_id:programid}}).then(leveldt =>{
      Notification.create(note).then(()=>{
        res.render('newngobased',{
          levelbased:'',
          industrybased:'',
          ngobased:resultsngo,
          funderinfo:funderinfo,
          success_msg:'Successfully confirm new program to start registration'
      })
      }).catch(err =>{
        res.render('newngobased',{
          levelbased:'',
          industrybased:'',
          ngobased:resultsngo,
          funderinfo:funderinfo,
          success_msg:'Successfully confirm new program to start registration'
      })
      })
     
    }).catch(error =>{
        res.render('newngobased',{
            levelbased:'',
            industrybased:'',
            funderinfo:funderinfo,
            ngobased:resultsngo,
            error_msg:'cant update now please try again'
        })
    })
   
  }
  else if(infotag == "industry"){
    const note ={
      note_id:proid,
      notefrom:"Registrar",
      noteto:"REGISTRAR_DATA_ENCODER",
      is_read:"No",
      note:"New Industry Based Program With Batch Name -"+batchname.batch_name+"- Is Ready. You Can Start Registration!"
    }
    IndustryBasedProgram.update({is_confirm:"Yes"},{where:{program_id:programid}}).then(leveldt =>{
      Notification.create(note).then(()=>{
        res.render('newindustrybased',{
          levelbased:'',
          industrybased:resultsind,
          ngobased:'',
          success_msg:'Successfully confirm new program to start registration'
      })
      }).catch(err =>{
        res.render('newindustrybased',{
          levelbased:'',
          industrybased:resultsind,
          ngobased:'',
          success_msg:'Successfully confirm new program to start registration'
      })
      })
    
    }).catch(error =>{
        res.render('newindustrybased',{
            levelbased:'',
            industrybased:resultsind,
            ngobased:'',
            error_msg:'cant update now please try again'
        })
    })
   
  }
  
});

router.get('/allbatchlist',ensureAuthenticated,async function(req,res){
     const [batchl, metadata] = await sequelize.query(
        "SELECT * FROM batches INNER JOIN levelbasedprograms ON batches.batch_id = levelbasedprograms.batch_id "
      );
      const [batchn, metadatan] = await sequelize.query(
        "SELECT * FROM batches INNER JOIN  ngobasedprograms on ngobasedprograms.batch_id =batches.batch_id "
      );
      const [batchi, metadatai] = await sequelize.query(
        "SELECT * FROM batches INNER JOIN  industrybasedprograms on industrybasedprograms.batch_id = batches.batch_id"
      );
    res.render('allbatchlist',{batch:batchl,batchi:batchi,batchn:batchn})
})

router.post('/changetonotcurrent/(:batchid)',ensureAuthenticated,async function(req,res){
    const [batchl, metadata] = await sequelize.query(
       "SELECT * FROM batches INNER JOIN levelbasedprograms ON batches.batch_id = levelbasedprograms.batch_id "
     );
     const [batchn, metadatan] = await sequelize.query(
       "SELECT * FROM batches INNER JOIN  ngobasedprograms on ngobasedprograms.batch_id =batches.batch_id "
     );
     const [batchi, metadatai] = await sequelize.query(
       "SELECT * FROM batches INNER JOIN  industrybasedprograms on industrybasedprograms.batch_id = batches.batch_id"
     );
     Batch.findOne({where:{batch_id:req.params.batchid}}).then( ba=>{
        if(ba){
            Batch.update({is_current:'No'},{where:{batch_id:req.params.batchid}}).then(batc =>{
                res.render('allbatchlist',{batch:batchl,batchi:batchi,batchn:batchn,
                
                success_msg:"Successfully update batch status"})
            }).catch(err =>{
                res.render('allbatchlist',{batch:batchl,batchi:batchi,batchn:batchn})
            })
        }
     }).catch(error =>{
        res.render('allbatchlist',{batch:batchl,batchi:batchi,batchn:batchn})
     })
  
})


module.exports = router;

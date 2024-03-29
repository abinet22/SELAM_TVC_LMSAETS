const dbConfig = require("../config/dbconfig.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
const Batch = require('./Batch')(sequelize, Sequelize);
const LevelBasedProgram = require('./LevelBasedProgram')(sequelize, Sequelize);
const NGOBasedProgram =require('./NGOBasedProgram')(sequelize, Sequelize);
const IndustryBasedProgram =require('./IndustryBasedProgram')(sequelize, Sequelize);
const NGOBasedTraining = require('./NGOBasedTraining')(sequelize, Sequelize);
const LevelBasedTraining = require('./LevelBasedTraining')(sequelize, Sequelize);
const FunderInfo =  require("./FunderInfo.js")(sequelize, Sequelize);
const Department =  require("./Department.js")(sequelize, Sequelize);
const Course =  require("./Course.js")(sequelize, Sequelize);
const NGOCourse =  require("./NGOCourse")(sequelize, Sequelize);
const IndustryCourse =  require("./IndustryCourse")(sequelize, Sequelize);
const SectorList = require("./SectorList.js")(sequelize, Sequelize);
const Occupation = require("./Occupation.js")(sequelize, Sequelize);
const Notification = require("./Notification")(sequelize, Sequelize);
LevelBasedTraining.hasMany(Department);
Department.belongsTo(LevelBasedTraining);
Batch.hasOne(LevelBasedProgram);

LevelBasedProgram.belongsTo(Batch);

Department.hasMany(Course);
Course.belongsTo(Department);


FunderInfo.hasMany(NGOBasedTraining);
NGOBasedTraining.belongsTo(FunderInfo);
db.users = require("../models/User.js")(sequelize, Sequelize);
db.companies = require('./Company')(sequelize,Sequelize);
db.levelbasedtrainees = require('./LevelBasedTrainee')(sequelize,Sequelize);
db.ngobasedtrainees = require('./NGOBasedTrainee')(sequelize,Sequelize);
db.appselectioncriterias = require("../models/AppSelectionCriteria")(sequelize, Sequelize);
db.levelbasedtraining = LevelBasedTraining;
db.ngobasedtraining = NGOBasedTraining;
db.industrybasedtraining = require("../models/IndustryBasedTraining.js")(sequelize, Sequelize);
db.funderinfo = FunderInfo;
db.departments = Department;
db.courses = Course;
db.ngocourses = NGOCourse;
db.notifications = Notification;
db.industrycourses = IndustryCourse;
db.batches = Batch;
db.levelbasedprograms =LevelBasedProgram;
db.ngobasedprograms =NGOBasedProgram;
db.industrybasedprograms = IndustryBasedProgram;
db.occupations = Occupation;
db.sectorlists = SectorList;
module.exports = db;
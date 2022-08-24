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
const IndustryCourse = require("./IndustryCourse.js") (sequelize,Sequelize);
const NGOCourse = require("./NGOCourse.js") (sequelize,Sequelize);

const CourseTeacherClass = require('./CourseTeacherClass') (sequelize,Sequelize);
const StaffList = require('./StaffList')(sequelize, Sequelize);
const Batch = require('./Batch')(sequelize, Sequelize);
const LevelBasedProgram = require('./LevelBasedProgram')(sequelize, Sequelize);
const NGOBasedProgram = require('./NGOBasedProgram')(sequelize, Sequelize);
const IndustryBasedProgram = require('./IndustryBasedProgram')(sequelize,Sequelize);
const NGOBasedTraining = require('./NGOBasedTraining')(sequelize, Sequelize);
const LevelBasedTraining = require('./LevelBasedTraining')(sequelize, Sequelize);
const FunderInfo =  require("./FunderInfo.js")(sequelize, Sequelize);
const Department =  require("./Department.js")(sequelize, Sequelize);
const Course =  require("./Course.js")(sequelize, Sequelize);
const NewApplicant =  require("./NewApplicant")(sequelize, Sequelize);
const ClassInDept = require("./Class.js")(sequelize, Sequelize);
const LevelBasedTrainee =require("./LevelBasedTrainee")(sequelize, Sequelize);
const NGOBasedTrainee = require('./NGOBasedTrainee')(sequelize, Sequelize);
const Occupation =require("./Occupation")(sequelize, Sequelize);
const SectorList = require('./SectorList')(sequelize, Sequelize);
db.occupations = Occupation;
db.sectorlists = SectorList;
LevelBasedTraining.hasMany(Department);
Department.belongsTo(LevelBasedTraining);
Batch.hasOne(LevelBasedProgram);
const Company = require('./Company')(sequelize,Sequelize);
// LevelBasedTrainee.hasOne(Department);
// Department.belongsTo(LevelBasedTrainee);
// LevelBasedTrainee.hasOne(Batch);
// LevelBasedProgram.belongsTo(Batch);
Department.hasMany(Course);
Course.belongsTo(Department);
Department.hasMany(ClassInDept);
ClassInDept.belongsTo(Department);
Batch.hasMany(ClassInDept);
ClassInDept.belongsTo(Batch);
FunderInfo.hasMany(NGOBasedTraining);
NGOBasedTraining.belongsTo(FunderInfo);
db.users = require("../models/User.js")(sequelize, Sequelize);
db.appselectioncriterias = require("../models/AppSelectionCriteria")(sequelize, Sequelize);
db.levelbasedtraining = LevelBasedTraining;
db.ngobasedtraining = NGOBasedTraining;
db.industrybasedtraining = require("../models/IndustryBasedTraining.js")(sequelize, Sequelize);
db.levelbasedprogresses = require("../models/LevelBasedProgress.js")(sequelize, Sequelize);

db.funderinfo = FunderInfo;
db.departments = Department;
db.courses = Course;
db.industrycourses = IndustryCourse;
db.industrybasedprograms = IndustryBasedProgram;
db.ngocourses = NGOCourse
db.batches = Batch;
db.courseteacherclasses  = CourseTeacherClass;
db.classindepts = ClassInDept
db.levelbasedprograms =LevelBasedProgram
db.newapplicants = NewApplicant;
db.levelbasedtrainees = LevelBasedTrainee;
db.ngobasedprograms =NGOBasedProgram;
db.ngobasedtrainees = NGOBasedTrainee;
db.stafflists = StaffList;
db.companies = Company;
db.studentmarklistlevelbaseds = require('./StudentMarkListLevelBased')(sequelize,Sequelize);

db.industrybasedtrainees = require('./IndustryBasedTrainee')(sequelize,Sequelize);
module.exports = db;
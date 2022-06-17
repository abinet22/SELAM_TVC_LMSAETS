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
const NGOBasedTraining = require('./NGOBasedTraining')(sequelize, Sequelize);
const LevelBasedTraining = require('./LevelBasedTraining')(sequelize, Sequelize);
const FunderInfo =  require("./FunderInfo.js")(sequelize, Sequelize);
const Department =  require("./Department.js")(sequelize, Sequelize);
const Course =  require("./Course.js")(sequelize, Sequelize);

LevelBasedTraining.hasMany(Department);
Department.belongsTo(LevelBasedTraining);

Department.hasMany(Course);
Course.belongsTo(Department);


FunderInfo.hasMany(NGOBasedTraining);
NGOBasedTraining.belongsTo(FunderInfo);
db.users = require("../models/User.js")(sequelize, Sequelize);
db.appselectioncriterias = require("../models/AppSelectionCriteria")(sequelize, Sequelize);
db.levelbasedtraining = LevelBasedTraining;
db.ngobasedtraining = NGOBasedTraining;
const StaffList = require('./StaffList')(sequelize,Sequelize);
const Batch = require('./Batch')(sequelize,Sequelize);
const NGOCourse = require('./NGOCourse')(sequelize,Sequelize);
const IndustryCourse = require('./IndustryCourse')(sequelize,Sequelize);
db.industrybasedtraining = require("../models/IndustryBasedTraining.js")(sequelize, Sequelize);
db.funderinfo = FunderInfo;
db.departments = Department;
db.courses = Course;
db.batches = Batch;
db.stafflists = StaffList;
db.ngocourses = NGOCourse;
db.industrycourses = IndustryCourse;


module.exports = db;
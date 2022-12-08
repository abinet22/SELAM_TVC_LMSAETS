module.exports = (sequelize, DataTypes) => {
   
    const CourseTeacherClass = sequelize.define("courseteacherclass", {
        batch_id: {
            type: DataTypes.STRING,
        },
        course_id : {
            type: DataTypes.STRING,
        },
        teacher_id: {
            type: DataTypes.STRING,
        },
        level : {
            type: DataTypes.STRING,
        },
        department_id : {
            type: DataTypes.STRING,
        },
        class_id: {
            type: DataTypes.STRING,
        },
        program_type:{
            type: DataTypes.STRING,
        },
        startdate:{
            type: DataTypes.STRING,
        },
        enddate:{
            type: DataTypes.STRING,
        }
       
    });

  
    return CourseTeacherClass;
}
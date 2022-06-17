
module.exports = (sequelize, DataTypes) => {
   
    const LevelBasedProgress = sequelize.define("levelbasedprogress", {
        class_id: {
            type: DataTypes.STRING,
        },
        batch_id: {
            type: DataTypes.STRING,
        },
        program_type: {
            type: DataTypes.STRING,
        },
        training_level: {
            type: DataTypes.STRING,
        },
        department_id: {
            type: DataTypes.STRING,
        },
        teacher_id: {
            type: DataTypes.STRING,
        },
        student_id: {
            type: DataTypes.STRING,
        },
        course_id:{
            type: DataTypes.STRING,
        },
        practical_evaluation:{
            type: DataTypes.JSON,
        },
        theroretical_evaluation:{
            type: DataTypes.JSON,
        },
        industry_evaluation:{
            type: DataTypes.JSON,
        },
        is_confirm_registrar:{
            type: DataTypes.STRING,
        },
        is_confirm_department:{
            type: DataTypes.STRING,
        },
        is_confirm_teacher:{
            type: DataTypes.STRING,
        }

    });

  
    return LevelBasedProgress;
}
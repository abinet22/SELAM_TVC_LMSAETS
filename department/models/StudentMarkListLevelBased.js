
module.exports = (sequelize, DataTypes) => {
   
    const StudentMarkListLevelBased = sequelize.define("studentmarklistlevelbased", {
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
            type: DataTypes.DECIMAL,
        },
        theroretical_evaluation:{
            type: DataTypes.DECIMAL,
        },
        industry_evaluation:{
            type: DataTypes.DECIMAL,
        },
        institutional_total:{
            type: DataTypes.DECIMAL(10,2),
        },
        industry_total:{
            type: DataTypes.DECIMAL(10,2),
        },
        total_result:{
            type: DataTypes.DECIMAL(10,2),
        },
        grade_in_latter:{
            type: DataTypes.STRING,
        },
        grade_in_point:{
            type: DataTypes.DECIMAL(10,2),
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

  
    return StudentMarkListLevelBased;
}